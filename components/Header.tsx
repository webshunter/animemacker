
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-4 px-4">
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Anime Scene Director AI
      </h1>
      <h2 className="text-sm text-gray-300 mt-1">Your Personal AI Storyboard Artist</h2>
    </header>
  );
};

export default Header;
