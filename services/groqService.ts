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

  const prompt = `You are an expert anime scene director creating content for 6-second short videos. Generate concise yet meaningful content based on the user's idea.

${characterContext}

User's Scene Idea: "${idea}"

Please generate:
1. A compelling scene title (2-4 words max)
2. A detailed image prompt for generating an anime-style image that shows the character's emotions and actions
3. A short, poetic description (1-2 sentences max) that captures the essence and deeper meaning

Requirements for the description:
- Must be SHORT (under 20 words)
- Must be POETIC and MEANINGFUL
- Must capture the EMOTIONAL ESSENCE
- Must be suitable for 6-second video
- Must be PHILOSOPHICAL or INSPIRATIONAL

Examples of good descriptions:
- "Every station is a goodbye. Every sunrise is a new chance."
- "In the silence between heartbeats, we find our truth."
- "Some journeys end where others begin."
- "The weight of tomorrow rests in today's choices."

Focus on:
- Deep, philosophical meaning
- Emotional resonance
- Life lessons in few words
- Poetic language
- Universal truths

Respond with a JSON object in this exact format:
{
  "title": "Short meaningful title",
  "image_prompt": "Detailed visual prompt showing character's emotions and actions",
  "video_prompt": "Short, poetic, meaningful description (under 20 words)"
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
  
  // Generate short, poetic description for 6-second video
  let meaningfulDescription = `In the silence between heartbeats, we find our truth.`;
  
  if (hasSleep) {
    meaningfulDescription = `Every ending is a new beginning. Rest well, dream deep.`;
  } else if (idea.toLowerCase().includes('train') || idea.toLowerCase().includes('journey')) {
    meaningfulDescription = `Every station is a goodbye. Every sunrise is a new chance.`;
  } else if (idea.toLowerCase().includes('rain') || idea.toLowerCase().includes('storm')) {
    meaningfulDescription = `In the storm, we find our strength.`;
  } else if (idea.toLowerCase().includes('love') || idea.toLowerCase().includes('heart')) {
    meaningfulDescription = `The heart remembers what the mind forgets.`;
  } else if (idea.toLowerCase().includes('friend') || idea.toLowerCase().includes('together')) {
    meaningfulDescription = `Some bonds are written in the stars.`;
  } else {
    meaningfulDescription = `The weight of tomorrow rests in today's choices.`;
  }
  
  return {
    title,
    image_prompt: imagePrompt,
    video_prompt: meaningfulDescription
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