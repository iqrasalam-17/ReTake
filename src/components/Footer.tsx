import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="bg-black border-t border-white/10 py-10 px-6 md:px-12 text-xs font-mono select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-400">
        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#F5B841]" />
          <span className="text-white font-bold tracking-widest uppercase">
            RETAKE © 2026
          </span>
          <span className="text-neutral-600">·</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        {/* Center */}
        <div className="text-center tracking-wider text-[11px] text-neutral-300 uppercase">
          BUILT WITH GEMINI + PARALLEL SEARCH + GOOGLE CLOUD
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-[11px] tracking-wider">
          <span className="text-neutral-400 border border-white/10 px-2.5 py-1 bg-white/5">
            MIT LICENSED
          </span>
          <span className="text-neutral-500">
            CINEMATIC PROTOCOL V2.4
          </span>
        </div>
      </div>
    </footer>
  );
};
