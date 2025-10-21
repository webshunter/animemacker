import React from 'react';
import { Creation } from '../types';
import CreationCard from './CreationCard';

interface CreationsListProps {
  creations: Creation[];
  onDelete: (id: string) => void;
}

const CreationsList: React.FC<CreationsListProps> = ({ creations, onDelete }) => {
  if (creations.length === 0) {
    return null;
  }

  // Show newest creations first
  const reversedCreations = [...creations].reverse();

  return (
    <section className="mt-6 w-full px-2">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-200">Saved Creations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reversedCreations.map(creation => (
          <CreationCard key={creation.id} creation={creation} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
};

export default CreationsList;
