import React, { useState } from 'react';
import { SceneOutput, Character } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import ErrorDisplay from './ErrorDisplay';
import HashtagGenerator from './HashtagGenerator';

interface ResultDisplayProps {
  result: SceneOutput;
  character: Character | null;
  onCreationComplete: (result: SceneOutput) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, character, onCreationComplete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const jsonString = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveCreation = () => {
    onCreationComplete(result);
  };

  return (
    <div className="mt-4 w-full bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg animate-fade-in mx-2">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-200">Generated Prompts</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3">
        <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto text-xs">
          <code className="text-white whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </code>
        </pre>
      </div>
      
      <div className="p-3 border-t border-gray-700">
        <h4 className="text-base font-semibold text-gray-300 mb-2">Save Scene</h4>
        <p className="text-xs text-gray-400 mb-3">Save these prompts to your collection for later use.</p>
        <button
          onClick={handleSaveCreation}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <span>Save Scene Prompts</span>
        </button>
      </div>
      
      <HashtagGenerator result={result} character={character} />
    </div>
  );
};

export default ResultDisplay;
