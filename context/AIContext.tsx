import React, { createContext, useContext } from 'react';
import type { KeyProvider } from '../utils/aiService';
import { setStoredApiKey, setStoredModel } from '../utils/aiService';

// ── Hardcoded fallbacks — always used when localStorage is empty ───────────
export const AI_KEY   = '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';
export const AI_MODEL = 'inclusionai/ring-2.6-1t:free';

// Bootstrap localStorage so callOpenAI() always has the right key & model
try { setStoredApiKey(AI_KEY);   } catch { /* SSR guard */ }
try { setStoredModel(AI_MODEL);  } catch { /* SSR guard */ }

// ── Context type (legacy shape kept so nothing else needs to change) ────────
export interface AIContextType {
  apiKey:          string;
  model:           string;
  provider:        KeyProvider;
  isAIEnabled:     boolean;
  /** no-op — key is hardcoded */
  setApiKey:       (key: string) => void;
  /** no-op — key is hardcoded */
  clearApiKey:     () => void;
  /** no-op — model is hardcoded */
  setModel:        (model: string) => void;
  /** always false — settings screen is removed */
  showSettings:    boolean;
  /** no-op */
  setShowSettings: (v: boolean) => void;
}

const FIXED_CTX: AIContextType = {
  apiKey:          AI_KEY,
  model:           AI_MODEL,
  provider:        'openrouter',
  isAIEnabled:     true,
  setApiKey:       () => {},
  clearApiKey:     () => {},
  setModel:        () => {},
  showSettings:    false,
  setShowSettings: () => {},
};

const AIContext = createContext<AIContextType>(FIXED_CTX);

// ── Provider just forwards the fixed value — no runtime state needed ────────
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AIContext.Provider value={FIXED_CTX}>{children}</AIContext.Provider>
);

// ── Hook ────────────────────────────────────────────────────────────────────
export const useAI = (): AIContextType => useContext(AIContext);