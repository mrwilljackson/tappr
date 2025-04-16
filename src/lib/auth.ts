/**
 * Simple API key validation for the TAPPR API
 */

// In a real-world application, this would be stored in a database or environment variable
const API_KEY = 'tappr_api_key_12345';

/**
 * Validates the API key from the request headers
 * @param request The incoming request
 * @returns An object indicating whether the API key is valid and an error message if not
 */
export function validateApiKey(request: Request): { valid: boolean; error?: string } {
  // Get the API key from the headers
  const apiKey = request.headers.get('X_API_Key');

  // Check if the API key is missing
  if (!apiKey) {
    return { valid: false, error: 'Unauthorized: Missing API key' };
  }

  // Check if the API key is valid
  if (apiKey !== API_KEY) {
    return { valid: false, error: 'Unauthorized: Invalid API key' };
  }

  // API key is valid
  return { valid: true };
}
