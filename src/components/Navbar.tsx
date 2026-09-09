import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-black/60 backdrop-blur-md border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: RETAKE Wordmark */}
        <button
          id="nav-logo-btn"
          onClick={() => handleLinkClick('hero')}
          className="group flex items-center gap-2.5 text-left text-white"
        >
          <span className="w-2.5 h-2.5 bg-[#F5B841] transition-transform duration-300 group-hover:rotate-45" />
          <span className="font-bold text-lg md:text-xl tracking-[0.25em] text-white">
            RETAKE
          </span>
          <span className="hidden sm:inline-block text-[9px] tracking-widest text-[#F5B841] border border-[#F5B841]/30 px-1.5 py-0.5 ml-1">
            STUDIO INTEL
          </span>
        </button>

        {/* Center: THE PROBLEM · HOW IT WORKS · ANALYZE */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
          <button
            id="nav-link-problem"
            onClick={() => handleLinkClick('the-problem')}
            className="text-neutral-400 hover:text-white transition-colors duration-200 hover:border-b hover:border-[#F5B841] py-1"
          >
            THE PROBLEM
          </button>
          <span className="text-white/20">·</span>
          <button
            id="nav-link-how-it-works"
            onClick={() => handleLinkClick('how-it-works')}
            className="text-neutral-400 hover:text-white transition-colors duration-200 hover:border-b hover:border-[#F5B841] py-1"
          >
            HOW IT WORKS
          </button>
          <span className="text-white/20">·</span>
          <button
            id="nav-link-analyze"
            onClick={() => handleLinkClick('analyze')}
            className="text-[#F5B841] hover:text-white transition-colors duration-200 hover:border-b hover:border-[#F5B841] py-1"
          >
            ANALYZE
          </button>
        </div>

        {/* Right: REC Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-[2px]">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            />
            <span className="text-xs font-bold tracking-widest text-neutral-200 font-mono">
              REC
            </span>
            <span className="hidden lg:inline-block text-[10px] text-neutral-500 font-mono pl-1 border-l border-white/10">
              24.00 FPS
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 space-y-4 text-xs font-bold tracking-widest">
          <button
            onClick={() => handleLinkClick('the-problem')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#F5B841]"
          >
            01 / THE PROBLEM
          </button>
          <button
            onClick={() => handleLinkClick('how-it-works')}
            className="block w-full text-left py-2 text-neutral-300 hover:text-[#F5B841]"
          >
            02 / HOW IT WORKS
          </button>
          <button
            onClick={() => handleLinkClick('analyze')}
            className="block w-full text-left py-2 text-[#F5B841]"
          >
            03 / ANALYZE PRODUCTION →
          </button>
        </div>
      )}
    </nav>
  );
};
