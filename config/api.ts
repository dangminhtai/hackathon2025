// API configuration
export const API_CONFIG = {
  // Environment variable keys
  ENV_KEYS: {
    GEMINI_API_KEY: "VITE_GEMINI_API_KEY",
    GEMINI_API_KEY_FALLBACK: "GEMINI_API_KEY",
  },
  
  // Default values
  DEFAULTS: {
    MODEL: "gemini-2.0-flash",
  },
} as const;

// Helper function to get API key
export const getApiKey = (): string | undefined => {
  const primaryKey = import.meta.env[API_CONFIG.ENV_KEYS.GEMINI_API_KEY];
  const fallbackKey = import.meta.env[API_CONFIG.ENV_KEYS.GEMINI_API_KEY_FALLBACK];
  return primaryKey || fallbackKey;
};

