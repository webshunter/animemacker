// Service untuk generate gambar karakter menggunakan Nano Banana
export interface NanoBananaResponse {
  success: boolean;
  image_url?: string;
  error?: string;
}

export const generateCharacterImage = async (characterDescription: string): Promise<string> => {
  try {
    // Nano Banana API endpoint
    const NANO_BANANA_API_URL = 'https://api.nanobanana.ai/v1/generate';
    
    // Gunakan Gemini API key untuk Nano Banana
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('API key not found');
    }
    
    const prompt = `Anime character portrait: ${characterDescription}. High quality anime art style, detailed character design, clean background, professional illustration`;
    
    const response = await fetch(NANO_BANANA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'anime',
        width: 512,
        height: 512,
        quality: 'high',
        style: 'anime',
        num_images: 1
      }),
    });

    if (!response.ok) {
      throw new Error(`Nano Banana API error: ${response.status}`);
    }

    const data: NanoBananaResponse = await response.json();
    
    if (!data.success || !data.image_url) {
      throw new Error(data.error || 'Failed to generate image');
    }

    // Convert image URL to base64
    const imageResponse = await fetch(data.image_url);
    const imageBlob = await imageResponse.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    console.error('Error generating character image:', error);
    
    // Fallback: Generate a simple colored placeholder based on character description
    return generateFallbackImage(characterDescription);
  }
};

// Fallback function untuk generate placeholder image
const generateFallbackImage = (description: string): string => {
  // Extract color from description
  let color = '#FF69B4'; // Default pink
  
  if (description.toLowerCase().includes('silver') || description.toLowerCase().includes('gray')) {
    color = '#C0C0C0';
  } else if (description.toLowerCase().includes('blue')) {
    color = '#4169E1';
  } else if (description.toLowerCase().includes('red')) {
    color = '#FF4500';
  } else if (description.toLowerCase().includes('green')) {
    color = '#32CD32';
  } else if (description.toLowerCase().includes('purple')) {
    color = '#9370DB';
  } else if (description.toLowerCase().includes('black')) {
    color = '#2F2F2F';
  }

  // Create a simple SVG placeholder
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}" opacity="0.3"/>
      <circle cx="100" cy="80" r="30" fill="${color}" opacity="0.7"/>
      <rect x="70" y="120" width="60" height="40" fill="${color}" opacity="0.7"/>
      <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="white">
        ${description.split(' ').slice(0, 2).join(' ')}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Alternative: Generate using DALL-E atau service lain
export const generateCharacterImageAlternative = async (characterDescription: string): Promise<string> => {
  try {
    // Menggunakan service AI lain sebagai alternatif
    const prompt = `Anime character portrait: ${characterDescription}. High quality anime art style, detailed character design, clean background, professional illustration`;
    
    // Untuk sekarang, kita akan menggunakan fallback image yang lebih baik
    return generateAdvancedFallbackImage(characterDescription);
    
  } catch (error) {
    console.error('Error generating alternative character image:', error);
    return generateFallbackImage(characterDescription);
  }
};

const generateAdvancedFallbackImage = (description: string): string => {
  // Extract character details
  const isMale = description.toLowerCase().includes('boy') || description.toLowerCase().includes('male');
  const hasLongHair = description.toLowerCase().includes('long');
  const hairColor = extractHairColor(description);
  const eyeColor = extractEyeColor(description);
  
  // Create a more detailed SVG
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${hairColor}40;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${hairColor}20;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="200" height="200" fill="url(#bg)"/>
      
      <!-- Face -->
      <ellipse cx="100" cy="90" rx="35" ry="40" fill="#FDBCB4"/>
      
      <!-- Hair -->
      <ellipse cx="100" cy="70" rx="40" ry="35" fill="#${hairColor}"/>
      ${hasLongHair ? `<ellipse cx="100" cy="120" rx="25" ry="20" fill="#${hairColor}"/>` : ''}
      
      <!-- Eyes -->
      <circle cx="90" cy="85" r="6" fill="#${eyeColor}"/>
      <circle cx="110" cy="85" r="6" fill="#${eyeColor}"/>
      <circle cx="90" cy="85" r="3" fill="white"/>
      <circle cx="110" cy="85" r="3" fill="white"/>
      
      <!-- Mouth -->
      <ellipse cx="100" cy="100" rx="8" ry="4" fill="#FF69B4"/>
      
      <!-- Body -->
      <rect x="75" y="130" width="50" height="60" fill="#4169E1" opacity="0.8"/>
      
      <!-- Text -->
      <text x="100" y="190" text-anchor="middle" font-family="Arial" font-size="10" fill="white">
        ${description.split(' ').slice(0, 3).join(' ')}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const extractHairColor = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('pink')) return 'FF69B4';
  if (desc.includes('silver') || desc.includes('gray')) return 'C0C0C0';
  if (desc.includes('blue')) return '4169E1';
  if (desc.includes('red')) return 'FF4500';
  if (desc.includes('green')) return '32CD32';
  if (desc.includes('purple')) return '9370DB';
  if (desc.includes('black')) return '2F2F2F';
  if (desc.includes('brown')) return '8B4513';
  return 'FF69B4'; // Default pink
};

const extractEyeColor = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('blue')) return '4169E1';
  if (desc.includes('violet') || desc.includes('purple')) return '9370DB';
  if (desc.includes('green')) return '32CD32';
  if (desc.includes('brown')) return '8B4513';
  if (desc.includes('black')) return '2F2F2F';
  return '4169E1'; // Default blue
};
