import React from 'react';

export const GrainOverlay: React.FC = () => {
  return (
    <div
      id="grain-overlay-container"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full opacity-[0.07] mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="retake-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#retake-film-grain)" />
      </svg>
      {/* Subtle scanline effect */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3))] bg-[length:100%_4px] opacity-20 pointer-events-none"
      />
    </div>
  );
};
