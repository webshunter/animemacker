
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-400 rounded-full opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 border-l-purple-500 border-b-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-gray-300 animate-pulse">AI is crafting your scene...</p>
    </div>
  );
};

export default Loader;
