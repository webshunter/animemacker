import React from 'react';
import { Creation, Character } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SceneCardProps {
  creation: Creation;
  character: Character | null;
  onView: (creation: Creation) => void;
  onDelete: (id: string) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ creation, character, onView, onDelete }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/50 group">
      {/* Card Image */}
      <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
        {creation.generatedImage || creation.image_filename ? (
          <img 
            src={creation.image_filename ? `/api/images/${creation.image_filename}` : creation.generatedImage} 
            alt={creation.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : character ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/50"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <button
            onClick={() => onView(creation)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-600/90 hover:bg-purple-600 text-white p-3 rounded-full"
            aria-label="View details"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-2">
          {creation.title}
        </h3>
        
        {character && (
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-6 h-6 rounded-full object-cover border border-purple-500/50"
            />
            <span className="text-sm text-gray-400 truncate">
              {character.name}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          
          <div className="flex gap-1">
            <button
              onClick={() => onView(creation)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition-colors"
              aria-label="View details"
            >
              <EyeIcon />
            </button>
            <button
              onClick={() => onDelete(creation.id)}
              className="p-2 bg-gray-700 hover:bg-red-500 rounded-md text-gray-300 hover:text-white transition-colors"
              aria-label="Delete scene"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
