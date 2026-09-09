import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0); // 0: initial, 1: clapped, 2: lights, 3: camera, 4: action, 5: flash
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Snap clapper at 600ms
    const t1 = setTimeout(() => {
      setStage(1);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }, 600);

    // "LIGHTS."
    const t2 = setTimeout(() => {
      setStage(2);
    }, 1100);

    // "CAMERA."
    const t3 = setTimeout(() => {
      setStage(3);
    }, 1800);

    // "ACTION."
    const t4 = setTimeout(() => {
      setStage(4);
    }, 2500);

    // White flash
    const t5 = setTimeout(() => {
      setStage(5);
    }, 3200);

    // Complete
    const t6 = setTimeout(() => {
      onComplete();
    }, 3550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div
      id="retake-splash-screen"
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Skip Button */}
      <button
        id="splash-skip-btn"
        onClick={onComplete}
        className="absolute top-6 right-8 text-xs tracking-widest text-neutral-400 hover:text-[#F5B841] border border-white/10 hover:border-[#F5B841]/50 px-3.5 py-1.5 transition-colors z-20"
      >
        SKIP →
      </button>

      {/* Cinematic Letterbox Bars */}
      <div className="absolute top-0 left-0 w-full h-12 md:h-16 bg-black z-10 border-b border-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 bg-black z-10 border-t border-white/10" />

      {/* Clapperboard Graphic with Snap Stick */}
      <motion.div
        className="relative w-64 md:w-80 mb-10"
        animate={shake ? { x: [-4, 4, -3, 3, 0], y: [-2, 2, -1, 1, 0] } : {}}
        transition={{ duration: 0.25 }}
      >
        {/* Animated Clapper Stick */}
        <motion.div
          className="relative h-10 w-full origin-bottom-left rounded-t-[2px] overflow-hidden border border-white/30"
          initial={{ rotate: -26 }}
          animate={{ rotate: stage >= 1 ? 0 : -26 }}
          transition={{
            type: 'spring',
            stiffness: stage >= 1 ? 600 : 200,
            damping: stage >= 1 ? 25 : 20,
          }}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 16px, #fff 16px, #fff 32px)',
          }}
        >
          {/* Hinge Pin */}
          <div className="absolute bottom-1 left-1.5 w-3 h-3 rounded-full bg-neutral-400 border border-neutral-800" />
        </motion.div>

        {/* Clapper Lower Board */}
        <div
          className="h-9 w-full border-x border-b border-white/30 overflow-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 16px, #fff 16px, #fff 32px)',
          }}
        />
        {/* Sound sync slate tag */}
        <div className="mt-2 text-center text-[10px] tracking-widest text-neutral-400">
          PROD: <span className="text-[#F5B841]">RETAKE-AI</span> · ROLL: <span className="text-white">01</span>
        </div>
      </motion.div>

      {/* Massive sequential typography: LIGHTS. CAMERA. ACTION. */}
      <div className="h-28 md:h-36 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {stage === 2 && (
            <motion.h1
              key="lights"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="font-display text-7xl sm:text-8xl md:text-9xl tracking-wider text-white text-center drop-shadow-2xl"
            >
              LIGHTS.
            </motion.h1>
          )}
          {stage === 3 && (
            <motion.h1
              key="camera"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="font-display text-7xl sm:text-8xl md:text-9xl tracking-wider text-neutral-200 text-center drop-shadow-2xl"
            >
              CAMERA.
            </motion.h1>
          )}
          {stage >= 4 && (
            <motion.h1
              key="action"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="font-display text-7xl sm:text-8xl md:text-9xl tracking-wider text-[#F5B841] text-center drop-shadow-[0_0_40px_rgba(245,184,65,0.6)]"
            >
              ACTION.
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Small RETAKE pulsing logo at bottom */}
      <div className="absolute bottom-20 flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs font-bold tracking-[0.3em] text-[#F5B841]"
        >
          RETAKE
        </motion.div>
        <span className="text-[10px] tracking-widest text-neutral-400">
          AI PRODUCTION SUPERVISOR
        </span>
      </div>

      {/* White Flash Transition into App */}
      <AnimatePresence>
        {stage === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-white z-[110] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
