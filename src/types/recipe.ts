// Recipe types for the TAPPR API

// Recipe interface
export interface Recipe {
  id: number;
  recipe_id: string;         // Deterministic UUID generated from platform, author, and name
  name: string;              // Original recipe name
  normalized_name: string;   // Normalized name for matching (lowercase, no special chars)
  author: string;            // Recipe author
  normalized_author: string; // Normalized author name for matching
  platform: string;          // Source platform (e.g., "grainfather", "brewfather")
  description?: string;      // Optional description
  style?: string;            // Beer style
  created_at?: string;       // Creation timestamp
  updated_at?: string;       // Update timestamp
  
  // Camel case versions for API
  recipeId?: string;
  normalizedName?: string;
  normalizedAuthor?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Input for creating a new recipe
export interface RecipeCreateInput {
  name: string;              // Original recipe name
  author: string;            // Recipe author
  platform: string;          // Source platform
  description?: string;      // Optional description
  style?: string;            // Beer style
}

// Input for searching recipes
export interface RecipeSearchInput {
  name?: string;             // Recipe name to search for
  author?: string;           // Author name to search for
  platform?: string;         // Platform to filter by
  style?: string;            // Style to filter by
}
