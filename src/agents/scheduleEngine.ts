import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import { SceneBreakdown, ScheduleAnalysis } from './types';

const SYSTEM_PROMPT = `You are a Schedule Engineer.
Given the scene breakdown and production constraints (day budget, actor wrap times, lighting hours, permit restrictions), produce an optimized shooting order that minimizes turnaround and overtime.
Return:
- currentPlanHours: number (estimated total production hours if shot in script order, typically 10-14 hours)
- optimizedPlanHours: number (optimized total production hours, saving 2-4 hours)
- hoursSaved: number (currentPlanHours - optimizedPlanHours)
- optimizedOrder: array of objects { order: integer (1-indexed), sceneNumber: integer, heading: string, reason: string, day: integer }
- reasoning: array of strings explaining why scenes were grouped and reordered.
Return ONLY JSON matching the schema.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    currentPlanHours: { type: Type.NUMBER },
    optimizedPlanHours: { type: Type.NUMBER },
    hoursSaved: { type: Type.NUMBER },
    optimizedOrder: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          order: { type: Type.INTEGER },
          sceneNumber: { type: Type.INTEGER },
          heading: { type: Type.STRING },
          reason: { type: Type.STRING },
          day: { type: Type.INTEGER },
        },
        required: ['order', 'sceneNumber', 'heading', 'reason', 'day'],
      },
    },
    reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['currentPlanHours', 'optimizedPlanHours', 'hoursSaved', 'optimizedOrder', 'reasoning'],
};

export async function runScheduleEngine(breakdown: SceneBreakdown, constraintsText: string): Promise<ScheduleAnalysis> {
  console.log('[AGENT 4 — SCHEDULE ENGINE] Calculating optimized shooting order & call schedules...');
  const prompt = `SCENE BREAKDOWN:
${JSON.stringify(breakdown.scenes.map(s => ({
  id: s.id,
  heading: s.heading,
  location: s.location,
  timeOfDay: s.timeOfDay,
  characters: s.characters,
})), null, 2)}

PRODUCTION CONSTRAINTS & LIMITS:
${constraintsText}

Construct an optimized shooting schedule that honors the constraints, groups locations, and minimizes actor idle time and company moves.`;

  const result = await callGeminiStructured<ScheduleAnalysis>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 4 — SCHEDULE ENGINE] Schedule optimized: ${result.currentPlanHours}h -> ${result.optimizedPlanHours}h (${result.hoursSaved}h saved).`);
  return result;
}
