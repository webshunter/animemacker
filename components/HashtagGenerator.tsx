import React, { useState } from 'react';
import { SceneOutput, Character } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface HashtagGeneratorProps {
  result: SceneOutput;
  character: Character | null;
}

const HashtagGenerator: React.FC<HashtagGeneratorProps> = ({ result, character }) => {
  const [copied, setCopied] = useState(false);
  const [descCopied, setDescCopied] = useState(false);

  // Generate hashtags based on scene content
  const generateHashtags = (): string[] => {
    const hashtags: string[] = [];
    const title = result.title.toLowerCase();
    const imagePrompt = result.image_prompt.toLowerCase();
    const videoPrompt = result.video_prompt.toLowerCase();
    
    // Base anime hashtags
    hashtags.push('#anime', '#animeart', '#animeedit', '#animevideo');
    
    // Character-based hashtags
    if (character) {
      hashtags.push(`#${character.name.toLowerCase().replace(/\s+/g, '')}`);
      const desc = character.description.toLowerCase();
      if (desc.includes('energetic') || desc.includes('cheerful')) {
        hashtags.push('#energetic', '#cheerful');
      }
      if (desc.includes('mysterious') || desc.includes('cool')) {
        hashtags.push('#mysterious', '#cool');
      }
      if (desc.includes('dance') || desc.includes('dancing')) {
        hashtags.push('#dance', '#dancing');
      }
    }
    
    // Scene-based hashtags
    if (title.includes('dance') || imagePrompt.includes('dance')) {
      hashtags.push('#dance', '#dancing', '#choreography', '#movement');
    }
    if (title.includes('sleep') || title.includes('tired') || imagePrompt.includes('sleep') || imagePrompt.includes('tired') || imagePrompt.includes('bedroom') || imagePrompt.includes('bed')) {
      hashtags.push('#sleep', '#tired', '#bedroom', '#rest', '#sleepy', '#peaceful', '#cozy');
    }
    if (title.includes('rain') || imagePrompt.includes('rain')) {
      hashtags.push('#rain', '#rainy', '#weather', '#atmospheric');
    }
    if (title.includes('night') || imagePrompt.includes('night')) {
      hashtags.push('#night', '#nighttime', '#dark', '#moody');
    }
    if (title.includes('city') || imagePrompt.includes('city')) {
      hashtags.push('#city', '#urban', '#street', '#tokyo');
    }
    if (title.includes('school') || imagePrompt.includes('school')) {
      hashtags.push('#school', '#highschool', '#student', '#academic');
    }
    if (title.includes('forest') || imagePrompt.includes('forest')) {
      hashtags.push('#forest', '#nature', '#outdoor', '#green');
    }
    
    // Art style hashtags
    if (imagePrompt.includes('anime art style')) {
      hashtags.push('#animeart', '#manga', '#japaneseart');
    }
    if (imagePrompt.includes('dynamic')) {
      hashtags.push('#dynamic', '#action', '#motion');
    }
    if (imagePrompt.includes('cinematic')) {
      hashtags.push('#cinematic', '#cinematography', '#film');
    }
    
    // Video-specific hashtags
    if (videoPrompt.includes('camera')) {
      hashtags.push('#camerawork', '#cinematography', '#filming');
    }
    if (videoPrompt.includes('smooth')) {
      hashtags.push('#smooth', '#flow', '#seamless');
    }
    if (videoPrompt.includes('tracking')) {
      hashtags.push('#tracking', '#follow', '#movement');
    }
    
    // Trending hashtags for short videos
    hashtags.push('#shortvideo', '#viral', '#trending', '#fyp', '#foryou');
    hashtags.push('#animeedit', '#animevideo', '#animecontent', '#animecommunity');
    
    // Remove duplicates and limit to 20 hashtags
    return [...new Set(hashtags)].slice(0, 20);
  };

  // Generate video description
  const generateDescription = (): string => {
    let description = `🎨 ${result.title}\n\n`;
    
    if (character) {
      description += `👤 Featuring: ${character.name}\n`;
      description += `✨ ${character.description}\n\n`;
    }
    
    description += `🎬 Scene: ${result.image_prompt.substring(0, 100)}...\n\n`;
    description += `📹 Video: ${result.video_prompt.substring(0, 100)}...\n\n`;
    
    description += `#anime #animeart #animevideo #animeedit #shortvideo #viral #fyp #foryou`;
    
    return description;
  };

  const hashtags = generateHashtags();
  const description = generateDescription();

  const handleHashtagCopy = () => {
    navigator.clipboard.writeText(hashtags.join(' ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy hashtags:', error);
      alert('Failed to copy hashtags. Please try again.');
    });
  };

  const handleDescriptionCopy = () => {
    navigator.clipboard.writeText(description).then(() => {
      setDescCopied(true);
      setTimeout(() => setDescCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy description:', error);
      alert('Failed to copy description. Please try again.');
    });
  };

  return (
    <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-3">
      <h4 className="text-base font-semibold text-gray-300 mb-3">📱 Social Media Content</h4>
      
      {/* Hashtags Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Hashtags</label>
          <button
            onClick={handleHashtagCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="bg-gray-900/50 rounded-md p-2">
          <div className="flex flex-wrap gap-1 text-xs text-gray-300">
            {hashtags.map((hashtag, index) => (
              <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Video Description</label>
          <button
            onClick={handleDescriptionCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            {descCopied ? <CheckIcon /> : <CopyIcon />}
            <span className="hidden sm:inline">{descCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <textarea
          readOnly
          value={description}
          className="w-full h-24 bg-gray-900/50 rounded-md p-2 text-xs text-gray-300 resize-none border border-gray-600"
        />
      </div>
    </div>
  );
};

export default HashtagGenerator;
