import { GoogleGenAI } from '@google/genai';
import Parallel from 'parallel-web';

// High-speed, high-quota model pool: gemini-3.1-flash-lite (blazing fast, high RPM) with robust fallbacks
export const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
export const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-pro-preview'];

let geminiClient: GoogleGenAI | null = null;
let parallelClient: Parallel | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[RETAKE BACKEND] GEMINI_API_KEY is not set in environment.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export function getParallelClient(): Parallel | null {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) {
    console.warn('[PARALLEL SEARCH] PARALLEL_API_KEY is not set. Parallel calls will use graceful simulated runtime responses.');
    return null;
  }
  if (!parallelClient) {
    try {
      parallelClient = new Parallel({ apiKey });
      console.log('[PARALLEL SEARCH] Parallel SDK client initialized successfully with API key.');
    } catch (err) {
      console.error('[PARALLEL SEARCH] Failed to initialize Parallel SDK client:', err);
      return null;
    }
  }
  return parallelClient;
}

interface CallGeminiOptions {
  systemInstruction: string;
  prompt: string;
  schema?: any;
  model?: string;
}

/**
 * Call Gemini with structured JSON output, automatic 1-retry fallback, and type-safe parsing.
 */
export async function callGeminiStructured<T>(options: CallGeminiOptions): Promise<T> {
  const ai = getGeminiClient();
  const modelsToTry = [
    options.model || PRIMARY_MODEL,
    ...FALLBACK_MODELS
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      console.log(`[GEMINI PIPELINE] Calling ${currentModel} (attempt ${i + 1}/${modelsToTry.length})...`);
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: options.schema,
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      if (!text) {
        throw new Error(`Empty response received from ${currentModel}`);
      }

      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/g, '').trim();
      const parsed = JSON.parse(cleaned) as T;
      return parsed;
    } catch (err: any) {
      console.warn(`[GEMINI PIPELINE] Attempt ${i + 1} with ${currentModel} failed:`, err?.message || err);
      lastError = err;
      if (i < modelsToTry.length - 1) {
        console.log(`[GEMINI PIPELINE] Retrying with alternative model (${modelsToTry[i + 1]})...`);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw new Error(`Gemini multi-agent call failed after trying models: ${lastError?.message || 'Unknown error'}`);
}
