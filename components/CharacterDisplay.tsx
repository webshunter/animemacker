
import React from 'react';
import { Character } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CharacterDisplayProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-3 animate-fade-in-fast px-2">
      <img 
        src={character.image} 
        alt={character.name} 
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500 flex-shrink-0"
      />
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
