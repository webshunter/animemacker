
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

// Groq doesn't use JSON schema like Gemini, so we'll use structured prompting
export const generateScenePrompts = async (idea: string, character?: Character | null): Promise<SceneOutput> => {
  console.log("🚀 generateScenePrompts called with idea:", idea);
  console.log("🚀 Character:", character ? character.name : "No character");
  
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
        - IMPORTANT: Focus on what the character is DOING in the scene, not just their appearance.
        - Describe the character's ACTION, MOVEMENT, and ACTIVITY in detail (dancing, running, jumping, sitting, fighting, etc.).
        - Include character appearance (gender, outfit, expression, pose) but prioritize the ACTION they are performing.
        - Describe the full scene including background (e.g., city, forest) with anime-style lighting, emotion, time of day, and camera angle.
        - The description must show the character actively doing something related to: "${idea}"
        ${character ? `- Focus on the character "${character.name}" performing the action with their specific traits: ${character.description}` : ''}

    2.  **Video Prompt (for an AI image-to-video generator like Grok AI):**
        - Duration: 20-35 seconds.
        - Describe camera movement (zoom, rotation, panning) and character movement/dance with film-style wording (e.g., "slow zoom-in," "dynamic tracking shot," "fast camera rotation").
        - Focus on the character's ACTION and MOVEMENT throughout the video.
        - Maintain an anime movie feel with expressive movement, emotional pacing, and clear action energy.
        ${character ? `- Focus on the character "${character.name}" performing their unique action and movement style` : ''}

    Return the result in a single, valid JSON object with this exact format:
    {
      "title": "A creative, short title for the scene",
      "image_prompt": "The detailed image description for an AI image generator",
      "video_prompt": "The detailed video prompt for an AI image-to-video generator"
    }
  `;

  try {
    console.log("Calling Groq API with prompt:", prompt.substring(0, 200) + "...");
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
        temperature: 0.8,
      max_tokens: 2000,
    });

    console.log("Groq API response:", response.choices[0]?.message?.content?.substring(0, 200) + "...");

    const jsonText = response.choices[0]?.message?.content?.trim();
    if (!jsonText) {
      throw new Error("No response from Groq");
    }

    // Extract JSON from response (remove markdown formatting)
    let cleanJsonText = jsonText;
    if (jsonText.includes('```json')) {
      cleanJsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      cleanJsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    // Remove control characters and fix JSON
    cleanJsonText = cleanJsonText.replace(/[\x00-\x1F\x7F]/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ');

    const parsedResult: SceneOutput = JSON.parse(cleanJsonText);
    console.log("Groq generated result:", parsedResult);
    return parsedResult;
  } catch (error) {
    console.error("Error generating scene prompts with Groq:", error);
    
    // Fallback: Generate scene prompts without AI
    console.log("Using fallback scene generation...");
    return generateFallbackScenePrompts(idea, character);
  }
};

// Fallback function untuk generate scene prompts tanpa AI
const generateFallbackScenePrompts = (idea: string, character?: Character | null): SceneOutput => {
  const characterName = character ? character.name : "anime character";
  const characterTraits = character ? character.description : "a beautiful anime character";
  
  // Extract key elements from idea - MORE COMPREHENSIVE DETECTION
  const ideaWords = idea.toLowerCase().split(/[\s,.-]+/).filter(word => word.length > 0);
  
  // Action detection - more comprehensive
  const hasDance = ideaWords.some(word => ['dance', 'dancing', 'move', 'movement', 'groove', 'rhythm', 'beat'].includes(word));
  const hasRun = ideaWords.some(word => ['run', 'running', 'sprint', 'jog', 'race', 'chase', 'flee'].includes(word));
  const hasJump = ideaWords.some(word => ['jump', 'jumping', 'leap', 'hop', 'bounce', 'spring'].includes(word));
  const hasFight = ideaWords.some(word => ['fight', 'fighting', 'battle', 'combat', 'war', 'attack', 'defend'].includes(word));
  const hasSing = ideaWords.some(word => ['sing', 'singing', 'music', 'song', 'vocal', 'melody', 'concert'].includes(word));
  const hasCook = ideaWords.some(word => ['cook', 'cooking', 'kitchen', 'bake', 'prepare', 'food', 'meal'].includes(word));
  const hasStudy = ideaWords.some(word => ['study', 'studying', 'read', 'reading', 'learn', 'book', 'homework', 'exam'].includes(word));
  const hasSleep = ideaWords.some(word => ['sleep', 'sleeping', 'tired', 'rest', 'bed', 'nap', 'drowsy', 'exhausted', 'go'].includes(word)) || 
                   idea.toLowerCase().includes('go sleep') || 
                   idea.toLowerCase().includes('go to sleep');
  const hasWork = ideaWords.some(word => ['work', 'working', 'job', 'office', 'desk', 'computer', 'meeting'].includes(word));
  const hasPlay = ideaWords.some(word => ['play', 'playing', 'game', 'fun', 'toy', 'sport', 'activity'].includes(word));
  const hasEat = ideaWords.some(word => ['eat', 'eating', 'food', 'meal', 'dinner', 'lunch', 'breakfast'].includes(word));
  const hasDrink = ideaWords.some(word => ['drink', 'drinking', 'water', 'coffee', 'tea', 'juice'].includes(word));
  const hasWalk = ideaWords.some(word => ['walk', 'walking', 'stroll', 'hike', 'wander', 'explore'].includes(word));
  const hasSwim = ideaWords.some(word => ['swim', 'swimming', 'pool', 'water', 'ocean', 'beach'].includes(word));
  const hasDrive = ideaWords.some(word => ['drive', 'driving', 'car', 'vehicle', 'road', 'travel'].includes(word));
  
  // Environment detection - more comprehensive
  const hasRain = ideaWords.some(word => ['rain', 'rainy', 'water', 'storm', 'thunder', 'lightning'].includes(word));
  const hasNight = ideaWords.some(word => ['night', 'dark', 'evening', 'moon', 'midnight', 'late'].includes(word));
  const hasDay = ideaWords.some(word => ['day', 'morning', 'afternoon', 'sunny', 'bright', 'dawn'].includes(word));
  const hasCity = ideaWords.some(word => ['city', 'street', 'urban', 'tokyo', 'building', 'downtown'].includes(word));
  const hasSchool = ideaWords.some(word => ['school', 'classroom', 'high school', 'university', 'college', 'campus'].includes(word));
  const hasForest = ideaWords.some(word => ['forest', 'woods', 'nature', 'trees', 'jungle', 'wilderness'].includes(word));
  const hasBeach = ideaWords.some(word => ['beach', 'ocean', 'sea', 'sand', 'shore', 'coastal'].includes(word));
  const hasMountain = ideaWords.some(word => ['mountain', 'hill', 'peak', 'summit', 'climb', 'hiking'].includes(word));
  const hasHome = ideaWords.some(word => ['home', 'house', 'room', 'bedroom', 'living', 'kitchen'].includes(word));
  const hasPark = ideaWords.some(word => ['park', 'garden', 'outdoor', 'green', 'grass', 'flowers'].includes(word));
  
  // Debug logging
  console.log('Idea words:', ideaWords);
  console.log('Has sleep detected:', hasSleep);
  console.log('Has tired detected:', ideaWords.some(word => ['tired'].includes(word)));
  
  // Generate title
  const title = `${characterName} in ${idea}`;
  
  // Generate detailed image prompt focusing on CHARACTER ACTION first
  let imagePrompt = `Anime art style, high quality, detailed illustration of ${characterName}`;
  
  // PRIORITIZE ACTION - What the character is DOING (MORE COMPREHENSIVE)
  if (hasDance) {
    imagePrompt += ` actively dancing with dynamic flowing movement, arms extended gracefully, body in motion, performing dance moves`;
  } else if (hasRun) {
    imagePrompt += ` running at full speed, hair flowing behind, determined expression, legs in running motion`;
  } else if (hasJump) {
    imagePrompt += ` jumping in mid-air, arms raised, energetic expression, body in jumping pose`;
  } else if (hasFight) {
    imagePrompt += ` in combat stance, ready to fight, determined expression, battle-ready pose`;
  } else if (hasSing) {
    imagePrompt += ` singing passionately, mouth open, musical expression, performing on stage`;
  } else if (hasCook) {
    imagePrompt += ` cooking in kitchen, hands busy with ingredients, focused expression, culinary action`;
  } else if (hasStudy) {
    imagePrompt += ` studying intently, reading books, focused expression, academic activity`;
  } else if (hasSleep) {
    imagePrompt += ` feeling tired and sleepy, yawning, rubbing eyes, drowsy expression, about to go to sleep, sleepy pose, exhausted from the day`;
  } else if (hasWork) {
    imagePrompt += ` working at desk, focused on computer, professional expression, busy with tasks`;
  } else if (hasPlay) {
    imagePrompt += ` playing happily, joyful expression, engaged in fun activity, playful pose`;
  } else if (hasEat) {
    imagePrompt += ` eating food, enjoying meal, satisfied expression, holding utensils`;
  } else if (hasDrink) {
    imagePrompt += ` drinking beverage, refreshing expression, holding cup or glass`;
  } else if (hasWalk) {
    imagePrompt += ` walking leisurely, relaxed pace, exploring surroundings, peaceful expression`;
  } else if (hasSwim) {
    imagePrompt += ` swimming in water, graceful strokes, wet hair, aquatic movement`;
  } else if (hasDrive) {
    imagePrompt += ` driving vehicle, focused on road, determined expression, behind wheel`;
  } else if (ideaWords.some(word => ['sit', 'sitting', 'rest'].includes(word))) {
    imagePrompt += ` sitting peacefully, relaxed pose, calm expression, in sitting position`;
  } else {
    // Default action based on idea - try to extract action from the idea itself
    const actionWords = ideaWords.filter(word => 
      ['go', 'do', 'make', 'create', 'build', 'draw', 'write', 'think', 'feel', 'see', 'hear', 'touch'].includes(word)
    );
    if (actionWords.length > 0) {
      imagePrompt += ` actively ${actionWords[0]}ing, engaged in the activity: "${idea}", dynamic pose with expressive body language`;
    } else {
      imagePrompt += ` actively performing the scene: "${idea}", dynamic pose with expressive body language, engaged in activity`;
    }
  }
  
  // THEN add character details
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
  
  // Environment details that support the action (MORE COMPREHENSIVE)
  if (hasRain) {
    imagePrompt += `, in the rain with water droplets visible on character and background, wet hair and clothes, rain enhancing the action`;
  }
  
  // Priority environment detection
  if (hasSleep) {
    imagePrompt += `, in bedroom setting with cozy bed, soft pillows, warm blankets, dim lighting perfect for sleep, comfortable sleeping environment`;
  } else if (hasHome) {
    imagePrompt += `, in home setting with comfortable indoor environment, cozy atmosphere, perfect for the activity`;
  } else if (hasSchool) {
    imagePrompt += `, school setting with classroom or hallway background, bright natural lighting, perfect for the activity`;
  } else if (hasBeach) {
    imagePrompt += `, beach setting with ocean waves, sand, seashells, coastal atmosphere, perfect for the activity`;
  } else if (hasMountain) {
    imagePrompt += `, mountain setting with peaks, hiking trails, natural landscape, outdoor adventure atmosphere`;
  } else if (hasPark) {
    imagePrompt += `, park setting with green grass, trees, flowers, outdoor recreational atmosphere`;
  } else if (hasForest) {
    imagePrompt += `, forest setting with trees and natural elements, dappled sunlight filtering through leaves, natural environment for the action`;
  } else if (hasCity) {
    imagePrompt += `, urban city setting with buildings and street elements, vibrant city atmosphere, urban backdrop for the activity`;
  } else if (hasNight) {
    imagePrompt += `, nighttime scene with dramatic lighting, city lights or moonlight illuminating the character's action`;
  } else if (hasDay) {
    imagePrompt += `, daytime scene with bright natural lighting, sunny atmosphere, perfect for the activity`;
  } else {
    imagePrompt += `, with soft natural lighting that highlights the character's action`;
  }
  
  // Art style details that emphasize action
  imagePrompt += `, cinematic composition, detailed anime art style, clean line art, vibrant colors, detailed shading, dynamic camera angle that captures the action, professional anime illustration showing movement and activity`;
  
  // Generate video prompt focusing on ACTION (MORE COMPREHENSIVE)
  let videoPrompt = `Slow zoom in on ${characterName} as they begin their action: "${idea}"`;
  
  if (hasDance) {
    videoPrompt += `. Camera follows their graceful dance movements with smooth tracking shots, capturing the rhythm and flow of their dance performance, dynamic camera work that emphasizes their dancing`;
  } else if (hasRun) {
    videoPrompt += `. Camera follows their running with dynamic tracking shots, capturing the speed and determination of their running, fast-paced camera movement`;
  } else if (hasJump) {
    videoPrompt += `. Camera captures their jumping movement with upward tracking, emphasizing the height and energy of their jump, dramatic camera angles`;
  } else if (hasFight) {
    videoPrompt += `. Camera captures their fighting moves with dynamic angles, emphasizing their combat skills and battle intensity`;
  } else if (hasSing) {
    videoPrompt += `. Camera follows their singing performance with smooth movements, capturing their musical expression and stage presence`;
  } else if (hasCook) {
    videoPrompt += `. Camera captures their cooking action with close-up shots, emphasizing their culinary skills and kitchen activity`;
  } else if (hasStudy) {
    videoPrompt += `. Camera captures their studying with intimate shots, emphasizing their focus and academic activity`;
  } else if (hasSleep) {
    videoPrompt += `. Camera captures their tiredness and sleepiness with gentle close-up shots, emphasizing their drowsy expression and yawning, slow peaceful camera movement`;
  } else if (hasWork) {
    videoPrompt += `. Camera captures their work activity with professional shots, emphasizing their focus and productivity`;
  } else if (hasPlay) {
    videoPrompt += `. Camera follows their playful movements with energetic shots, capturing their joy and fun activity`;
  } else if (hasEat) {
    videoPrompt += `. Camera captures their eating with close-up shots, emphasizing their enjoyment of the meal`;
  } else if (hasDrink) {
    videoPrompt += `. Camera captures their drinking with intimate shots, emphasizing their refreshment`;
  } else if (hasWalk) {
    videoPrompt += `. Camera follows their walking with steady tracking shots, capturing their peaceful exploration`;
  } else if (hasSwim) {
    videoPrompt += `. Camera captures their swimming with underwater and surface shots, emphasizing their aquatic movement`;
  } else if (hasDrive) {
    videoPrompt += `. Camera captures their driving with dynamic shots, emphasizing their focus on the road`;
  } else {
    videoPrompt += `. Camera follows their action with smooth tracking shots, capturing their activity and movement`;
  }
  
  if (hasRain) {
    videoPrompt += `. Rain drops create a cinematic atmosphere, adding depth and mood to their action`;
  }
  
  if (hasNight) {
    videoPrompt += `. Night lighting creates dramatic shadows and highlights, enhancing the emotional impact of their action`;
  }
  
  videoPrompt += `. The scene captures the emotion and energy of their action with film-style camera work, smooth transitions, and professional cinematography that emphasizes what they are doing`;
  
  return {
    title,
    image_prompt: imagePrompt,
    video_prompt: videoPrompt
  };
};

export const generateImageWithReference = async (prompt: string, base64Image: string, mimeType: string): Promise<string> => {
  try {
    // Groq doesn't support image generation, so we'll use fallback
    console.log("Groq doesn't support image generation, using fallback...");
    return generateFallbackSceneImage(prompt);
  } catch (error) {
    console.error("Error generating image with reference:", error);
    
    // Fallback: Generate a simple scene image
    console.log("Using fallback image generation...");
    return generateFallbackSceneImage(prompt);
  }
};

// Fallback function untuk generate scene image tanpa AI - FOCUS ON ACTION (MORE COMPREHENSIVE)
const generateFallbackSceneImage = (prompt: string): string => {
  // Extract key elements from prompt - MORE COMPREHENSIVE
  const promptWords = prompt.toLowerCase().split(/[\s,.-]+/).filter(word => word.length > 0);
  
  // Action detection - more comprehensive
  const hasDance = promptWords.some(word => ['dance', 'dancing', 'move', 'movement', 'groove', 'rhythm', 'beat'].includes(word));
  const hasRun = promptWords.some(word => ['run', 'running', 'sprint', 'jog', 'race', 'chase', 'flee'].includes(word));
  const hasJump = promptWords.some(word => ['jump', 'jumping', 'leap', 'hop', 'bounce', 'spring'].includes(word));
  const hasFight = promptWords.some(word => ['fight', 'fighting', 'battle', 'combat', 'war', 'attack', 'defend'].includes(word));
  const hasSing = promptWords.some(word => ['sing', 'singing', 'music', 'song', 'vocal', 'melody', 'concert'].includes(word));
  const hasCook = promptWords.some(word => ['cook', 'cooking', 'kitchen', 'bake', 'prepare', 'food', 'meal'].includes(word));
  const hasStudy = promptWords.some(word => ['study', 'studying', 'read', 'reading', 'learn', 'book', 'homework', 'exam'].includes(word));
  const hasSleep = promptWords.some(word => ['sleep', 'sleeping', 'tired', 'rest', 'bed', 'nap', 'drowsy', 'exhausted', 'go', 'sleep'].includes(word));
  const hasWork = promptWords.some(word => ['work', 'working', 'job', 'office', 'desk', 'computer', 'meeting'].includes(word));
  const hasPlay = promptWords.some(word => ['play', 'playing', 'game', 'fun', 'toy', 'sport', 'activity'].includes(word));
  const hasEat = promptWords.some(word => ['eat', 'eating', 'food', 'meal', 'dinner', 'lunch', 'breakfast'].includes(word));
  const hasDrink = promptWords.some(word => ['drink', 'drinking', 'water', 'coffee', 'tea', 'juice'].includes(word));
  const hasWalk = promptWords.some(word => ['walk', 'walking', 'stroll', 'hike', 'wander', 'explore'].includes(word));
  const hasSwim = promptWords.some(word => ['swim', 'swimming', 'pool', 'water', 'ocean', 'beach'].includes(word));
  const hasDrive = promptWords.some(word => ['drive', 'driving', 'car', 'vehicle', 'road', 'travel'].includes(word));
  
  // Environment detection - more comprehensive
  const hasRain = promptWords.some(word => ['rain', 'rainy', 'water', 'storm', 'thunder', 'lightning'].includes(word));
  const hasNight = promptWords.some(word => ['night', 'dark', 'evening', 'moon', 'midnight', 'late'].includes(word));
  const hasDay = promptWords.some(word => ['day', 'morning', 'afternoon', 'sunny', 'bright', 'dawn'].includes(word));
  const hasCity = promptWords.some(word => ['city', 'street', 'urban', 'tokyo', 'building', 'downtown'].includes(word));
  const hasSchool = promptWords.some(word => ['school', 'classroom', 'high school', 'university', 'college', 'campus'].includes(word));
  const hasForest = promptWords.some(word => ['forest', 'woods', 'nature', 'trees', 'jungle', 'wilderness'].includes(word));
  const hasBeach = promptWords.some(word => ['beach', 'ocean', 'sea', 'sand', 'shore', 'coastal'].includes(word));
  const hasMountain = promptWords.some(word => ['mountain', 'hill', 'peak', 'summit', 'climb', 'hiking'].includes(word));
  const hasHome = promptWords.some(word => ['home', 'house', 'room', 'bedroom', 'living', 'kitchen'].includes(word));
  const hasPark = promptWords.some(word => ['park', 'garden', 'outdoor', 'green', 'grass', 'flowers'].includes(word));
  
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
  
  // Generate SVG scene with ACTION FOCUS
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="400" height="300" fill="${bgColor}"/>
      
      <!-- Ground/Floor -->
      <rect x="0" y="250" width="400" height="50" fill="${hasCity ? '#696969' : '#90EE90'}"/>
      
      <!-- Character (simplified anime style) - POSITIONED FOR ACTION -->
      <circle cx="200" cy="180" r="25" fill="${charColor}"/>
      <rect x="185" y="205" width="30" height="40" fill="${charColor}"/>
      
      ${hasDance ? `
      <!-- Character in DANCING pose -->
      <rect x="170" y="210" width="15" height="30" fill="${charColor}" transform="rotate(-20 177.5 225)"/>
      <rect x="215" y="210" width="15" height="30" fill="${charColor}" transform="rotate(20 222.5 225)"/>
      <!-- Dance movement lines -->
      <path d="M150 200 Q200 150 250 200" stroke="${accentColor}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M180 220 Q200 180 220 220" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.5"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        DANCING
      </text>
      ` : hasRun ? `
      <!-- Character in RUNNING pose -->
      <rect x="170" y="210" width="15" height="30" fill="${charColor}" transform="rotate(-30 177.5 225)"/>
      <rect x="215" y="210" width="15" height="30" fill="${charColor}" transform="rotate(30 222.5 225)"/>
      <!-- Running motion lines -->
      <path d="M120 200 Q200 180 280 200" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        RUNNING
      </text>
      ` : hasJump ? `
      <!-- Character in JUMPING pose -->
      <rect x="185" y="200" width="15" height="30" fill="${charColor}" transform="rotate(-45 192.5 215)"/>
      <rect x="200" y="200" width="15" height="30" fill="${charColor}" transform="rotate(45 207.5 215)"/>
      <!-- Jump motion lines -->
      <path d="M200 250 Q200 150 200 100" stroke="${accentColor}" stroke-width="3" fill="none" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        JUMPING
      </text>
      ` : hasFight ? `
      <!-- Character in FIGHTING pose -->
      <rect x="170" y="210" width="15" height="30" fill="${charColor}" transform="rotate(-45 177.5 225)"/>
      <rect x="215" y="210" width="15" height="30" fill="${charColor}" transform="rotate(45 222.5 225)"/>
      <!-- Fighting motion lines -->
      <path d="M150 180 Q200 160 250 180" stroke="${accentColor}" stroke-width="3" fill="none" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        FIGHTING
      </text>
      ` : hasSing ? `
      <!-- Character in SINGING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Singing motion lines -->
      <path d="M200 200 Q220 180 240 200" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        SINGING
      </text>
      ` : hasCook ? `
      <!-- Character in COOKING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Cooking elements -->
      <circle cx="180" cy="190" r="8" fill="${accentColor}" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        COOKING
      </text>
      ` : hasStudy ? `
      <!-- Character in STUDYING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Study elements -->
      <rect x="170" y="170" width="60" height="40" fill="${accentColor}" opacity="0.3"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        STUDYING
      </text>
      ` : hasSleep ? `
      <!-- Character in SLEEPY pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Sleep elements -->
      <rect x="150" y="200" width="100" height="20" fill="${accentColor}" opacity="0.3" rx="10"/>
      <circle cx="180" cy="190" r="3" fill="${accentColor}" opacity="0.7"/>
      <circle cx="220" cy="190" r="3" fill="${accentColor}" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        SLEEPY
      </text>
      ` : hasWork ? `
      <!-- Character in WORKING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Work elements -->
      <rect x="170" y="170" width="60" height="40" fill="${accentColor}" opacity="0.3"/>
      <rect x="180" y="180" width="40" height="20" fill="${accentColor}" opacity="0.5"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        WORKING
      </text>
      ` : hasPlay ? `
      <!-- Character in PLAYING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Play elements -->
      <circle cx="180" cy="190" r="8" fill="${accentColor}" opacity="0.7"/>
      <circle cx="220" cy="190" r="8" fill="${accentColor}" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        PLAYING
      </text>
      ` : hasEat ? `
      <!-- Character in EATING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Eating elements -->
      <rect x="190" y="180" width="20" height="15" fill="${accentColor}" opacity="0.7"/>
      <circle cx="200" cy="175" r="3" fill="${accentColor}" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        EATING
      </text>
      ` : hasWalk ? `
      <!-- Character in WALKING pose -->
      <rect x="185" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="200" y="210" width="15" height="30" fill="${charColor}"/>
      <!-- Walking motion lines -->
      <path d="M150 200 Q200 180 250 200" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.7"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        WALKING
      </text>
      ` : `
      <!-- Character in DEFAULT pose -->
      <rect x="175" y="210" width="15" height="30" fill="${charColor}"/>
      <rect x="210" y="210" width="15" height="30" fill="${charColor}"/>
      <text x="200" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
        ACTION
      </text>
      `}
      
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
        Character in Action
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
