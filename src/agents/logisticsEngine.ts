import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import { SceneBreakdown, LogisticsAnalysis } from './types';

const SYSTEM_PROMPT = `You are a Logistics Engineer on a major film production.
Analyze location clustering, avoidable crew and gear movement, turnaround times, and wasteful location repetition in the script.
Provide:
- locationClusters: array of { locationName, scenes: integer[], isFragmented: boolean }
- turnaroundWarnings: string[] (e.g. lighting turnaround warnings, company moves)
- avoidableMovements: string[] (e.g. relocating back and forth between the same set)
- logisticalImprovements: string[] (e.g. shooting all alley scenes consecutively)
- estimatedBaseSetupSwitches: integer count of camera/lighting setups if shot in script order
- estimatedOptimizedSetupSwitches: integer count of setups if properly clustered
Return ONLY JSON matching the schema.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    locationClusters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          locationName: { type: Type.STRING },
          scenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
          isFragmented: { type: Type.BOOLEAN },
        },
        required: ['locationName', 'scenes', 'isFragmented'],
      },
    },
    turnaroundWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    avoidableMovements: { type: Type.ARRAY, items: { type: Type.STRING } },
    logisticalImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
    estimatedBaseSetupSwitches: { type: Type.INTEGER },
    estimatedOptimizedSetupSwitches: { type: Type.INTEGER },
  },
  required: [
    'locationClusters',
    'turnaroundWarnings',
    'avoidableMovements',
    'logisticalImprovements',
    'estimatedBaseSetupSwitches',
    'estimatedOptimizedSetupSwitches',
  ],
};

export async function runLogisticsEngine(breakdown: SceneBreakdown): Promise<LogisticsAnalysis> {
  console.log('[AGENT 3 — LOGISTICS ENGINE] Evaluating location clustering & move penalties...');
  const prompt = `SCENE BREAKDOWN:
Scenes: ${JSON.stringify(breakdown.scenes.map(s => ({ id: s.id, heading: s.heading, location: s.location, timeOfDay: s.timeOfDay })), null, 2)}
Locations: ${JSON.stringify(breakdown.locations, null, 2)}

Compute location fragmentation, crew moves, and setup turnaround count.`;

  const result = await callGeminiStructured<LogisticsAnalysis>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 3 — LOGISTICS ENGINE] Clustered ${result.locationClusters?.length || 0} locations; estimated switches ${result.estimatedBaseSetupSwitches} -> ${result.estimatedOptimizedSetupSwitches}.`);
  return result;
}
