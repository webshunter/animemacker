
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pb-2">
        Anime Scene Director AI
      </h1>
      <h2 className="text-lg text-gray-300">Your Personal AI Storyboard Artist</h2>
    </header>
  );
};

export default Header;
