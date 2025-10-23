import React, { useState } from 'react';
import { Creation, Character } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ImageIcon } from './icons/ImageIcon';
import HashtagGenerator from './HashtagGenerator';
import { updateSceneImage } from '../services/apiService';

interface SceneDetailProps {
  creation: Creation;
  character: Character | null;
  onBack: () => void;
  onUpdateImage: (id: string, imageUrl: string, imageFilename?: string) => void;
  onDelete: (id: string) => void;
}

const SceneDetail: React.FC<SceneDetailProps> = ({ 
  creation, 
  character, 
  onBack, 
  onUpdateImage, 
  onDelete 
}) => {
  const [copied, setCopied] = useState(false);
  const [imagePromptCopied, setImagePromptCopied] = useState(false);
  const [videoPromptCopied, setVideoPromptCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCopy = () => {
    const jsonString = JSON.stringify(creation, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy JSON:', error);
      // Fallback: show alert
      alert('Failed to copy JSON. Please try again.');
    });
  };

  const handleCopyImagePrompt = () => {
    navigator.clipboard.writeText(creation.image_prompt).then(() => {
      setImagePromptCopied(true);
      setTimeout(() => setImagePromptCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy image prompt:', error);
      // Fallback: show alert
      alert('Failed to copy image prompt. Please try again.');
    });
  };

  const handleCopyVideoPrompt = () => {
    navigator.clipboard.writeText(creation.video_prompt).then(() => {
      setVideoPromptCopied(true);
      setTimeout(() => setVideoPromptCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy video prompt:', error);
      // Fallback: show alert
      alert('Failed to copy video prompt. Please try again.');
    });
  };

  const handleCopyImage = async () => {
    const imageUrl = creation.image_filename ? `/api/images/${creation.image_filename}` : creation.generatedImage;
    
    if (!imageUrl) {
      alert('No image to copy. Please upload a scene image first.');
      return;
    }

    try {
      // Convert image URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy image:', error);
      // Fallback: copy image URL
      try {
        await navigator.clipboard.writeText(imageUrl);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Failed to copy image URL:', fallbackError);
        alert('Failed to copy image. Please try again.');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("Image size cannot exceed 10MB.");
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Upload file to server
        const result = await updateSceneImage(creation.id, file);
        
        // Update local state with new image filename
        // We need to update the creation object with the new image_filename
        const updatedCreation = {
          ...creation,
          image_filename: result.filename
        };
        
        // Update parent component state with both imageUrl and filename
        onUpdateImage(creation.id, result.imageUrl, result.filename);
        setImageUploaded(true);
        
        console.log('Image uploaded successfully:', result);
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this scene?")) {
      onDelete(creation.id);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon />
            <span>Back to Scenes</span>
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Scene Image</h2>
            {(creation.generatedImage || creation.image_filename) && (
              <button
                onClick={handleCopyImage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                {imageCopied ? <CheckIcon /> : <CopyIcon />}
                <span>{imageCopied ? 'Copied!' : 'Copy Image'}</span>
              </button>
            )}
          </div>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 mb-4">
              {(creation.generatedImage || creation.image_filename) ? 'Replace scene image' : 'Upload scene image to see it next to the prompt'}
            </p>
            <label className={`cursor-pointer px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              isUploading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}>
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {(creation.generatedImage || creation.image_filename) ? 'Replace Image' : 'Upload Scene Image'}
                </>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Scene Details */}
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Scene Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Title</h3>
              <p className="text-white">{creation.title}</p>
            </div>

            {character && (
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Character</h3>
                <div className="flex items-center gap-3">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                  />
                  <div>
                    <p className="text-white font-medium">{character.name}</p>
                    <p className="text-gray-400 text-sm">{character.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Prompt with Image Side by Side */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Image Prompt</h3>
                <button
                  onClick={handleCopyImagePrompt}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  {imagePromptCopied ? <CheckIcon /> : <CopyIcon />}
                  <span className="hidden sm:inline">{imagePromptCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{creation.image_prompt}</p>
                </div>
                <div className="lg:w-80 w-full">
                  {creation.generatedImage || creation.image_filename ? (
                    <div className="relative group">
                      <img 
                        src={creation.image_filename ? `/api/images/${creation.image_filename}` : creation.generatedImage} 
                        alt={creation.title}
                        className="w-full h-48 lg:h-full object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <button
                          onClick={handleCopyImage}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600/90 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                        >
                          {imageCopied ? <CheckIcon /> : <CopyIcon />}
                          <span>{imageCopied ? 'Copied!' : 'Copy Image'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 lg:h-full bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">No scene image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Video Prompt</h3>
                <button
                  onClick={handleCopyVideoPrompt}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  {videoPromptCopied ? <CheckIcon /> : <CopyIcon />}
                  <span className="hidden sm:inline">{videoPromptCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm leading-relaxed">{creation.video_prompt}</p>
              </div>
            </div>
          </div>

          {/* Social Media Content - Moved to bottom */}
          <div className="mt-8">
            <HashtagGenerator 
              result={creation} 
              character={character} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneDetail;
