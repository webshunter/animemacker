import React from 'react';
import { Creation, Character } from '../types';
import SceneCard from './SceneCard';

interface CreationsListProps {
  creations: Creation[];
  characters: Character[];
  onDelete: (id: string) => void;
  onView: (creation: Creation) => void;
}

const CreationsList: React.FC<CreationsListProps> = ({ creations, characters, onDelete, onView }) => {
  if (creations.length === 0) {
    return null;
  }

  // Show newest creations first
  const reversedCreations = [...creations].reverse();

  return (
    <section className="mt-6 w-full px-2">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-200">Saved Scenes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reversedCreations.map(creation => {
          // Find character for this creation (if any)
          const character = characters.find(char => 
            creation.title.toLowerCase().includes(char.name.toLowerCase())
          );
          
          return (
            <SceneCard 
              key={creation.id} 
              creation={creation} 
              character={character || null}
              onDelete={onDelete}
              onView={onView}
            />
          );
        })}
      </div>
    </section>
  );
};

export default CreationsList;
