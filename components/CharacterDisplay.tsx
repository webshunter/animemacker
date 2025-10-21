
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
    <div className="flex items-center gap-4 animate-fade-in-fast">
      <img 
        src={character.image} 
        alt={character.name} 
        className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
      />
      <div className="flex-1">
        <h4 className="text-xl font-bold text-white">{character.name}</h4>
        <p className="text-gray-400 text-sm mt-1">{character.description}</p>
      </div>
      <div className="flex flex-col gap-2">
         <button onClick={onEdit} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-colors" aria-label="Edit character">
            <EditIcon />
         </button>
         <button onClick={onDelete} className="p-2 bg-gray-700 hover:bg-red-500 rounded-full text-gray-300 hover:text-white transition-colors" aria-label="Delete character">
            <TrashIcon />
         </button>
      </div>
    </div>
  );
};

export default CharacterDisplay;
