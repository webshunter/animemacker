
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
    if (!name.trim() || !description.trim() || !image) {
      setError("All fields, including an image, are required.");
      return;
    }
    onSave({ name, description, image });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">{existingCharacter ? 'Edit Character' : 'Create Character'}</h2>
      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="char-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            id="char-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Akari"
          />
        </div>
        <div>
          <label htmlFor="char-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            id="char-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 h-24 bg-gray-700 border border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Energetic, loves street dance..."
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-1">Reference Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {image ? (
                        <img src={image} alt="Character preview" className="mx-auto h-32 w-32 object-cover rounded-full" />
                    ) : (
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-400 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-purple-500 px-1">
                            <span>Upload an image</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                        </label>
                    </div>
                     <p className="text-xs text-gray-500">{image ? 'Click to change' : 'PNG, JPG, WEBP up to 4MB'}</p>
                </div>
            </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">Save Character</button>
      </div>
    </div>
  );
};

export default CharacterCreator;
