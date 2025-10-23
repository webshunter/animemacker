import Groq from "groq-sdk";
import { SceneOutput, Character } from '../types';

console.log("Environment check - VITE_GROQ_API_KEY:", import.meta.env.VITE_GROQ_API_KEY ? "Present" : "Missing");

if (!import.meta.env.VITE_GROQ_API_KEY) {
  throw new Error("VITE_GROQ_API_KEY environment variable not set");
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Groq AI service for text generation
export const generateScenePrompts = async (idea: string, character?: Character | null): Promise<SceneOutput> => {
  console.log("🚀 generateScenePrompts called with idea:", idea);
  console.log("🚀 Character:", character ? character.name : "No character");
  
  const characterContext = character ? `
Character Details:
- Name: ${character.name}
- Description: ${character.description}
` : '';

  const prompt = `You are an expert anime scene director. Generate detailed prompts for an anime scene based on the user's idea.

${characterContext}

User's Scene Idea: "${idea}"

Please generate:
1. A compelling scene title
2. A detailed image prompt for generating an anime-style image
3. A detailed video prompt for creating a video scene

Focus on:
- Character actions, movements, and expressions
- Environmental details and atmosphere
- Anime art style characteristics
- Dynamic composition and camera angles
- Emotional tone and mood

Respond with a JSON object in this exact format:
{
  "title": "Scene title here",
  "image_prompt": "Detailed image prompt here",
  "video_prompt": "Detailed video prompt here"
}`;

  try {
    console.log("🤖 Calling Groq API...");
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 1000
    });

    console.log("✅ Groq API response received");
    console.log("Response content:", response.choices[0]?.message?.content);

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from response (remove markdown formatting if present)
    let jsonString = content.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Remove any control characters
    jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '');
    
    console.log("Cleaned JSON string:", jsonString);
    
    const result = JSON.parse(jsonString);
    
    console.log("✅ Parsed result:", result);
    
    return {
      title: result.title || `${character?.name || 'Anime character'} in ${idea}`,
      image_prompt: result.image_prompt || `Anime art style, high quality, detailed illustration featuring ${character?.name || 'an anime character'}, ${idea}`,
      video_prompt: result.video_prompt || `Slow zoom in on ${character?.name || 'anime character'} as they begin their scene. Camera follows their movements with smooth tracking shots.`
    };
  } catch (error) {
    console.error("❌ Groq API error:", error);
    return generateFallbackScenePrompts(idea, character);
  }
};

// Fallback function for generating scene prompts without AI
const generateFallbackScenePrompts = (idea: string, character?: Character | null): SceneOutput => {
  const characterName = character ? character.name : "anime character";
  const characterTraits = character ? character.description : "a beautiful anime character";
  
  // Extract key elements from idea
  const ideaWords = idea.toLowerCase().split(/[\s,.-]+/).filter(word => word.length > 0);
  
  // Action detection
  const hasSleep = ideaWords.some(word => ['sleep', 'sleeping', 'tired', 'rest', 'bed', 'nap', 'drowsy', 'exhausted', 'go'].includes(word)) || 
                   idea.toLowerCase().includes('go sleep') || 
                   idea.toLowerCase().includes('go to sleep');
  
  // Generate title
  const title = `${characterName} in ${idea}`;
  
  // Generate image prompt based on detected actions
  let imagePrompt = `Anime art style, high quality, detailed illustration featuring ${characterTraits}`;
  
  if (hasSleep) {
    imagePrompt += `, showing ${characterName} in a tired, drowsy state with half-closed eyes, yawning, rubbing eyes, or preparing for sleep, cozy bedroom setting with soft lighting, warm and peaceful atmosphere`;
  } else {
    imagePrompt += `, dynamic pose with expressive body language, ${idea}`;
  }
  
  imagePrompt += `, with soft natural lighting, cinematic composition, detailed anime art style, clean line art, vibrant colors, detailed shading, dynamic camera angle, professional anime illustration`;
  
  // Generate video prompt
  let videoPrompt = `Slow zoom in on ${characterName} as they begin their scene. Camera follows their movements with smooth tracking shots.`;
  
  if (hasSleep) {
    videoPrompt = `Gentle camera movement showing ${characterName} in a peaceful, sleepy state. Soft lighting transitions as they prepare for rest. Slow, calming camera work with smooth transitions.`;
  }
  
  videoPrompt += ` The scene captures the emotion and energy of the moment with film-style camera work, smooth transitions, and professional cinematography`;
  
  return {
    title,
    image_prompt: imagePrompt,
    video_prompt: videoPrompt
  };
};

// Image generation is handled by fallback SVG generation
export const generateImageWithReference = async (prompt: string, characterImage?: string): Promise<string> => {
  // Since Groq doesn't support image generation, we'll use fallback SVG
  return generateFallbackImage(prompt);
};

// Fallback SVG image generation
const generateFallbackImage = (prompt: string): string => {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="200" y="150" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">
        AI Generated Scene
      </text>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">
        ${prompt.substring(0, 50)}...
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};