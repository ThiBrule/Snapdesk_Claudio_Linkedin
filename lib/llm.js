// ---------------------------------------------------------------------------
// Sélecteur de fournisseur LLM.
//
// Par défaut : Google Gemini. Pour repasser sur Anthropic Claude, définis la
// variable d'environnement LLM_PROVIDER=anthropic (ou claude).
//
// Expose la même interface quel que soit le fournisseur : { MODEL, PROVIDER, generatePost }.
// ---------------------------------------------------------------------------

import * as gemini from './gemini.js';
import * as anthropic from './anthropic.js';

const raw = (process.env.LLM_PROVIDER || 'gemini').toLowerCase().trim();
const useAnthropic = raw === 'anthropic' || raw === 'claude';

const impl = useAnthropic ? anthropic : gemini;

export const PROVIDER = useAnthropic ? 'anthropic' : 'gemini';
export const MODEL = impl.MODEL;
export const generatePost = impl.generatePost;
