import React from 'react';
import { motion } from 'motion/react';
import { AGENT_STAGES } from '../data/mockAnalysis';

export const HowItWorksSection: React.FC = () => {
  const agentIcons = [
    'bi-file-earmark-text',
    'bi-eye',
    'bi-truck',
    'bi-calendar2-range',
    'bi-compass',
    'bi-shield-exclamation',
    'bi-award',
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-28 px-6 md:px-12 bg-black border-t border-white/10 overflow-hidden"
    >
      {/* Background Watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] text-white font-display text-[26vw] leading-none"
        aria-hidden="true"
      >
        AGENTS
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-2 h-2 bg-[#F5B841]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#F5B841] uppercase font-mono">
              02 / HOW IT WORKS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase"
          >
            SEVEN AGENTS. ONE PRODUCTION.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
          >
            A multi-agent orchestra analyzing your screenplay from script extraction to adversarial failure prediction and web-grounded physics.
          </motion.p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-white/15 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 md:pl-14 space-y-8">
          {AGENT_STAGES.map((agent, index) => (
            <motion.div
              key={agent.code}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Timeline Indicator Pin on vertical line */}
              <div className="absolute -left-[31px] sm:-left-[47px] md:-left-[63px] top-6 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black border border-white/30 flex items-center justify-center group-hover:border-[#F5B841] group-hover:bg-[#F5B841]/10 transition-colors">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="w-2 h-2 rounded-full bg-[#F5B841]"
                  />
                </div>
              </div>

              {/* Agent Card */}
              <div className="glass-panel p-6 sm:p-7 border border-white/10 hover:border-[#F5B841]/50 transition-all duration-300 group-hover:bg-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#F5B841] px-2 py-0.5 border border-[#F5B841]/30 bg-[#F5B841]/10">
                      0{agent.id}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl tracking-wide text-white group-hover:text-[#F5B841] transition-colors">
                      {agent.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <i className={`bi ${agentIcons[index % agentIcons.length]} text-[#F5B841]`} />
                    <span className="tracking-wider">{agent.code}</span>
                  </div>
                </div>

                <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Sub-process sample status */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                    REAL-TIME DIRECTIVE:
                  </span>
                  <span className="text-neutral-300 truncate text-[11px]">
                    {agent.liveStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
