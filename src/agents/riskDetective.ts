import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import { SceneBreakdown, ContinuityRisk, LogisticsAnalysis, ScheduleAnalysis, AdditionalRisk } from './types';
import { LocationIntel } from '../types/analysis';

const SYSTEM_PROMPT = `You are an adversarial Risk Detective in film production.
Given the full breakdown, continuity risks, logistics analysis, schedule analysis, and location intelligence, hunt aggressively for hidden production failures.
Ask yourself relentlessly: "How could this shoot fail?"
Think about:
- Actor fatigue and union turnaround (SAG-AFTRA 12hr turnaround rule)
- Golden hour time crunch and lost natural light
- Wet costumes / prop damage requiring duplicate backup items
- Pyrotechnics, gunshots, noise ordinances, and police notification
- Night shoots followed immediately by early morning calls
Return additional risks not yet captured, categorized and severity-ranked.
Provide:
- title: concise title
- severity: "CRITICAL", "HIGH", "MEDIUM", or "LOW"
- category: "SCHEDULE", "LOGISTICS", "SAFETY", or "CONTINUITY"
- extracted: verbatim text quote or explicit fact from inputs
- inferred: deductive analysis of why this failure will occur
- risk: operational impact (money wasted, missed shots, safety hazard)
- recommendation: concrete operational countermeasure
Return ONLY a JSON array of AdditionalRisk items.`;

const SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      severity: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, or LOW' },
      category: { type: Type.STRING, description: 'SCHEDULE, LOGISTICS, SAFETY, or CONTINUITY' },
      extracted: { type: Type.STRING },
      inferred: { type: Type.STRING },
      risk: { type: Type.STRING },
      recommendation: { type: Type.STRING },
    },
    required: ['title', 'severity', 'category', 'extracted', 'inferred', 'risk', 'recommendation'],
  },
};

export async function runRiskDetective(inputs: {
  breakdown: SceneBreakdown;
  continuityRisks: ContinuityRisk[];
  logistics: LogisticsAnalysis;
  schedule: ScheduleAnalysis;
  locationIntel: LocationIntel[];
}): Promise<AdditionalRisk[]> {
  console.log('[AGENT 6 — RISK DETECTIVE] Conducting adversarial failure-mode analysis...');
  const prompt = `PRODUCTION AUDIT DOSSIER:

1. SCENE BREAKDOWN:
Scenes count: ${inputs.breakdown.scenes.length}
Locations: ${inputs.breakdown.locations.map(l => l.name).join(', ')}

2. CONTINUITY RISKS ALREADY FOUND:
${JSON.stringify(inputs.continuityRisks.map(r => ({ title: r.title, severity: r.severity })), null, 2)}

3. LOGISTICS ENGINE FINDINGS:
Movements: ${JSON.stringify(inputs.logistics.avoidableMovements)}
Turnaround warnings: ${JSON.stringify(inputs.logistics.turnaroundWarnings)}

4. SCHEDULE ENGINE:
Current: ${inputs.schedule.currentPlanHours} hrs -> Optimized: ${inputs.schedule.optimizedPlanHours} hrs
Reasoning: ${JSON.stringify(inputs.schedule.reasoning)}

5. LOCATION INTEL (PARALLEL SEARCH GROUNDED):
${JSON.stringify(inputs.locationIntel.map(l => ({ name: l.locationName, sunset: l.sunsetTime, permit: l.permitInfo })), null, 2)}

Uncover hidden, insidious risks (union turnaround violations, natural lighting expiration, prop fragility, safety hazards).`;

  const result = await callGeminiStructured<AdditionalRisk[]>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 6 — RISK DETECTIVE] Uncovered ${result?.length || 0} adversarial risk vectors.`);
  return result || [];
}
