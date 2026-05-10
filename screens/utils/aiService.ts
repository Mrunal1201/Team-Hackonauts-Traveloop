// ── Traveloop AI Service ───────────────────────────────────────────────────
// Uses a hardcoded OpenRouter key + model. No user configuration required.

export type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENAI_URL     = 'https://api.openai.com/v1/chat/completions';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const KEY_STORAGE   = 'traveloop_ai_key';
const MODEL_STORAGE = 'traveloop_ai_model';

// Hardcoded fallbacks — always used when localStorage is empty
const HARDCODED_KEY   = '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';
const HARDCODED_MODEL = 'inclusionai/ring-2.6-1t:free';

// ── Key type detection ─────────────────────────────────────────────────────
export type KeyProvider = 'openrouter' | 'openai' | 'unknown';

export const detectProvider = (key: string): KeyProvider => {
  if (key.startsWith('sk-or-v1-')) return 'openrouter';
  if (key.startsWith('sk-proj-') || key.startsWith('sk-')) return 'openai';
  return 'unknown';
};

const getEndpoint = (key: string): string =>
  detectProvider(key) === 'openrouter' ? OPENROUTER_URL : OPENAI_URL;

// ── Persistence helpers ────────────────────────────────────────────────────
export const getStoredApiKey   = (): string => localStorage.getItem(KEY_STORAGE) || HARDCODED_KEY;
export const setStoredApiKey   = (key: string): void => localStorage.setItem(KEY_STORAGE, key);
export const clearStoredApiKey = (): void => localStorage.removeItem(KEY_STORAGE);
export const getStoredModel    = (): string => localStorage.getItem(MODEL_STORAGE) || HARDCODED_MODEL;
export const setStoredModel    = (model: string): void => localStorage.setItem(MODEL_STORAGE, model);

// ── Model resolver ─────────────────────────────────────────────────────────
export const resolveModel = (model: string, key: string): string => {
  const provider = detectProvider(key);
  if (provider === 'openai') {
    return model.replace(/^openai\//, '').replace(/^anthropic\/.*/, 'gpt-4o-mini');
  }
  return model; // OpenRouter accepts full namespaced IDs
};

// ── Core API caller ────────────────────────────────────────────────────────
export const callOpenAI = async (
  messages: AIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    json_mode?: boolean;
  }
): Promise<string> => {
  // Always resolve to the stored key (which defaults to HARDCODED_KEY)
  const apiKey   = getStoredApiKey();
  const model    = resolveModel(options?.model || getStoredModel(), apiKey);
  const endpoint = getEndpoint(apiKey);

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens:  options?.max_tokens  ?? 1500,
  };

  if (options?.json_mode) {
    if (model.startsWith('openai/') || detectProvider(apiKey) === 'openai') {
      body.response_format = { type: 'json_object' };
    } else {
      const sys = messages.find(m => m.role === 'system');
      if (sys) sys.content += '\n\nIMPORTANT: Respond with valid JSON only — no markdown, no code fences.';
    }
  }

  const headers: Record<string, string> = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  if (detectProvider(apiKey) === 'openrouter') {
    headers['HTTP-Referer'] = 'https://traveloop.app';
    headers['X-Title']      = 'Traveloop';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    if (response.status === 401) throw new Error('INVALID_KEY');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
};

// ── Key validation ─────────────────────────────────────────────────────────
export const testApiKey = async (
  key: string
): Promise<{ valid: boolean; provider?: KeyProvider; error?: string }> => {
  const endpoint = getEndpoint(key);
  const provider = detectProvider(key);
  const testModel = provider === 'openrouter' ? HARDCODED_MODEL : 'gpt-4o-mini';

  const headers: Record<string, string> = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${key}`,
  };
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://traveloop.app';
    headers['X-Title']      = 'Traveloop';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model:      testModel,
        messages:   [{ role: 'user', content: 'Reply with the word OK only.' }],
        max_tokens: 5,
      }),
    });

    if (response.ok) return { valid: true, provider };
    const data = await response.json().catch(() => ({})) as { error?: { message?: string } };
    if (response.status === 401) return { valid: false, error: 'Invalid API key — check and try again.' };
    if (response.status === 429) return { valid: false, provider, error: 'Rate limited — key is valid but quota reached.' };
    return { valid: false, error: data.error?.message || 'Connection failed.' };
  } catch {
    return { valid: false, error: 'Network error — check your internet connection.' };
  }
};

// ── Travel-specific prompts ────────────────────────────────────────────────
export const TRAVEL_SYSTEM_PROMPT = `You are Traveloop AI, an expert travel planning assistant with deep knowledge of destinations worldwide. You give concise, practical, and enthusiastic travel advice. Use emojis naturally. Keep responses under 220 words. Always be specific with costs, times, and logistics.`;

export const buildTripGenerationPrompt = (params: {
  destination: string;
  duration: number;
  budget: string;
  currency: string;
  style: string;
  interests: string[];
  groupType: string;
  season: string;
}): AIMessage[] => [
  {
    role: 'system',
    content: `You are a world-class travel planner. Generate realistic, detailed travel itineraries in strict JSON format only. No markdown, no code fences, just a raw JSON object.`,
  },
  {
    role: 'user',
    content: `Generate a ${params.duration}-day trip to ${params.destination}.
Trip details:
- Total budget: ${params.budget} ${params.currency}
- Travel style: ${params.style}
- Interests: ${params.interests.join(', ')}
- Group type: ${params.groupType}
- Season: ${params.season}

Return a JSON object with EXACTLY this structure:
{
  "title": "trip title string",
  "destination": "main destination name",
  "flag": "country flag emoji",
  "route": "City1 → City2 → City3",
  "highlights": ["5 must-do experiences"],
  "budget": {
    "total": ${params.budget},
    "currency": "${params.currency}",
    "items": [
      {"label": "Flights",    "value": number, "color": "#2A4D3A"},
      {"label": "Hotels",     "value": number, "color": "#F5B041"},
      {"label": "Food",       "value": number, "color": "#F97316"},
      {"label": "Transport",  "value": number, "color": "#3B82F6"},
      {"label": "Activities", "value": number, "color": "#7C3AED"},
      {"label": "Misc",       "value": number, "color": "#94A3B8"}
    ]
  },
  "days": [
    {
      "day": 1,
      "city": "city name",
      "theme": "day theme",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "activity name",
          "type": "food|hotel|culture|activity|transport|shopping",
          "emoji": "emoji",
          "cost": number,
          "tip": "insider tip"
        }
      ]
    }
  ],
  "packing": {
    "essentials": ["5 essential items"],
    "clothing": ["4 clothing items"],
    "tech": ["3 tech/app items"],
    "health": ["3 health items"]
  },
  "aiTips": ["5 insider tips with emoji prefix, specific to this destination"]
}

Rules:
- Generate all ${params.duration} days
- Budget items must sum to approximately ${params.budget}
- Use realistic local costs
- 3-5 activities per day
- Tips must be specific and actionable`,
  },
];

export const buildSuggestionsPrompt = (destinations: string[]): AIMessage[] => [
  {
    role: 'system',
    content: `You are Traveloop AI. Generate practical travel tips for the given destinations. Return a JSON array only — no markdown.`,
  },
  {
    role: 'user',
    content: `Generate 6 short, practical travel tips for someone visiting: ${destinations.join(', ')}.
Return a JSON array: ["tip1 with emoji", "tip2 with emoji", ...]
Tips must be specific to these destinations, practical, and under 15 words each.`,
  },
];