import { createHash } from 'crypto';

/**
 * Normalize a string for consistent matching
 * Removes special characters, converts to lowercase, and trims whitespace
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
    .trim();
}

/**
 * Generate a deterministic UUID from platform, author, and recipe name
 * This function should match the one in recipe-service.ts
 */
export function generateRecipeId(platform: string, author: string, name: string): string {
  // Normalize inputs for consistency
  const normalizedPlatform = normalizeString(platform);
  const normalizedAuthor = normalizeString(author);
  const normalizedName = normalizeString(name);
  
  // Create a string to hash in the format "platform:author:name"
  const stringToHash = `${normalizedPlatform}:${normalizedAuthor}:${normalizedName}`;
  
  // Generate a SHA-256 hash and take the first 32 characters
  const hash = createHash('sha256').update(stringToHash).digest('hex').substring(0, 32);
  
  // Format as a UUID (8-4-4-4-12)
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
}
