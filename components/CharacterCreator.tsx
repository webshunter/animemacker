
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface CharacterCreatorProps {
  onSave: (character: Character) => void;
  onClose: () => void;
  existingCharacter: Character | null;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onSave, onClose, existingCharacter }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingCharacter) {
      setName(existingCharacter.name);
      setDescription(existingCharacter.description);
      setImage(existingCharacter.image);
    }
  }, [existingCharacter]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size cannot exceed 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
      }
      reader.readAsDataURL(file);
    }
  };


  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      setError("Name and description are required.");
      return;
    }
    // Generate a simple placeholder image based on character description
    const placeholderImage = generateCharacterPlaceholder(name, description);
    onSave({ name, description, image: placeholderImage });
  };

  // Generate a simple placeholder image for the character
  const generateCharacterPlaceholder = (name: string, description: string): string => {
    // Extract colors from description
    const colorMatches = description.match(/(red|blue|green|yellow|pink|purple|silver|black|white|brown) (hair|eyes)/i);
    let hairColor = '#C0C0C0'; // Default grey
    let eyeColor = '#ADD8E6'; // Default light blue

    if (colorMatches) {
      const color = colorMatches[1].toLowerCase();
      const type = colorMatches[2].toLowerCase();
      if (type === 'hair') {
        switch (color) {
          case 'red': hairColor = '#FF0000'; break;
          case 'blue': hairColor = '#0000FF'; break;
          case 'green': hairColor = '#008000'; break;
          case 'yellow': hairColor = '#FFFF00'; break;
          case 'pink': hairColor = '#FFC0CB'; break;
          case 'purple': hairColor = '#800080'; break;
          case 'silver': hairColor = '#C0C0C0'; break;
          case 'black': hairColor = '#000000'; break;
          case 'white': hairColor = '#FFFFFF'; break;
          case 'brown': hairColor = '#A52A2A'; break;
        }
      } else if (type === 'eyes') {
        switch (color) {
          case 'red': eyeColor = '#FF0000'; break;
          case 'blue': eyeColor = '#0000FF'; break;
          case 'green': eyeColor = '#008000'; break;
          case 'yellow': eyeColor = '#FFFF00'; break;
          case 'pink': eyeColor = '#FFC0CB'; break;
          case 'purple': eyeColor = '#800080'; break;
          case 'silver': eyeColor = '#C0C0C0'; break;
          case 'black': eyeColor = '#000000'; break;
          case 'white': eyeColor = '#FFFFFF'; break;
          case 'brown': eyeColor = '#A52A2A'; break;
        }
      }
    }

    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#333" />
        <circle cx="100" cy="80" r="40" fill="${hairColor}" />
        <circle cx="85" cy="75" r="8" fill="${eyeColor}" />
        <circle cx="115" cy="75" r="8" fill="${eyeColor}" />
        <path d="M80 100 Q100 110 120 100" stroke="white" stroke-width="2" fill="none"/>
        <text x="100" y="160" text-anchor="middle" font-family="Arial" font-size="18" fill="white">${name}</text>
        <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="#ccc">${description.substring(0, 30)}...</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  return (
    <div className="px-2">
      <h2 className="text-xl font-bold mb-3 text-center">{existingCharacter ? 'Edit Character' : 'Create Character'}</h2>
      {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
      <div className="space-y-3">
        <div>
          <label htmlFor="char-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            id="char-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="e.g., Akari"
          />
        </div>
        <div>
          <label htmlFor="char-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            id="char-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 h-20 bg-gray-700 border border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="e.g., Energetic, loves street dance..."
          />
        </div>
               <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Character Preview</label>
                   <div className="mt-1 flex justify-center px-3 py-4 border border-gray-600 border-dashed rounded-md">
                       <div className="space-y-2 text-center">
                           {image ? (
                               <img src={image} alt="Character preview" className="mx-auto h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full" />
                           ) : (
                               <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                           )}
                           <div className="flex flex-col gap-2 text-xs text-gray-400 justify-center">
                               <div className="flex gap-2">
                                   <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-purple-500 px-2 py-1 text-xs">
                                       <span>Upload</span>
                                       <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                                   </label>
                               </div>
                           </div>
                            <p className="text-xs text-gray-500">Auto-generate from description</p>
                       </div>
                   </div>
               </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md">Cancel</button>
        <button onClick={handleSave} className="px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">Save</button>
      </div>
    </div>
  );
};

export default CharacterCreator;
