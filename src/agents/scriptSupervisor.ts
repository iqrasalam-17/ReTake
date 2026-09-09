import { Type } from '@google/genai';
import { callGeminiStructured } from './client';
import { SceneBreakdown } from './types';

const SYSTEM_PROMPT = `You are a Script Supervisor. Extract from the screenplay a structured breakdown of:
- scenes (id as integer starting at 1, heading, location, timeOfDay, characters, props, wardrobe, actionSummary)
- characters (name, appearances as array of scene ids)
- locations (name, scenes as array of scene ids, interior/exterior: "INT", "EXT", or "INT/EXT")
- props (name, scenes as array of scene ids)
- wardrobe (character, item, scenes as array of scene ids)
Be precise and thorough. Return ONLY JSON.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: 'Scene number (1-indexed)' },
          heading: { type: Type.STRING, description: 'Scene slugline heading (e.g., EXT. WAREHOUSE ALLEY - DUSK)' },
          location: { type: Type.STRING, description: 'Location name (e.g., Warehouse Alley)' },
          timeOfDay: { type: Type.STRING, description: 'Time of day (e.g., DAY, NIGHT, DUSK, DAWN)' },
          characters: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Names of characters present' },
          props: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key physical props in scene' },
          wardrobe: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Wardrobe details mentioned or implied' },
          actionSummary: { type: Type.STRING, description: 'One-sentence summary of action' },
        },
        required: ['id', 'heading', 'location', 'timeOfDay', 'characters', 'props', 'wardrobe', 'actionSummary'],
      },
    },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          appearances: { type: Type.ARRAY, items: { type: Type.INTEGER } },
        },
        required: ['name', 'appearances'],
      },
    },
    locations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
          interiorExterior: { type: Type.STRING, description: 'INT, EXT, or INT/EXT' },
        },
        required: ['name', 'scenes', 'interiorExterior'],
      },
    },
    props: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
        },
        required: ['name', 'scenes'],
      },
    },
    wardrobe: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          character: { type: Type.STRING },
          item: { type: Type.STRING },
          scenes: { type: Type.ARRAY, items: { type: Type.INTEGER } },
        },
        required: ['character', 'item', 'scenes'],
      },
    },
  },
  required: ['scenes', 'characters', 'locations', 'props', 'wardrobe'],
};

export async function runScriptSupervisor(screenplayText: string): Promise<SceneBreakdown> {
  console.log('[AGENT 1 — SCRIPT SUPERVISOR] Extracting screenplay structure...');
  const prompt = `SCREENPLAY TEXT TO ANALYZE:\n\n${screenplayText}`;

  const result = await callGeminiStructured<SceneBreakdown>({
    systemInstruction: SYSTEM_PROMPT,
    prompt,
    schema: SCHEMA,
  });

  console.log(`[AGENT 1 — SCRIPT SUPERVISOR] Extracted ${result.scenes?.length || 0} scenes, ${result.characters?.length || 0} characters.`);
  return result;
}
