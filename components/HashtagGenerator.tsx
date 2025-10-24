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

  // Generate meaningful hashtags based on content
  const generateHashtags = (): string[] => {
    const hashtags: string[] = [];
    const title = result.title.toLowerCase();
    const imagePrompt = result.image_prompt.toLowerCase();
    const videoPrompt = result.video_prompt.toLowerCase();
    
    // Core meaningful hashtags
    hashtags.push('#anime', '#story', '#meaningful', '#character', '#emotion');
    
    // Character-based hashtags
    if (character) {
      hashtags.push(`#${character.name.toLowerCase().replace(/\s+/g, '')}`);
    }
    
    // Emotion-based meaningful hashtags
    if (title.includes('sleep') || title.includes('tired') || imagePrompt.includes('sleep') || imagePrompt.includes('tired')) {
      hashtags.push('#rest', '#peaceful', '#calm', '#reflection');
    }
    if (title.includes('happy') || imagePrompt.includes('happy') || imagePrompt.includes('smile')) {
      hashtags.push('#joy', '#happiness', '#positive', '#uplifting');
    }
    if (title.includes('sad') || imagePrompt.includes('sad') || imagePrompt.includes('cry')) {
      hashtags.push('#emotion', '#feeling', '#heart', '#sensitive');
    }
    if (title.includes('love') || imagePrompt.includes('love') || imagePrompt.includes('romance')) {
      hashtags.push('#love', '#heart', '#connection', '#relationship');
    }
    if (title.includes('friendship') || imagePrompt.includes('friendship') || imagePrompt.includes('friend')) {
      hashtags.push('#friendship', '#bond', '#together', '#support');
    }
    
    // Minimal trending hashtags
    hashtags.push('#animeart', '#animecommunity');
    
    // Remove duplicates and limit to 10 hashtags for cleaner look
    return [...new Set(hashtags)].slice(0, 10);
  };

  // Generate meaningful description
  const generateDescription = (): string => {
    let description = `✨ ${result.title}\n\n`;
    
    if (character) {
      description += `👤 Character: ${character.name}\n`;
      description += `💫 ${character.description}\n\n`;
    }
    
    // Show the meaningful description instead of truncated prompts
    description += `💭 ${result.video_prompt}\n\n`;
    
    // Add minimal, meaningful hashtags
    description += `#anime #story #meaningful #character #emotion`;
    
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
