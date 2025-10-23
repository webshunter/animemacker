import React from 'react';

interface ArrowLeftIconProps {
  className?: string;
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
      />
    </svg>
  );
};

export { ArrowLeftIcon };
