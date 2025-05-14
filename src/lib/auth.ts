/**
 * Simple API key validation for the TAPPR API
 */

// Get the API key from environment variables
const API_KEY = process.env.TAPPR_API_KEY || '';

// Add development API key if in development mode
const DEV_API_KEY = process.env.NODE_ENV === 'development' ? (process.env.TAPPR_DEV_API_KEY || '') : '';

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

  // Check if the API key is valid (either production or development key)
  if (apiKey !== API_KEY && (DEV_API_KEY === '' || apiKey !== DEV_API_KEY)) {
    return { valid: false, error: 'Unauthorized: Invalid API key' };
  }

  // API key is valid
  return { valid: true };
}
