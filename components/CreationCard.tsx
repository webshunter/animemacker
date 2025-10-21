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

  const handleCopy = () => {
    navigator.clipboard.writeText(creation.video_prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden flex flex-col animate-fade-in shadow-lg">
      <img src={creation.generatedImage} alt={creation.title} className="w-full h-56 object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h4 className="text-lg font-bold text-white truncate flex-shrink-0">{creation.title}</h4>
        <div className="mt-4 flex-grow">
          <label className="text-xs font-semibold text-gray-400 uppercase">Video Prompt</label>
          <div className="flex items-start gap-2 mt-1 h-full">
            <textarea
              readOnly
              value={creation.video_prompt}
              className="text-gray-300 text-sm w-full h-24 bg-transparent resize-none border-none p-0 focus:ring-0"
            />
            <button 
                onClick={handleCopy} 
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-colors flex-shrink-0"
                aria-label="Copy video prompt"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-gray-700 bg-gray-900/50 flex justify-end">
        <button 
            onClick={() => onDelete(creation.id)} 
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-semibold transition-colors"
            aria-label="Delete creation"
        >
          <TrashIcon />
          Delete
        </button>
      </div>
    </div>
  );
};

export default CreationCard;
