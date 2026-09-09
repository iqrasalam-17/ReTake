import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AGENT_STAGES } from '../data/mockAnalysis';
import { AnalysisResult } from '../types/analysis';

interface AnalysisProgressProps {
  screenplay: string;
  constraints: string;
  onComplete: (result: AnalysisResult) => void;
  onError: (errorMessage: string) => void;
}

const STAGE_INDEX_MAP: Record<string, number> = {
  SCRIPT_SUPERVISOR: 0,
  CONTINUITY_DETECTIVE: 1,
  LOGISTICS_ENGINE: 2,
  SCHEDULE_ENGINE: 3,
  LOCATION_SCOUT: 4,
  RISK_DETECTIVE: 5,
  PRODUCTION_SUPERVISOR: 6,
};

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  screenplay,
  constraints,
  onComplete,
  onError,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [liveMessages, setLiveMessages] = useState<string[]>(
    AGENT_STAGES.map((s) => s.liveStatus)
  );
  const [telemetryText, setTelemetryText] = useState<string>(
    'CONNECTING TO PARALLEL INFERENCE CLUSTER'
  );

  const isFastForwardedRef = useRef<boolean>(false);
  const resultRef = useRef<AnalysisResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let streamActive = false;
    let fallbackInterval: NodeJS.Timeout | null = null;

    const handleReceivedResult = (result: AnalysisResult) => {
      resultRef.current = result;
      setCompletedStages([0, 1, 2, 3, 4, 5, 6]);
      setCurrentStageIndex(6);
      setTelemetryText('PRODUCTION BLUEPRINT READY · COMPILING REPORT');
      
      const delay = isFastForwardedRef.current ? 100 : 700;
      setTimeout(() => {
        onComplete(result);
      }, delay);
    };

    const runFallbackFetch = async () => {
      console.log('[RETAKE CLIENT] Starting fallback standard API call...');
      // Start visual timer for progress animation while waiting for API
      let simulatedIndex = 0;
      fallbackInterval = setInterval(() => {
        simulatedIndex++;
        if (simulatedIndex < AGENT_STAGES.length) {
          setCurrentStageIndex(simulatedIndex);
          setCompletedStages((prev) => {
            const needed = [];
            for (let i = 0; i < simulatedIndex; i++) {
              if (!prev.includes(i)) needed.push(i);
            }
            return [...prev, ...needed];
          });
        }
      }, 2500);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screenplay, constraints }),
          signal: abortController.signal,
        });

        if (fallbackInterval) clearInterval(fallbackInterval);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || `Server returned HTTP ${response.status}`);
        }

        const data: AnalysisResult = await response.json();
        handleReceivedResult(data);
      } catch (err: any) {
        if (fallbackInterval) clearInterval(fallbackInterval);
        if (abortController.signal.aborted) return;
        console.error('[RETAKE CLIENT] Standard API error:', err);
        onError(err?.message || 'Pipeline encountered a critical error on set.');
      }
    };

    // 1. Attempt Real-time SSE Streaming via POST /api/analyze/stream
    const startSSEStream = async () => {
      try {
        setTelemetryText('ESTABLISHING SSE STREAM // /api/analyze/stream');
        const response = await fetch('/api/analyze/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screenplay, constraints }),
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`SSE stream unavailable (HTTP ${response.status})`);
        }

        streamActive = true;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() || '';

          for (const block of blocks) {
            const trimmed = block.trim();
            if (!trimmed) continue;

            for (const line of trimmed.split('\n')) {
              if (line.startsWith('data:')) {
                const jsonStr = line.slice(5).trim();
                if (!jsonStr) continue;

                try {
                  const event = JSON.parse(jsonStr);

                  if (event.stage && STAGE_INDEX_MAP[event.stage] !== undefined) {
                    const stageIdx = STAGE_INDEX_MAP[event.stage];

                    if (event.status === 'running') {
                      setCurrentStageIndex(stageIdx);
                      setCompletedStages((prev) => {
                        const needed = [];
                        for (let i = 0; i < stageIdx; i++) {
                          if (!prev.includes(i)) needed.push(i);
                        }
                        return [...prev, ...needed];
                      });
                      if (event.message) {
                        setLiveMessages((prev) => {
                          const copy = [...prev];
                          copy[stageIdx] = event.message;
                          return copy;
                        });
                        setTelemetryText(event.message.toUpperCase());
                      }
                    } else if (event.status === 'complete') {
                      setCompletedStages((prev) =>
                        prev.includes(stageIdx) ? prev : [...prev, stageIdx]
                      );
                      if (event.message) {
                        setLiveMessages((prev) => {
                          const copy = [...prev];
                          copy[stageIdx] = event.message;
                          return copy;
                        });
                      }
                    }
                  } else if (event.stage === 'COMPLETE') {
                    if (event.result) {
                      handleReceivedResult(event.result);
                      return;
                    }
                  } else if (event.stage === 'ERROR') {
                    throw new Error(event.message || 'Pipeline agent failed during execution.');
                  }
                } catch (parseErr: any) {
                  // If JSON parse fails or custom error thrown
                  if (event_is_error(parseErr)) {
                    throw parseErr;
                  }
                }
              }
            }
          }
        }
      } catch (streamErr: any) {
        if (abortController.signal.aborted) return;
        console.warn('[RETAKE CLIENT] SSE stream unavailable or interrupted, falling back to /api/analyze:', streamErr?.message || streamErr);
        if (!streamActive) {
          runFallbackFetch();
        } else {
          onError(streamErr?.message || 'Pipeline stream disconnected.');
        }
      }
    };

    function event_is_error(err: any): boolean {
      return err instanceof Error && err.message.includes('Pipeline');
    }

    startSSEStream();

    return () => {
      abortController.abort();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [screenplay, constraints, onComplete, onError]);

  const handleFastForward = () => {
    isFastForwardedRef.current = true;
    setCompletedStages([0, 1, 2, 3, 4, 5, 6]);
    setCurrentStageIndex(6);

    if (resultRef.current) {
      onComplete(resultRef.current);
    } else {
      setTelemetryText('FAST-FORWARDING TO LATEST INFERENCE AGENT...');
    }
  };

  const progressPercent = Math.round(
    ((completedStages.length + 0.5) / AGENT_STAGES.length) * 100
  );

  return (
    <div
      id="analysis-progress-screen"
      className="fixed inset-0 z-[90] bg-black flex flex-col justify-between select-none overflow-hidden"
    >
      {/* Film Strip Left Border */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-black border-r border-white/20 flex flex-col justify-between py-2 overflow-hidden z-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, -96] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="flex flex-col gap-4 items-center"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 sm:w-5 h-6 rounded-[2px] bg-neutral-900 border border-white/20 shadow-inner flex-shrink-0"
            />
          ))}
        </motion.div>
      </div>

      {/* Film Strip Right Border */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-black border-l border-white/20 flex flex-col justify-between py-2 overflow-hidden z-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, -96] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="flex flex-col gap-4 items-center"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 sm:w-5 h-6 rounded-[2px] bg-neutral-900 border border-white/20 shadow-inner flex-shrink-0"
            />
          ))}
        </motion.div>
      </div>

      {/* Header bar */}
      <div className="pt-8 px-12 sm:px-20 flex items-center justify-between border-b border-white/10 pb-4 z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#F5B841] animate-pulse" />
          <h2 className="text-sm sm:text-base font-bold tracking-[0.25em] text-white uppercase font-mono">
            RETAKE MULTI-AGENT INFERENCE ENGINE
          </h2>
        </div>

        <button
          onClick={handleFastForward}
          className="text-xs font-mono text-neutral-400 hover:text-[#F5B841] border border-white/10 hover:border-[#F5B841]/50 px-3 py-1.5 transition-colors uppercase tracking-wider"
        >
          FAST FORWARD →
        </button>
      </div>

      {/* Center Stages Container */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-12 sm:px-16 py-6 z-10 overflow-y-auto">
        <div className="space-y-4">
          {AGENT_STAGES.map((agent, index) => {
            const isDone = completedStages.includes(index);
            const isActive = currentStageIndex === index && !isDone;
            const currentMessage = liveMessages[index] || agent.liveStatus;

            return (
              <motion.div
                key={agent.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-4 p-3.5 border transition-all duration-300 rounded-[2px] ${
                  isActive
                    ? 'border-[#F5B841] bg-[#F5B841]/10 shadow-[0_0_20px_rgba(245,184,65,0.2)]'
                    : isDone
                    ? 'border-white/15 bg-white/[0.03]'
                    : 'border-white/5 bg-transparent opacity-40'
                }`}
              >
                {/* Circle Status Indicator */}
                <div className="pt-0.5">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      ✓
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-2 border-t-[#F5B841] border-r-[#F5B841] border-b-transparent border-l-transparent animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Agent Info & Live Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#F5B841]">
                        {agent.code}
                      </span>
                      <h4 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
                        {agent.name}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      {isDone ? 'COMPLETE' : isActive ? 'PROCESSING' : 'QUEUED'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-neutral-300 mt-1 truncate">
                    {isActive ? (
                      <span className="text-[#F5B841] animate-pulse">
                        ▶ {currentMessage}
                      </span>
                    ) : isDone ? (
                      <span className="text-neutral-400">
                        {currentMessage}
                      </span>
                    ) : (
                      <span className="text-neutral-600">
                        Waiting for pipeline dependencies...
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Bar & Telemetry */}
      <div className="px-12 sm:px-20 pb-8 pt-4 border-t border-white/10 z-10 bg-black/90">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
            <span className="flex items-center gap-2 truncate max-w-xl">
              <span className="w-2 h-2 rounded-full bg-[#F5B841] animate-ping flex-shrink-0" />
              <span className="truncate">{telemetryText}</span>
            </span>
            <span className="text-[#F5B841] font-bold flex-shrink-0">
              {Math.min(100, progressPercent)}%
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-1.5 bg-neutral-900 border border-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#F5B841]"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, progressPercent)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
