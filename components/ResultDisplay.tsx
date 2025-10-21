import React, { useState } from 'react';
import { SceneOutput, Character } from '../types';
import { generateImageWithReference } from '../services/geminiService';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ImageIcon } from './icons/ImageIcon';
import ErrorDisplay from './ErrorDisplay';

interface ResultDisplayProps {
  result: SceneOutput;
  character: Character | null;
  onCreationComplete: (result: SceneOutput, generatedImage: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, character, onCreationComplete }) => {
  const [copied, setCopied] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  const handleCopy = () => {
    const jsonString = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImageGenerate = async () => {
    if (!character?.image || !result.image_prompt) return;

    setIsImageGenerating(true);
    setImageGenError(null);

    try {
      const mimeType = character.image.substring(5, character.image.indexOf(';'));
      const image = await generateImageWithReference(result.image_prompt, character.image, mimeType);
      onCreationComplete(result, image);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setImageGenError(errorMessage);
      setIsImageGenerating(false); // Stop loading on error
    }
  };

  return (
    <div className="mt-8 w-full bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg animate-fade-in">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">Generated Prompts</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
          <code className="text-white whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </code>
        </pre>
      </div>
      
      {character?.image && (
        <div className="p-4 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-gray-300 mb-4">Finalize Scene</h4>
          <p className="text-sm text-gray-400 mb-4">If you're happy with the prompts, generate the final image to save this creation.</p>
          <button
            onClick={handleImageGenerate}
            disabled={isImageGenerating}
            className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-100"
          >
            {isImageGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating & Saving...</span>
              </>
            ) : (
              <>
                <ImageIcon />
                <span>Generate Image & Save Creation</span>
              </>
            )}
          </button>
          
          {isImageGenerating && (
             <div className="text-center my-6">
                <p className="text-gray-400 animate-pulse">The AI is rendering your vision...</p>
             </div>
          )}

          {imageGenError && <ErrorDisplay message={imageGenError} />}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
