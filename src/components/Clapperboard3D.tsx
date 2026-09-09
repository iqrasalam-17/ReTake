import React from 'react';
import { motion } from 'motion/react';

export const Clapperboard3D: React.FC = () => {
  return (
    <div className="relative w-72 md:w-88 h-96 perspective-1000 flex items-center justify-center select-none">
      {/* Ambient gold glow behind clapperboard */}
      <div className="absolute w-64 h-64 rounded-full bg-[#F5B841]/10 blur-3xl pointer-events-none -z-10" />

      {/* Floating 3D wrapper */}
      <motion.div
        className="w-full max-w-[340px] transform-gpu"
        animate={{
          rotateY: [-14, 14, -14],
          rotateX: [6, -6, 6],
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Clapper Stick (Hinged) */}
        <div className="relative w-full h-11 bg-black border border-white/20 flex overflow-hidden shadow-2xl rounded-t-[2px]">
          {/* Diagonal black/white clapper stripes */}
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 18px, #fff 18px, #fff 36px)',
              boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.8)'
            }}
          />
          {/* Metal hinge bolt */}
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neutral-300 border border-neutral-600 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-neutral-700 rotate-45" />
          </div>
          {/* Magnetic latch plate */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-5 bg-[#F5B841]/80 rounded-[1px]" />
        </div>

        {/* Lower Slate Body */}
        <div className="relative w-full bg-black/90 backdrop-blur-md border-x border-b border-white/20 p-4 shadow-2xl rounded-b-[2px]">
          {/* Slate Header */}
          <div className="border-b border-white/20 pb-2.5 mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-widest text-[#F5B841] font-bold block">RETAKE STUDIOS</span>
              <h4 className="text-xs font-bold tracking-wider text-white">AI PRODUCTION SLATE</h4>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 border border-[#F5B841]/40 bg-[#F5B841]/10 text-[#F5B841] text-[9px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>REC 24 FPS</span>
            </div>
          </div>

          {/* Grid of Scene / Take / Roll */}
          <div className="grid grid-cols-3 border border-white/15 divide-x divide-white/15 mb-3 text-center">
            <div className="p-2">
              <span className="text-[8px] tracking-widest text-neutral-400 block uppercase">SCENE</span>
              <span className="text-lg font-bold text-white tracking-wider">05</span>
            </div>
            <div className="p-2">
              <span className="text-[8px] tracking-widest text-neutral-400 block uppercase">TAKE</span>
              <span className="text-lg font-bold text-[#F5B841] tracking-wider">01</span>
            </div>
            <div className="p-2">
              <span className="text-[8px] tracking-widest text-neutral-400 block uppercase">ROLL</span>
              <span className="text-lg font-bold text-white tracking-wider">A-02</span>
            </div>
          </div>

          {/* Production info lines */}
          <div className="space-y-1.5 text-[9px] uppercase tracking-wider text-neutral-300 font-mono">
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-neutral-400">PROD:</span>
              <span className="text-white font-bold">ROOFTOP CONVERGENCE</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-neutral-400">DIRECTOR:</span>
              <span className="text-white">AI SUPERVISOR</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1">
              <span className="text-neutral-400">CAMERA:</span>
              <span className="text-[#F5B841]">ARRI ALEXA 35 / COOKE S4</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-neutral-400">TIMECODE:</span>
              <span className="text-white font-bold tracking-widest text-[10px]">18:47:02:14</span>
            </div>
          </div>

          {/* Golden Hour warning tag */}
          <div className="mt-3.5 pt-2.5 border-t border-dashed border-white/20 flex items-center justify-between text-[8px] text-neutral-400">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <i className="bi bi-exclamation-triangle-fill text-red-500" />
              SUNSET LIMIT: 6:47 PM
            </span>
            <span className="text-neutral-400">SYNC: 100% OK</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
