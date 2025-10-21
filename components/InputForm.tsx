
import React from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

interface InputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ idea, setIdea, onGenerate, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  };

  return (
    <div className="w-full px-2">
      <div className="relative">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A high school girl dancing in the rain on a neon-lit Tokyo street..."
          className="w-full h-24 sm:h-28 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none text-sm placeholder-gray-500"
          disabled={isLoading}
        />
        <span className="absolute bottom-1 right-2 text-xs text-gray-500 hidden sm:block">Ctrl+Enter</span>
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading || !idea.trim()}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Directing...</span>
          </>
        ) : (
          <>
            <SparkleIcon />
            <span>Generate Scene</span>
          </>
        )}
      </button>
    </div>
  );
};

export default InputForm;
