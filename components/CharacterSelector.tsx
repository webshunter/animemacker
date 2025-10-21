import React from 'react';
import { Character } from '../types';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelectCharacter: (character: Character | null) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  characters, 
  selectedCharacter, 
  onSelectCharacter 
}) => {
  return (
    <div className="mb-4 px-2">
      <h3 className="text-base font-semibold mb-3 text-gray-200">Select Character for Scene</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* No Character Option */}
        <div 
          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
            selectedCharacter === null 
              ? 'border-purple-500 bg-purple-500/20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onClick={() => onSelectCharacter(null)}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xl">🎭</span>
          </div>
          <h4 className="text-center font-medium text-white text-sm">No Character</h4>
          <p className="text-center text-xs text-gray-400">Generate without character reference</p>
        </div>

        {/* Character Options */}
        {characters.map((char) => (
          <div 
            key={char.id || char.name}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
              selectedCharacter?.name === char.name 
                ? 'border-purple-500 bg-purple-500/20' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => onSelectCharacter(char)}
          >
            <img 
              src={char.image} 
              alt={char.name}
              className="w-12 h-12 mx-auto mb-2 rounded-full object-cover border-2 border-gray-600"
            />
            <h4 className="text-center font-medium text-white truncate text-sm">{char.name}</h4>
            <p className="text-center text-xs text-gray-400 line-clamp-2">{char.description}</p>
          </div>
        ))}
      </div>
      
      {selectedCharacter && (
        <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            <strong>Selected:</strong> {selectedCharacter.name} - {selectedCharacter.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterSelector;
