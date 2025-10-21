
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SceneOutput } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING,
      description: "A creative, short title for the scene."
    },
    image_prompt: { 
      type: Type.STRING,
      description: "The detailed image description for an AI image generator."
    },
    video_prompt: { 
      type: Type.STRING,
      description: "The detailed video prompt for an AI image-to-video generator."
    },
  },
  required: ['title', 'image_prompt', 'video_prompt'],
};

export const generateScenePrompts = async (idea: string, character?: Character | null): Promise<SceneOutput> => {
  const characterContext = character ? `
    Character Reference: ${character.name} - ${character.description}
    Use this character as the main subject in the scene. Incorporate their specific appearance, personality, and style into the scene description.
  ` : `
    No specific character reference provided. Create a generic anime character that fits the scene.
  `;

  const prompt = `
    Generate a cinematic anime scene based on the following idea: "${idea}"

    ${characterContext}

    For this idea, generate two distinct outputs:

    1.  **Image Description (for an AI image generator like Nano Banana):**
        - Style: high-quality anime art, cinematic lighting, soft shading, dynamic composition.
        - Describe the full scene in detail, including character appearance (gender, outfit, expression, pose, motion hint), background (e.g., city, forest) with anime-style lighting, emotion, time of day, and camera angle.
        - The description must reflect the core concept: daily life x dance x anime vibes and action.
        ${character ? `- Focus on the character "${character.name}" with their specific traits: ${character.description}` : ''}

    2.  **Video Prompt (for an AI image-to-video generator like Grok AI):**
        - Duration: 20-35 seconds.
        - Describe camera movement (zoom, rotation, panning) and character movement/dance with film-style wording (e.g., "slow zoom-in," "dynamic tracking shot," "fast camera rotation").
        - Maintain an anime movie feel with expressive movement, emotional pacing, and clear action energy.
        ${character ? `- Focus on the character "${character.name}" and their unique movement style` : ''}

    Return the result in a single, valid JSON object that adheres to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult: SceneOutput = JSON.parse(jsonText);
    return parsedResult;
  } catch (error) {
    console.error("Error generating scene prompts:", error);
    
    // Fallback: Generate scene prompts without AI
    console.log("Using fallback scene generation...");
    return generateFallbackScenePrompts(idea, character);
  }
};

// Fallback function untuk generate scene prompts tanpa AI
const generateFallbackScenePrompts = (idea: string, character?: Character | null): SceneOutput => {
  const characterName = character ? character.name : "anime character";
  const characterTraits = character ? character.description : "a beautiful anime character";
  
  // Extract key elements from idea
  const ideaWords = idea.toLowerCase().split(' ');
  const hasDance = ideaWords.some(word => ['dance', 'dancing', 'move', 'movement'].includes(word));
  const hasRain = ideaWords.some(word => ['rain', 'rainy', 'water'].includes(word));
  const hasNight = ideaWords.some(word => ['night', 'dark', 'evening', 'moon'].includes(word));
  const hasCity = ideaWords.some(word => ['city', 'street', 'urban', 'tokyo'].includes(word));
  const hasSchool = ideaWords.some(word => ['school', 'classroom', 'high school'].includes(word));
  const hasForest = ideaWords.some(word => ['forest', 'woods', 'nature', 'trees'].includes(word));
  
  // Generate title
  const title = `${characterName} in ${idea}`;
  
  // Generate detailed image prompt for anime character and movement
  let imagePrompt = `Anime art style, high quality, detailed illustration featuring ${characterTraits}`;
  
  // Character details
  if (character) {
    // Extract character details from description
    const desc = character.description.toLowerCase();
    if (desc.includes('hair')) {
      const hairColor = desc.match(/(red|blue|green|yellow|pink|purple|silver|black|white|brown|blonde) hair/i);
      if (hairColor) {
        imagePrompt += `, ${hairColor[1]} hair`;
      }
    }
    if (desc.includes('eyes')) {
      const eyeColor = desc.match(/(red|blue|green|yellow|pink|purple|silver|black|white|brown) eyes/i);
      if (eyeColor) {
        imagePrompt += `, ${eyeColor[1]} eyes`;
      }
    }
    if (desc.includes('energetic') || desc.includes('cheerful')) {
      imagePrompt += `, bright cheerful expression`;
    } else if (desc.includes('mysterious') || desc.includes('cool')) {
      imagePrompt += `, cool mysterious expression`;
    }
  }
  
  // Movement and pose details
  if (hasDance) {
    imagePrompt += `, dynamic dancing pose with flowing movement, arms extended gracefully, body in motion`;
  } else if (ideaWords.some(word => ['run', 'running', 'sprint'].includes(word))) {
    imagePrompt += `, dynamic running pose, hair flowing behind, determined expression`;
  } else if (ideaWords.some(word => ['jump', 'jumping', 'leap'].includes(word))) {
    imagePrompt += `, mid-air jumping pose, arms raised, energetic expression`;
  } else if (ideaWords.some(word => ['sit', 'sitting', 'rest'].includes(word))) {
    imagePrompt += `, relaxed sitting pose, peaceful expression`;
  } else {
    imagePrompt += `, dynamic pose with expressive body language`;
  }
  
  // Environment details
  if (hasRain) {
    imagePrompt += `, in the rain with water droplets visible on character and background, wet hair and clothes`;
  }
  
  if (hasNight) {
    imagePrompt += `, nighttime scene with dramatic lighting, city lights or moonlight illuminating the character`;
  } else if (hasSchool) {
    imagePrompt += `, school setting with classroom or hallway background, bright natural lighting`;
  } else if (hasForest) {
    imagePrompt += `, forest setting with trees and natural elements, dappled sunlight filtering through leaves`;
  } else if (hasCity) {
    imagePrompt += `, urban city setting with buildings and street elements, vibrant city atmosphere`;
  } else {
    imagePrompt += `, with soft natural lighting`;
  }
  
  // Art style details
  imagePrompt += `, cinematic composition, detailed anime art style, clean line art, vibrant colors, detailed shading, dynamic camera angle, professional anime illustration`;
  
  // Generate video prompt
  let videoPrompt = `Slow zoom in on ${characterName} as they begin their scene`;
  
  if (hasDance) {
    videoPrompt += `. Camera follows their graceful dance movements with smooth tracking shots, capturing the rhythm and flow of their movements`;
  } else if (ideaWords.some(word => ['run', 'running', 'sprint'].includes(word))) {
    videoPrompt += `. Camera follows their running with dynamic tracking shots, capturing the speed and determination`;
  } else if (ideaWords.some(word => ['jump', 'jumping', 'leap'].includes(word))) {
    videoPrompt += `. Camera captures their jumping movement with upward tracking, emphasizing the height and energy`;
  } else {
    videoPrompt += `. Camera follows their movements with smooth tracking shots`;
  }
  
  if (hasRain) {
    videoPrompt += `. Rain drops create a cinematic atmosphere, adding depth and mood to the scene`;
  }
  
  if (hasNight) {
    videoPrompt += `. Night lighting creates dramatic shadows and highlights, enhancing the emotional impact`;
  }
  
  videoPrompt += `. The scene captures the emotion and energy of the moment with film-style camera work, smooth transitions, and professional cinematography`;
  
  return {
    title,
    image_prompt: imagePrompt,
    video_prompt: videoPrompt
  };
};

export const generateImageWithReference = async (prompt: string, base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1], // Remove the data URI prefix
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Using the provided reference image for the character, generate a new image based on this scene: ${prompt}`,
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image was generated by the model.");

  } catch (error) {
    console.error("Error generating image with reference:", error);
    
    // Fallback: Generate a simple scene image
    console.log("Using fallback image generation...");
    return generateFallbackSceneImage(prompt);
  }
};

// Fallback function untuk generate scene image tanpa AI
const generateFallbackSceneImage = (prompt: string): string => {
  // Extract key elements from prompt
  const promptWords = prompt.toLowerCase().split(' ');
  const hasDance = promptWords.some(word => ['dance', 'dancing', 'move', 'movement'].includes(word));
  const hasRain = promptWords.some(word => ['rain', 'rainy', 'water'].includes(word));
  const hasNight = promptWords.some(word => ['night', 'dark', 'evening', 'moon'].includes(word));
  const hasCity = promptWords.some(word => ['city', 'street', 'urban', 'tokyo'].includes(word));
  
  // Generate colors based on content
  let bgColor = '#87CEEB'; // Sky blue
  let charColor = '#FFB6C1'; // Light pink
  let accentColor = '#FFD700'; // Gold
  
  if (hasNight) {
    bgColor = '#191970'; // Midnight blue
    charColor = '#E6E6FA'; // Lavender
    accentColor = '#FFD700'; // Gold
  }
  
  if (hasRain) {
    accentColor = '#B0C4DE'; // Light steel blue
  }
  
  // Generate SVG scene
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="400" height="300" fill="${bgColor}"/>
      
      <!-- Ground/Floor -->
      <rect x="0" y="250" width="400" height="50" fill="${hasCity ? '#696969' : '#90EE90'}"/>
      
      <!-- Character (simplified anime style) -->
      <circle cx="200" cy="180" r="25" fill="${charColor}"/>
      <rect x="185" y="205" width="30" height="40" fill="${charColor}"/>
      <rect x="175" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="210" y="210" width="15" height="30" fill="${charColor}"/>
      
      ${hasDance ? `
      <!-- Dance movement lines -->
      <path d="M150 200 Q200 150 250 200" stroke="${accentColor}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M180 220 Q200 180 220 220" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.5"/>
      ` : ''}
      
      ${hasRain ? `
      <!-- Rain drops -->
      <g stroke="${accentColor}" stroke-width="1" opacity="0.6">
        <line x1="50" y1="50" x2="55" y2="80"/>
        <line x1="100" y1="30" x2="105" y2="60"/>
        <line x1="150" y1="70" x2="155" y2="100"/>
        <line x1="200" y1="40" x2="205" y2="70"/>
        <line x1="250" y1="60" x2="255" y2="90"/>
        <line x1="300" y1="20" x2="305" y2="50"/>
        <line x1="350" y1="80" x2="355" y2="110"/>
      </g>
      ` : ''}
      
      ${hasCity ? `
      <!-- City buildings -->
      <rect x="0" y="150" width="30" height="100" fill="#2F4F4F"/>
      <rect x="40" y="120" width="25" height="130" fill="#2F4F4F"/>
      <rect x="80" y="140" width="35" height="110" fill="#2F4F4F"/>
      <rect x="130" y="100" width="20" height="150" fill="#2F4F4F"/>
      <rect x="270" y="130" width="30" height="120" fill="#2F4F4F"/>
      <rect x="320" y="110" width="25" height="140" fill="#2F4F4F"/>
      <rect x="360" y="160" width="40" height="90" fill="#2F4F4F"/>
      ` : `
      <!-- Nature elements -->
      <circle cx="80" cy="200" r="15" fill="#228B22"/>
      <circle cx="320" cy="190" r="20" fill="#228B22"/>
      <circle cx="50" cy="180" r="10" fill="#32CD32"/>
      <circle cx="350" cy="200" r="12" fill="#32CD32"/>
      `}
      
      <!-- Title -->
      <text x="200" y="280" text-anchor="middle" font-family="Arial" font-size="14" fill="white" stroke="black" stroke-width="0.5">
        Generated Scene
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
