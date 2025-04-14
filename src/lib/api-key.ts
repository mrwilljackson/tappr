/**
 * Get the API key from the environment variables
 * @returns The API key or null if not set
 */
export function getApiKey(): string | null {
  return process.env.TAPPR_API_KEY || null;
}

/**
 * Validate an API key against the one in the environment variables
 * @param apiKey The API key to validate
 * @returns True if the API key is valid, false otherwise
 */
export function validateApiKey(apiKey: string | null): boolean {
  const validApiKey = getApiKey();
  return !!apiKey && !!validApiKey && apiKey === validApiKey;
}
