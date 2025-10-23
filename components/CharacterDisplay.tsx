
import React, { useState } from 'react';
import { Character } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CharacterDisplayProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character, onEdit, onDelete }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyImage = async () => {
    try {
      // Convert base64 to blob
      const response = await fetch(character.image);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy image:', error);
      // Fallback: copy image URL
      try {
        await navigator.clipboard.writeText(character.image);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Failed to copy image URL:', fallbackError);
        alert('Failed to copy image. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center gap-3 animate-fade-in-fast px-2">
      <div className="relative group">
        <img 
          src={character.image} 
          alt={character.name} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500 flex-shrink-0 cursor-pointer"
          onClick={handleCopyImage}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-medium">
            {copySuccess ? 'Copied!' : 'Click to copy'}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-lg sm:text-xl font-bold text-white truncate">{character.name}</h4>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">{character.description}</p>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
         <button onClick={onEdit} className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors" aria-label="Edit character">
            <EditIcon />
         </button>
         <button onClick={onDelete} className="p-1.5 bg-gray-700 hover:bg-red-500 rounded-full text-gray-300 hover:text-white transition-colors" aria-label="Delete character">
            <TrashIcon />
         </button>
      </div>
    </div>
  );
};

export default CharacterDisplay;
