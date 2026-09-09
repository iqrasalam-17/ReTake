import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import { SceneBreakdown, ContinuityRisk } from './types';

const SYSTEM_PROMPT = `You are a Continuity Detective. Given a scene breakdown, rigorously identify wardrobe conflicts, prop conflicts, character-state inconsistencies (injuries, dirt, wetness), and location continuity issues.
For each issue provide:
- category: one of "WARDROBE", "PROP", "STATE", "LOCATION"
- severity: one of "CRITICAL", "HIGH", "MEDIUM", "LOW"
- title: concise title of the conflict
- description: clear explanation of why this is a continuity violation across the affected scenes
- affectedScenes: array of integer scene IDs involved
- recommendation: concrete fix for production or costume/props department
- evidenceType: "EXTRACTED" (directly stated in script text) or "INFERRED" (deduced from narrative continuity)
Return ONLY a JSON array of risks.`;

const SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: 'WARDROBE, PROP, STATE, or LOCATION' },
      severity: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, or LOW' },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      affectedScenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
      recommendation: { type: Type.STRING },
      evidenceType: { type: Type.STRING, description: 'EXTRACTED or INFERRED' },
    },
    required: ['category', 'severity', 'title', 'description', 'affectedScenes', 'recommendation', 'evidenceType'],
  },
};

export async function runContinuityDetective(breakdown: SceneBreakdown): Promise<ContinuityRisk[]> {
  console.log('[AGENT 2 — CONTINUITY DETECTIVE] Hunting for continuity conflicts...');
  const prompt = `SCENE BREAKDOWN FOR CONTINUITY AUDIT:
Scenes: ${JSON.stringify(breakdown.scenes, null, 2)}
Wardrobe items: ${JSON.stringify(breakdown.wardrobe, null, 2)}
Props tracked: ${JSON.stringify(breakdown.props, null, 2)}
Characters: ${JSON.stringify(breakdown.characters, null, 2)}
Locations: ${JSON.stringify(breakdown.locations, null, 2)}

Audit every transition, prop handover, outfit continuity, and physical state continuity. Return an array of ContinuityRisk items.`;

  const result = await callGeminiStructured<ContinuityRisk[]>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 2 — CONTINUITY DETECTIVE] Detected ${result?.length || 0} continuity risks.`);
  return result || [];
}
