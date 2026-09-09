import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AnalysisResult, RiskSeverity } from '../types/analysis';
import { use3DTilt } from '../hooks/use3DTilt';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

// 3D Tilt Wrapper for Dashboard Cards
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children,
  className = '',
  id,
}) => {
  const { ref, tiltStyle, handleMouseMove, handleMouseEnter, handleMouseLeave } = use3DTilt(6);
  return (
    <div
      id={id}
      ref={ref}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel border border-white/10 hover:border-[#F5B841]/40 transition-colors duration-300 p-6 sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('ALL');
  const [copiedAlert, setCopiedAlert] = useState<string | null>(null);

  // Severity pill styling
  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 bg-[#8B0000] text-white border border-red-500/80 text-[10px] font-mono font-bold tracking-widest uppercase rounded-[2px] shadow-[0_0_12px_rgba(239,68,68,0.3)]">
            CRITICAL RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 bg-[#F5B841] text-black border border-[#F5B841] text-[10px] font-mono font-bold tracking-widest uppercase rounded-[2px]">
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 bg-neutral-800 text-neutral-200 border border-neutral-600 text-[10px] font-mono font-bold tracking-widest uppercase rounded-[2px]">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 bg-neutral-900 text-neutral-400 border border-white/10 text-[10px] font-mono font-bold tracking-widest uppercase rounded-[2px]">
            LOW
          </span>
        );
    }
  };

  // Export Production Blueprint function
  const handleExportBlueprint = () => {
    const blueprintData = {
      title: "RETAKE PRODUCTION INTELLIGENCE BLUEPRINT",
      generatedDate: new Date().toISOString(),
      productionScore: `${result.productionScore}/100 (${result.status})`,
      timeSaved: `${result.optimizedPlan.hoursSaved} HOURS SAVED`,
      summary: {
        currentPlanHours: result.currentPlan.hours,
        optimizedPlanHours: result.optimizedPlan.hours,
        criticalRisksCount: result.risks.length,
      },
      risks: result.risks,
      continuityIssues: result.continuityIssues,
      locationIntel: result.locationIntel,
      optimizedShootingOrder: result.optimizedShootingOrder,
      dayBlueprints: result.blueprints,
    };

    const blob = new Blob([JSON.stringify(blueprintData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RETAKE-PRODUCTION-BLUEPRINT-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedAlert("BLUEPRINT EXPORTED SUCCESSFULLY");
    setTimeout(() => setCopiedAlert(null), 3000);
  };

  const filteredRisks = selectedRiskCategory === 'ALL'
    ? result.risks
    : result.risks.filter(r => r.category === selectedRiskCategory);

  // Health score circle radius
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.productionScore / 100) * circumference;

  return (
    <div id="results-dashboard-root" className="relative py-20 px-6 md:px-12 bg-black min-h-screen">
      {/* Alert toast */}
      {copiedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-24 right-8 z-50 bg-[#F5B841] text-black px-4 py-2 font-mono text-xs font-bold shadow-2xl border border-black"
        >
          ✓ {copiedAlert}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Header & Production Health Score Ring */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2.5 h-2.5 bg-[#F5B841]" />
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#F5B841] uppercase">
                RETAKE VERIFIED REPORT
              </span>
              <span className="text-neutral-500 font-mono text-xs">· READY FOR SHOOT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-sans">
              PRODUCTION HEALTH INTELLIGENCE
            </h1>
            <p className="mt-2 text-neutral-400 text-sm max-w-xl font-mono">
              Full cross-agent synthesis complete. Identified {result.continuityIssues?.length || 0} continuity leaks, {result.risks?.filter(r => r.severity === 'CRITICAL').length || 0} critical risks, and {result.optimizedPlan.hoursSaved} hours of logistical savings.
            </p>
          </div>

          {/* Large Circular Production Health Score Ring */}
          <div className="flex items-center gap-6 glass-panel p-6 border border-white/15">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                {/* Background circle */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress animated circle */}
                <motion.circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#F5B841"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text inside ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono tracking-tighter text-white">
                  {result.productionScore}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#F5B841] uppercase font-bold block">
                OVERALL STATUS
              </span>
              <h3 className="text-xl font-bold font-mono tracking-wider text-white">
                {result.status}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Production viable upon resolution of 2 critical continuity markers.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Schedule Comparison & Hours Saved Banner */}
        <TiltCard id="card-schedule-comparison">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 mb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="bi bi-clock-history text-[#F5B841]" />
                <h3 className="text-sm font-bold tracking-widest uppercase text-white font-mono">
                  SCHEDULE EFFICIENCY OPTIMIZER
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Re-clustering scene orders by location eliminates unnecessary company moves and overtime penalties.
              </p>
            </div>

            {/* Big Amber Hours Saved Badge */}
            <div className="px-6 py-3 bg-[#F5B841] text-black font-mono font-bold text-sm tracking-widest uppercase flex items-center gap-3 rounded-[2px] shadow-[0_0_30px_rgba(245,184,65,0.4)]">
              <i className="bi bi-lightning-charge-fill text-lg" />
              <span>{result.optimizedPlan.hoursSaved} HOURS SAVED IN PRODUCTION TURNAROUND</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-center">
            {/* Current Plan */}
            <div className="p-5 bg-black/60 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                ORIGINAL SCRIPT ORDER
              </span>
              <div className="text-3xl font-bold text-neutral-400 my-1">
                {result.currentPlan.hours} HOURS
              </div>
              <span className="text-xs text-red-400">
                {result.currentPlan.setupSwitches} Setups/Moves · High union overtime risk
              </span>
            </div>

            {/* Arrow divider */}
            <div className="p-5 bg-black/60 border border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#F5B841] uppercase tracking-widest block mb-1">
                AI DISPATCH ALGORITHM
              </span>
              <div className="text-xl font-bold text-[#F5B841] my-1 flex items-center gap-2">
                <span>INTEL CLUSTERING</span>
                <i className="bi bi-arrow-right" />
              </div>
              <span className="text-xs text-neutral-400">
                Reduced setups from {result.currentPlan.setupSwitches} down to {result.optimizedPlan.setupSwitches}
              </span>
            </div>

            {/* Optimized Plan */}
            <div className="p-5 bg-black/60 border border-[#F5B841]/50 bg-[#F5B841]/5">
              <span className="text-[10px] text-[#F5B841] uppercase tracking-widest block mb-1">
                RETAKE OPTIMIZED PLAN
              </span>
              <div className="text-3xl font-bold text-white my-1">
                {result.optimizedPlan.hours} HOURS
              </div>
              <span className="text-xs text-emerald-400 font-bold">
                ✓ 100% Union rest compliance · Zero penalties
              </span>
            </div>
          </div>
        </TiltCard>

        {/* Section: Critical Risks */}
        <div id="card-critical-risks" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <i className="bi bi-shield-exclamation text-red-500 text-lg" />
                <h3 className="text-lg font-bold font-mono tracking-widest uppercase text-white">
                  ADVERSARIAL RISK AUDIT ({result.risks.length} FINDINGS)
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Dissected using EXTRACTED / INFERRED / RISK / RECOMMENDATION reasoning architecture.
              </p>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-2 text-[10px] font-mono">
              {['ALL', 'CONTINUITY', 'SCHEDULE', 'LOGISTICS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedRiskCategory(cat)}
                  className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors border rounded-[2px] ${
                    selectedRiskCategory === cat
                      ? 'bg-[#F5B841] text-black border-[#F5B841]'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {filteredRisks.map((item) => (
              <TiltCard key={item.id} className="border-l-4 border-l-red-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(item.severity)}
                    <h4 className="text-base font-bold font-mono text-white tracking-wider uppercase">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    CATEGORY // {item.category}
                  </span>
                </div>

                {/* Structured Risk Reasoning Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Extracted */}
                  <div className="p-3.5 bg-black/60 border border-white/10">
                    <span className="text-[10px] font-bold text-[#F5B841] tracking-widest uppercase block mb-1">
                      [ EXTRACTED FROM SCRIPT ]
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {item.extracted}
                    </p>
                  </div>

                  {/* Inferred */}
                  <div className="p-3.5 bg-black/60 border border-white/10">
                    <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase block mb-1">
                      [ PRODUCTION INFERENCE ]
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {item.inferred}
                    </p>
                  </div>

                  {/* Risk */}
                  <div className="p-3.5 bg-black/60 border border-red-500/30">
                    <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase block mb-1">
                      [ DERAILMENT RISK ]
                    </span>
                    <p className="text-red-200 leading-relaxed">
                      {item.risk}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3.5 bg-black/60 border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase block mb-1">
                      [ AI RECOMMENDATION ]
                    </span>
                    <p className="text-emerald-200 leading-relaxed font-bold">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Section: Continuity Issues & Location Intelligence (2 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Continuity Issues (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <TiltCard id="card-continuity-issues" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-eye text-[#F5B841]" />
                    <h3 className="text-sm font-bold font-mono tracking-widest uppercase text-white">
                      CONTINUITY CONFLICTS
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    SCRIPT DETECTIVE
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {result.continuityIssues.map((issue) => (
                    <div key={issue.id} className="p-4 bg-black/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 border border-[#F5B841]/50 bg-[#F5B841]/10 text-[#F5B841] font-bold">
                          {issue.type} CONFLICT
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          SCENES: {issue.scenesInvolved.join(', ')}
                        </span>
                      </div>
                      <h5 className="text-white font-bold text-sm">
                        {issue.title}
                      </h5>
                      <p className="text-neutral-300 text-xs">
                        {issue.description}
                      </p>
                      <div className="pt-2 border-t border-white/10 text-emerald-400 text-[11px] font-bold">
                        FIX: {issue.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Location Intelligence (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <TiltCard id="card-location-intel" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-globe2 text-[#F5B841]" />
                    <h3 className="text-sm font-bold font-mono tracking-widest uppercase text-white">
                      LOCATION INTELLIGENCE
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#F5B841] bg-[#F5B841]/10 px-2.5 py-1 border border-[#F5B841]/40 flex items-center gap-1.5 font-bold tracking-wider rounded-[2px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B841] animate-pulse" />
                    ◉ GROUNDED BY PARALLEL WEB SEARCH
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {result.locationIntel.map((loc, idx) => (
                    <div key={idx} className="p-4 bg-black/60 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xs uppercase">
                          {loc.locationName}
                        </span>
                        <span className="text-[10px] text-[#F5B841] font-bold">
                          SUNSET: {loc.sunsetTime}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 pt-1">
                        <div>
                          <span className="text-neutral-400 block text-[9px]">GOLDEN HOUR:</span>
                          <span className="text-white">{loc.goldenHourWindow}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[9px]">WEATHER CONDITION:</span>
                          <span className="text-neutral-200">{loc.weatherNote}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 text-[11px]">
                        <span className="text-[#F5B841] block text-[9px]">PERMIT NOTE:</span>
                        <p className="text-neutral-300">{loc.permitInfo}</p>
                      </div>

                      <div className="text-[9px] text-neutral-400 flex items-center gap-1.5 pt-1">
                        <i className="bi bi-link-45deg" />
                        <span>{loc.searchSource}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Section: Optimized Shooting Order */}
        <TiltCard id="card-shooting-order">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <i className="bi bi-sort-numeric-down text-[#F5B841]" />
                <h3 className="text-sm font-bold font-mono tracking-widest uppercase text-white">
                  OPTIMIZED SHOOTING ORDER
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Reordered to cluster setups, minimize company moves, and protect sunset windows.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-1 bg-emerald-950/40 border border-emerald-500/40">
              DISPATCH #904-B
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {result.optimizedShootingOrder.map((orderItem) => (
              <div
                key={orderItem.order}
                className="p-4 bg-black/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#F5B841]/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F5B841] text-black font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {orderItem.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wider">
                        {orderItem.heading}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-white/10 text-neutral-300">
                        DAY {orderItem.day}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {orderItem.reason}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-neutral-400 flex-shrink-0">
                  <span className="text-[#F5B841]">EFFICIENCY LOCK</span>
                </div>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* Section: Production Blueprint (Day 1 / Day 2 Breakdown) */}
        <div id="card-production-blueprint" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="bi bi-kanban text-[#F5B841]" />
              <h3 className="text-lg font-bold font-mono tracking-widest uppercase text-white">
                PRODUCTION BLUEPRINT (CALL SCHEDULE)
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {result.blueprints?.length || 0} PRODUCTION DAYS SYNTHESIZED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.blueprints.map((bp) => (
              <TiltCard key={bp.day} className="border-t-2 border-t-[#F5B841]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#F5B841] font-bold block">
                      SCHEDULE MATRIX
                    </span>
                    <h4 className="text-xl font-bold font-display tracking-wider text-white">
                      SHOOT DAY 0{bp.day}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-xs font-mono text-neutral-200">
                    {bp.targetHours}
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Locations */}
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      LOCATIONS & STAGES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {bp.locations.map((loc, i) => (
                        <span key={i} className="px-2.5 py-1 bg-black/60 border border-white/10 text-white text-[11px]">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scenes */}
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      SCENES TO CAPTURE
                    </span>
                    <div className="flex gap-2">
                      {bp.scenes.map((sc) => (
                        <span key={sc} className="w-7 h-7 flex items-center justify-center bg-[#F5B841]/10 border border-[#F5B841]/40 text-[#F5B841] font-bold text-xs">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cast Required */}
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      CAST REQUIRED & CALL TIMES
                    </span>
                    <p className="text-neutral-200 bg-black/60 p-2.5 border border-white/10">
                      {bp.cast.join(' · ')}
                    </p>
                  </div>

                  {/* Wardrobe & Props */}
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[9px] text-[#F5B841] uppercase tracking-wider block mb-1">
                        KEY WARDROBE
                      </span>
                      <ul className="text-neutral-300 list-disc list-inside space-y-0.5">
                        {bp.keyWardrobe.map((w, i) => (
                          <li key={i} className="truncate">{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#F5B841] uppercase tracking-wider block mb-1">
                        KEY PROPS
                      </span>
                      <ul className="text-neutral-300 list-disc list-inside space-y-0.5">
                        {bp.keyProps.slice(0, 2).map((p, i) => (
                          <li key={i} className="truncate">{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="p-3 bg-neutral-950 border border-white/10 text-[11px] text-neutral-300">
                    <span className="text-[#F5B841] font-bold block text-[9px] mb-0.5">SUPERVISOR LOG:</span>
                    {bp.notes}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Bottom Actions: Export Blueprint & Run New Analysis */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10">
          <div className="text-xs font-mono text-neutral-400">
            BLUEPRINT SYNTHESIZED VIA RETAKE AI · READY FOR FILM OFFICE CALL-SHEET INTEGRATION
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              id="export-blueprint-btn"
              onClick={handleExportBlueprint}
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-mono text-xs font-bold tracking-widest uppercase border border-white/30 hover:border-white transition-all duration-200 flex items-center justify-center gap-2 rounded-[2px]"
            >
              <i className="bi bi-download" />
              <span>EXPORT BLUEPRINT</span>
            </button>

            <button
              id="run-new-analysis-btn"
              onClick={onReset}
              className="flex-1 sm:flex-initial px-8 py-3.5 bg-[#F5B841] hover:bg-[#F5B841]/90 text-black font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] shadow-[0_0_20px_rgba(245,184,65,0.4)] flex items-center justify-center gap-2 rounded-[2px]"
            >
              <i className="bi bi-arrow-repeat" />
              <span>RUN NEW ANALYSIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
