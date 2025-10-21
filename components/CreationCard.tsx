import React, { useState } from 'react';
import { Creation } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CreationCardProps {
  creation: Creation;
  onDelete: (id: string) => void;
}

const CreationCard: React.FC<CreationCardProps> = ({ creation, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [hashtagCopied, setHashtagCopied] = useState(false);
  const [descCopied, setDescCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(creation.video_prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImageCopy = () => {
    navigator.clipboard.writeText(creation.image_prompt).then(() => {
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    });
  };

  // Generate hashtags for social media
  const generateHashtags = (): string[] => {
    const hashtags: string[] = [];
    const title = creation.title.toLowerCase();
    const imagePrompt = creation.image_prompt.toLowerCase();
    
    // Base anime hashtags
    hashtags.push('#anime', '#animeart', '#animeedit', '#animevideo');
    
    // Scene-based hashtags
    if (title.includes('dance') || imagePrompt.includes('dance')) {
      hashtags.push('#dance', '#dancing', '#choreography', '#movement');
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
    
    // Trending hashtags for short videos
    hashtags.push('#shortvideo', '#viral', '#trending', '#fyp', '#foryou');
    hashtags.push('#animeedit', '#animevideo', '#animecontent', '#animecommunity');
    
    // Remove duplicates and limit to 15 hashtags
    return [...new Set(hashtags)].slice(0, 15);
  };

  // Generate video description
  const generateDescription = (): string => {
    let description = `🎨 ${creation.title}\n\n`;
    description += `🎬 Scene: ${creation.image_prompt.substring(0, 80)}...\n\n`;
    description += `📹 Video: ${creation.video_prompt.substring(0, 80)}...\n\n`;
    description += `#anime #animeart #animevideo #animeedit #shortvideo #viral #fyp #foryou`;
    return description;
  };

  const hashtags = generateHashtags();
  const description = generateDescription();

  const handleHashtagCopy = () => {
    navigator.clipboard.writeText(hashtags.join(' ')).then(() => {
      setHashtagCopied(true);
      setTimeout(() => setHashtagCopied(false), 2000);
    });
  };

  const handleDescriptionCopy = () => {
    navigator.clipboard.writeText(description).then(() => {
      setDescCopied(true);
      setTimeout(() => setDescCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden flex flex-col animate-fade-in shadow-lg">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-20 sm:h-24 flex items-center justify-center">
        <h3 className="text-white text-sm sm:text-base font-bold text-center px-2">{creation.title}</h3>
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <div className="mt-2 flex-grow">
          <label className="text-xs font-semibold text-gray-400 uppercase">Image Prompt</label>
          <div className="mt-1 mb-3">
            <div className="flex items-start gap-2">
              <textarea
                readOnly
                value={creation.image_prompt}
                className="text-gray-300 text-xs w-full h-16 bg-gray-900/50 rounded-md p-2 resize-none border border-gray-600"
              />
              <button 
                onClick={handleImageCopy} 
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-colors flex-shrink-0"
                aria-label="Copy image prompt"
              >
                {imageCopied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
          
          <label className="text-xs font-semibold text-gray-400 uppercase">Video Prompt</label>
          <div className="flex items-start gap-2 mt-1 h-full">
            <textarea
              readOnly
              value={creation.video_prompt}
              className="text-gray-300 text-xs w-full h-16 bg-gray-900/50 rounded-md p-2 resize-none border border-gray-600"
            />
            <button 
                onClick={handleCopy} 
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-colors flex-shrink-0"
                aria-label="Copy video prompt"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Social Media Content */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/30">
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">📱 Social Media</h4>
        
        {/* Hashtags */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-500">Hashtags</label>
            <button
              onClick={handleHashtagCopy}
              className="flex items-center gap-1 px-1.5 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              {hashtagCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            {hashtags.slice(0, 8).map((hashtag, index) => (
              <span key={index} className="bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
                {hashtag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-500">Description</label>
            <button
              onClick={handleDescriptionCopy}
              className="flex items-center gap-1 px-1.5 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              {descCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <textarea
            readOnly
            value={description}
            className="w-full h-16 bg-gray-800/50 rounded text-xs text-gray-300 p-2 resize-none border border-gray-600"
          />
        </div>
      </div>
      
      <div className="p-2 border-t border-gray-700 bg-gray-900/50 flex justify-end">
        <button 
            onClick={() => onDelete(creation.id)} 
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 font-semibold transition-colors"
            aria-label="Delete creation"
        >
          <TrashIcon />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CreationCard;
