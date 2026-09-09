import React from 'react';
import { motion } from 'motion/react';
import { use3DTilt } from '../hooks/use3DTilt';

interface ProblemCardProps {
  icon: string;
  title: string;
  description: string;
  riskExample: string;
  metric: string;
  index: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  icon,
  title,
  description,
  riskExample,
  metric,
  index,
}) => {
  const { ref, tiltStyle, handleMouseMove, handleMouseEnter, handleMouseLeave } = use3DTilt(10);

  return (
    <motion.div
      ref={ref}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative glass-panel p-8 flex flex-col justify-between group overflow-hidden border border-white/10 hover:border-[#F5B841]/40 transition-colors duration-300"
    >
      {/* Ambient hover glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B841]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#F5B841]/10 transition-colors" />

      <div>
        {/* Card Header: Icon & Index */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="w-12 h-12 flex items-center justify-center border border-white/15 bg-white/5 text-[#F5B841] text-2xl group-hover:border-[#F5B841]/60 transition-colors">
            <i className={`bi ${icon}`} />
          </div>
          <span className="text-xs font-mono tracking-widest text-neutral-400">
            PHASE // 0{index + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold tracking-wider text-white uppercase mb-4 group-hover:text-[#F5B841] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-neutral-300 text-sm leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Concrete Risk Callout */}
        <div className="p-3.5 bg-black/60 border border-white/10 text-xs font-mono text-neutral-400 space-y-1">
          <div className="text-[10px] uppercase text-[#F5B841] font-bold tracking-wider">
            SCENARIO RISK:
          </div>
          <p className="text-neutral-300 italic">
            "{riskExample}"
          </p>
        </div>
      </div>

      {/* Bottom Impact Metric */}
      <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-400 uppercase tracking-wider text-[10px]">TYPICAL IMPACT</span>
        <span className="text-red-400 font-bold">{metric}</span>
      </div>
    </motion.div>
  );
};

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: 'bi-exclamation-triangle',
      title: 'CONTINUITY BLIND SPOTS',
      description: 'Wardrobe, props, and character states drift silently across scenes. Human script supervisors miss microscopic details across hundred-page scripts.',
      riskExample: 'Sarah wearing olive jacket in Scene 1, beige trench coat on 4th Street, back in olive jacket inside ransacked apartment without script justification.',
      metric: '$45,000+ RESHOOT COST'
    },
    {
      icon: 'bi-clock-history',
      title: 'SCHEDULING CHAOS',
      description: 'Actor availability, sunset windows, and location bookings collide in unexpected ways. A single schedule slip ripples into catastrophic overtime.',
      riskExample: 'Planning natural sunset exterior on rooftop after lead actor hard union turnaround cutoff at 15:00 PM.',
      metric: '3.5 HRS LOST DAILY'
    },
    {
      icon: 'bi-geo-alt',
      title: 'LOGISTICAL WASTE',
      description: 'Unnecessary location switches burn hours you can\'t get back. Moving 80 crew members back and forth across city traffic drains budget and energy.',
      riskExample: 'Shooting Apartment (morning), packing company trucks to street, then unpacking back into Apartment for night sequence.',
      metric: '6+ HOURS TRUCKING WASTE'
    }
  ];

  return (
    <section
      id="the-problem"
      className="relative py-28 px-6 md:px-12 bg-black border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-2 h-2 bg-[#F5B841]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#F5B841] uppercase font-mono">
              01 / THE PROBLEM
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase max-w-4xl"
          >
            A SCREENPLAY IS NOT A PRODUCTION PLAN.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-neutral-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
          >
            Screenwriters craft dramatic conflict on the page. But physical film sets live or die on real-world constraints: union turnaround rules, natural golden hour windows, and company moves.
          </motion.p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <ProblemCard
              key={problem.title}
              index={index}
              {...problem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
