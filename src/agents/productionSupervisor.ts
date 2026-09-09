import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import {
  SceneBreakdown,
  ContinuityRisk,
  LogisticsAnalysis,
  ScheduleAnalysis,
  AdditionalRisk,
  FinalBlueprint,
} from './types';
import { LocationIntel } from '../types/analysis';

const SYSTEM_PROMPT = `You are the Production Supervisor.
Synthesize all prior agent outputs into the definitive production blueprint.
- Compute a realistic productionScore (integer 0-100) based on risk severity:
  * If critical safety or union risks exist: score 60-78 ("HIGH RISK" or "MOSTLY READY")
  * If mild risks: 79-89 ("SOLID")
  * If minimal: 90-98 ("EXCELLENT")
- Provide status string (e.g. "MOSTLY READY — 3 CRITICAL RISKS REQUIRE RESOLUTION" or "PRE-PRODUCTION READY")
- Provide 3-5 top high-impact recommendations for executive producers
- Construct dayByDay shooting blueprints (Day 1, Day 2, etc.):
  * day: integer
  * targetHours: e.g. "9.0 Hours"
  * locations: string[]
  * scenes: integer[]
  * cast: string[]
  * keyWardrobe: string[]
  * keyProps: string[]
  * notes: string
Return ONLY JSON matching the schema.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productionScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
    status: { type: Type.STRING, description: 'Executive status summary string' },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    dayByDay: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          targetHours: { type: Type.STRING },
          locations: { type: Type.ARRAY, items: { type: Type.STRING } },
          scenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
          cast: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyWardrobe: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyProps: { type: Type.ARRAY, items: { type: Type.STRING } },
          notes: { type: Type.STRING },
        },
        required: ['day', 'targetHours', 'locations', 'scenes', 'cast', 'keyWardrobe', 'keyProps', 'notes'],
      },
    },
  },
  required: ['productionScore', 'status', 'recommendations', 'dayByDay'],
};

export async function runProductionSupervisor(inputs: {
  breakdown: SceneBreakdown;
  continuityRisks: ContinuityRisk[];
  logistics: LogisticsAnalysis;
  schedule: ScheduleAnalysis;
  locationIntel: LocationIntel[];
  additionalRisks: AdditionalRisk[];
}): Promise<FinalBlueprint> {
  console.log('[AGENT 7 — PRODUCTION SUPERVISOR] Synthesizing final multi-department blueprint...');
  const prompt = `COMPLETE PRODUCTION INTELLIGENCE PACKAGE:

Scenes: ${inputs.breakdown.scenes.length}
Continuity Risks Found: ${inputs.continuityRisks.length} (${inputs.continuityRisks.filter(r => r.severity === 'CRITICAL').length} Critical)
Adversarial Risks Found: ${inputs.additionalRisks.length}
Current Hours: ${inputs.schedule.currentPlanHours} hrs -> Optimized: ${inputs.schedule.optimizedPlanHours} hrs
Locations: ${inputs.locationIntel.map(l => l.locationName).join(', ')}

Continuity Summary:
${JSON.stringify(inputs.continuityRisks.slice(0, 4))}

Schedule Plan:
${JSON.stringify(inputs.schedule.optimizedOrder)}

Compute final production score (0-100), executive readiness status, and generate day-by-day production calls.`;

  const result = await callGeminiStructured<FinalBlueprint>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 7 — PRODUCTION SUPERVISOR] Blueprint ready. Production score: ${result.productionScore}/100. Status: ${result.status}.`);
  return result;
}
