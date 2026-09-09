import React from 'react';
import { motion } from 'motion/react';
import { Clapperboard3D } from './Clapperboard3D';

interface HeroProps {
  onAnalyzeClick: () => void;
  onViewDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onViewDemoClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden bg-black"
    >
      {/* Massive background watermark in Anton SC */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-display text-[22vw] text-white opacity-[0.04] leading-none tracking-tighter -rotate-3 translate-y-10 whitespace-nowrap">
          RETAKE
        </span>
      </div>

      {/* Ambient lighting spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5B841]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#8B0000]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & Call to Action */}
        <div className="lg:col-span-7 space-y-8">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#F5B841]/30 bg-[#F5B841]/5 text-[#F5B841] text-xs tracking-widest uppercase font-bold rounded-[2px]"
          >
            <span className="w-2 h-2 rounded-full bg-[#F5B841] animate-pulse" />
            <span>AI PRODUCTION SUPERVISOR</span>
          </motion.div>

          {/* Massive Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-1"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] uppercase">
              CATCH THE MISTAKES
            </h1>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5B841] leading-[1.05] uppercase">
              BEFORE YOU SHOOT THEM.
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-neutral-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed tracking-wide font-normal"
          >
            A screenplay tells you what happens. <span className="text-white font-bold">RETAKE</span> tells you what could go wrong when you try to shoot it.
          </motion.p>

          {/* Production intelligence feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-2 text-[10px] tracking-wider uppercase text-neutral-400 font-mono"
          >
            <span className="border border-white/10 px-2.5 py-1 bg-white/5">
              ✓ CONTINUITY REASONING
            </span>
            <span className="border border-white/10 px-2.5 py-1 bg-white/5">
              ✓ SUNSET & WEATHER GROUNDING
            </span>
            <span className="border border-white/10 px-2.5 py-1 bg-white/5">
              ✓ ACTOR WINDOW LOCKS
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <button
              id="hero-primary-cta"
              onClick={onAnalyzeClick}
              className="px-8 py-4 bg-[#F5B841] text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,184,65,0.45)] flex items-center justify-center gap-3 rounded-[2px]"
            >
              <span>ANALYZE A PRODUCTION</span>
              <span className="text-base">→</span>
            </button>

            <button
              id="hero-secondary-cta"
              onClick={onViewDemoClick}
              className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold text-xs tracking-widest uppercase border border-white/30 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 rounded-[2px]"
            >
              <span>▶</span>
              <span>VIEW DEMO SCENARIO</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Floating 3D Clapperboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <Clapperboard3D />
        </motion.div>
      </div>

      {/* Scroll indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer select-none"
        onClick={() => {
          const el = document.getElementById('the-problem');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] tracking-[0.25em] text-neutral-500 hover:text-[#F5B841] transition-colors uppercase font-mono">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-neutral-400 text-xs"
        >
          <i className="bi bi-arrow-down" />
        </motion.div>
      </motion.div>
    </section>
  );
};
