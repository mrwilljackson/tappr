// List of valid API keys
const VALID_API_KEYS: string[] = [];

// Add the API key from environment variables if it exists
if (process.env.TAPPR_API_KEY) {
  VALID_API_KEYS.push(process.env.TAPPR_API_KEY);
}

// Add development API key if in development mode
if (process.env.NODE_ENV === 'development' && process.env.TAPPR_DEV_API_KEY) {
  VALID_API_KEYS.push(process.env.TAPPR_DEV_API_KEY);
}

/**
 * Validate an API key against the list of valid API keys
 * @param apiKey The API key to validate
 * @returns True if the API key is valid, false otherwise
 */
export function validateApiKey(apiKey: string | null): boolean {
  return !!apiKey && VALID_API_KEYS.includes(apiKey);
}
