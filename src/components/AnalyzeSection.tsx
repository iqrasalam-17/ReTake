import React from 'react';
import { motion } from 'motion/react';
import { DEMO_SCREENPLAY, DEMO_CONSTRAINTS } from '../data/demoScreenplay';

interface AnalyzeSectionProps {
  screenplayText: string;
  setScreenplayText: (val: string) => void;
  constraintsText: string;
  setConstraintsText: (val: string) => void;
  onRunAnalysis: () => void;
  isLoading?: boolean;
}

export const AnalyzeSection: React.FC<AnalyzeSectionProps> = ({
  screenplayText,
  setScreenplayText,
  constraintsText,
  setConstraintsText,
  onRunAnalysis,
  isLoading = false,
}) => {
  const handleLoadDemo = () => {
    setScreenplayText(DEMO_SCREENPLAY);
    setConstraintsText(DEMO_CONSTRAINTS);
  };

  const handleClear = () => {
    setScreenplayText('');
    setConstraintsText('');
  };

  const sceneCountEstimate = (screenplayText.match(/SCENE\s+\d+|INT\.|EXT\./gi) || []).length;
  const wordCount = screenplayText.trim() ? screenplayText.trim().split(/\s+/).length : 0;

  return (
    <section
      id="analyze"
      className="relative py-28 px-6 md:px-12 bg-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label & Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-2 h-2 bg-[#F5B841]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#F5B841] uppercase font-mono">
                03 / ANALYZE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase"
            >
              SUBMIT YOUR PRODUCTION
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl font-normal"
            >
              Paste screenplay scenes and physical shoot constraints. RETAKE cross-examines wardrobe, props, turnaround times, and natural lighting windows.
            </motion.p>
          </div>

          {/* Load Demo / Clear Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="load-demo-scenario-btn"
              type="button"
              onClick={handleLoadDemo}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#F5B841] border border-[#F5B841]/40 hover:border-[#F5B841] text-xs font-bold font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 rounded-[2px]"
            >
              <i className="bi bi-file-earmark-play" />
              <span>LOAD DEMO SCENARIO</span>
            </button>

            {screenplayText && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white border border-white/10 text-xs font-mono tracking-wider uppercase transition-all duration-200 rounded-[2px]"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Screenplay Input (7 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="glass-panel p-5 flex flex-col flex-1 border border-white/10 focus-within:border-[#F5B841]/50 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5B841]" />
                  <label htmlFor="screenplay-input" className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                    SCREENPLAY (FOUNTAIN / STANDARD SCENE FORMAT)
                  </label>
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {sceneCountEstimate > 0 ? `${sceneCountEstimate} DETECTED SCENES · ` : ''}{wordCount} WORDS
                </div>
              </div>

              <textarea
                id="screenplay-input"
                rows={16}
                value={screenplayText}
                onChange={(e) => setScreenplayText(e.target.value)}
                placeholder={`SCENE 1 - INT. SARAH'S APARTMENT - MORNING\n\nSunlight streams through the blinds. SARAH (30s) wears her DISTRESSED OLIVE LEATHER JACKET...\n\nSCENE 2 - EXT. DOWNTOWN 4TH STREET - AFTERNOON\n\nSarah runs down the crowded sidewalk holding her phone...`}
                className="w-full flex-1 bg-black/60 border border-white/10 focus:border-[#F5B841] text-neutral-200 font-mono text-xs sm:text-sm p-4 leading-relaxed tracking-wide resize-y focus:outline-none focus:ring-1 focus:ring-[#F5B841]/50 selection:bg-[#F5B841] selection:text-black"
              />

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>FORMAT: FOUNTAIN / FINAL DRAFT TEXT</span>
                <span>AUTO-EXTRACT CHARACTERS, PROPS, LOCATIONS</span>
              </div>
            </div>
          </div>

          {/* Right: Production Constraints Input (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="glass-panel p-5 flex flex-col flex-1 border border-white/10 focus-within:border-[#F5B841]/50 transition-colors">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <label htmlFor="constraints-input" className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                    PRODUCTION CONSTRAINTS
                  </label>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  LOGISTICS LOCKS
                </span>
              </div>

              <textarea
                id="constraints-input"
                rows={16}
                value={constraintsText}
                onChange={(e) => setConstraintsText(e.target.value)}
                placeholder={`Production days: 2\nSarah unavailable: Day 2 after 3 PM\nApartment: Day 1 only\nCoffee shop: Day 2\nRooftop: Day 2\nCrew turnaround: 11 hours minimum`}
                className="w-full flex-1 bg-black/60 border border-white/10 focus:border-[#F5B841] text-neutral-200 font-mono text-xs sm:text-sm p-4 leading-relaxed tracking-wide resize-y focus:outline-none focus:ring-1 focus:ring-[#F5B841]/50 selection:bg-[#F5B841] selection:text-black"
              />

              <div className="mt-3 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-[#F5B841]">RECOMMENDED CONSTRAINTS:</div>
                <div className="text-neutral-400 text-[10px] leading-tight">
                  • Cast availability limits<br />
                  • Soundstage/location permit hours<br />
                  • Golden hour requirements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA: RUN RETAKE ANALYSIS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 glass-panel border border-[#F5B841]/30 bg-[#F5B841]/5">
          <div>
            <h4 className="text-sm font-bold font-mono tracking-widest uppercase text-white mb-1">
              READY FOR AI SCRIPT & LOGISTICS DEEP-SCAN
            </h4>
            <p className="text-xs text-neutral-400 font-mono">
              Launches 7 parallel autonomous supervisor agents across continuity, schedule, and web grounding.
            </p>
          </div>

          <button
            id="run-retake-analysis-btn"
            type="button"
            onClick={onRunAnalysis}
            disabled={!screenplayText.trim() || isLoading}
            className={`px-10 py-4 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 rounded-[2px] shadow-lg ${
              isLoading
                ? 'bg-[#F5B841]/80 text-black cursor-wait shadow-[0_0_25px_rgba(245,184,65,0.3)]'
                : screenplayText.trim()
                ? 'bg-[#F5B841] hover:bg-[#F5B841]/90 text-black cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,184,65,0.4)]'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/10'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>◉ LAUNCHING PIPELINE...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>◉ RUN RETAKE ANALYSIS</span>
                <span className="text-sm">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
