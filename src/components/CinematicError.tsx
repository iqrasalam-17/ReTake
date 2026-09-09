import React from 'react';
import { motion } from 'motion/react';

interface CinematicErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const CinematicError: React.FC<CinematicErrorProps> = ({
  errorMessage,
  onRetry,
  onDismiss,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      id="cinematic-error-screen"
      className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 select-none"
    >
      <div className="relative max-w-xl w-full glass-panel border border-red-500/40 bg-black/90 p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-[2px]">
        {/* Top Director Slate Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-red-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-red-400 uppercase">
              PRODUCTION INCIDENT · SCENE BREAK
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            TAKE 01 // INTERRUPTED
          </span>
        </div>

        {/* Big Cinematic Headline */}
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-sans">
            CUT! SOMETHING WENT WRONG ON SET.
          </h2>
          <p className="text-xs font-mono text-neutral-400">
            The multi-agent pipeline encountered an unexpected interruption while cross-referencing production constraints.
          </p>
        </div>

        {/* Error Details Log Box */}
        <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-[2px] mb-6 font-mono text-xs">
          <div className="text-[10px] text-red-400 font-bold tracking-wider uppercase mb-1">
            [ SOUNDSTAGE INCIDENT LOG ]
          </div>
          <p className="text-red-200 leading-relaxed break-words">
            {errorMessage || 'Unknown inference disruption. Please verify connectivity to Gemini & Parallel Search clusters.'}
          </p>
        </div>

        {/* Operational Diagnostics Tips */}
        <div className="text-[11px] font-mono text-neutral-400 space-y-1 mb-8">
          <div className="text-[#F5B841] uppercase tracking-wider text-[10px] font-bold">
            ON-SET TROUBLESHOOTING:
          </div>
          <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[10px]">
            <li>Verify scene headings contain standard Fountain format (e.g., INT. / EXT.)</li>
            <li>Ensure at least one character and location can be identified</li>
            <li>Check network link to Google AI & Parallel Search runtime nodes</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            id="dismiss-error-btn"
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors rounded-[2px]"
          >
            RETURN TO SCRIPT EDITOR
          </button>

          <button
            id="retry-analysis-btn"
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider bg-[#F5B841] hover:bg-[#F5B841]/90 text-black shadow-[0_0_20px_rgba(245,184,65,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 rounded-[2px]"
          >
            <i className="bi bi-arrow-repeat" />
            <span>◉ RETRY PRODUCTION SCAN</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
