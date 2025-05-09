import supabase from '@/lib/supabase';
import { RecipeCreateInput } from '@/types/recipe';
import { createHash } from 'crypto';

// Define Recipe type based on your Supabase table
export type RecipeDB = {
  id: number;
  recipe_id: string;
  name: string;
  normalized_name: string;
  author: string;
  normalized_author: string;
  platform: string;
  description?: string;
  style?: string;
  created_at: string;
  updated_at: string;
};

// Normalize a string for consistent matching
// Removes special characters, converts to lowercase, and trims whitespace
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
    .trim();
}

// Generate a deterministic UUID from platform, author, and recipe name
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

// Get all recipes from the database
export async function getAllRecipes(): Promise<RecipeDB[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

// Get a recipe by ID
export async function getRecipeById(id: number): Promise<RecipeDB | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    return null;
  }

  return data;
}

// Get a recipe by recipe_id (deterministic UUID)
export async function getRecipeByRecipeId(recipeId: string): Promise<RecipeDB | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('recipe_id', recipeId)
    .single();

  if (error) {
    console.error(`Error fetching recipe with recipe_id ${recipeId}:`, error);
    return null;
  }

  return data;
}

// Search for recipes by name, author, platform, or style
export async function searchRecipes(
  name?: string,
  author?: string,
  platform?: string,
  style?: string
): Promise<RecipeDB[]> {
  let query = supabase.from('recipes').select('*');

  // Add filters if provided
  if (name) {
    const normalizedName = normalizeString(name);
    query = query.ilike('normalized_name', `%${normalizedName}%`);
  }
  
  if (author) {
    const normalizedAuthor = normalizeString(author);
    query = query.ilike('normalized_author', `%${normalizedAuthor}%`);
  }
  
  if (platform) {
    query = query.eq('platform', platform);
  }
  
  if (style) {
    query = query.ilike('style', `%${style}%`);
  }

  // Execute the query
  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error searching recipes:', error);
    return [];
  }

  return data || [];
}

// Find or create a recipe based on platform, author, and name
export async function findOrCreateRecipe(data: RecipeCreateInput): Promise<RecipeDB | null> {
  // Generate the deterministic recipe ID
  const recipeId = generateRecipeId(data.platform, data.author, data.name);
  
  // Check if the recipe already exists
  const existingRecipe = await getRecipeByRecipeId(recipeId);
  if (existingRecipe) {
    return existingRecipe;
  }
  
  // If not, create a new recipe
  return createRecipe(data);
}

// Create a new recipe
export async function createRecipe(data: RecipeCreateInput): Promise<RecipeDB | null> {
  // Normalize the name and author for consistent matching
  const normalizedName = normalizeString(data.name);
  const normalizedAuthor = normalizeString(data.author);
  
  // Generate a deterministic recipe ID
  const recipeId = generateRecipeId(data.platform, data.author, data.name);
  
  const newRecipe = {
    recipe_id: recipeId,
    name: data.name,
    normalized_name: normalizedName,
    author: data.author,
    normalized_author: normalizedAuthor,
    platform: data.platform,
    description: data.description,
    style: data.style,
  };

  const { data: result, error } = await supabase
    .from('recipes')
    .insert([newRecipe])
    .select()
    .single();

  if (error) {
    console.error('Error creating recipe:', error);
    return null;
  }

  return result;
}

// Update a recipe
export async function updateRecipe(id: number, data: Partial<RecipeCreateInput>): Promise<RecipeDB | null> {
  // First check if the recipe exists
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) {
    return null;
  }

  // Prepare update data with proper field names
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  // Only update fields that are provided
  if (data.name !== undefined) {
    updateData.name = data.name;
    updateData.normalized_name = normalizeString(data.name);
  }
  
  if (data.author !== undefined) {
    updateData.author = data.author;
    updateData.normalized_author = normalizeString(data.author);
  }
  
  if (data.platform !== undefined) updateData.platform = data.platform;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.style !== undefined) updateData.style = data.style;

  // If any of the key fields (platform, author, name) are updated, we need to regenerate the recipe_id
  if (data.platform !== undefined || data.author !== undefined || data.name !== undefined) {
    const platform = data.platform || existingRecipe.platform;
    const author = data.author || existingRecipe.author;
    const name = data.name || existingRecipe.name;
    
    updateData.recipe_id = generateRecipeId(platform, author, name);
  }

  const { data: result, error } = await supabase
    .from('recipes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating recipe with ID ${id}:`, error);
    return null;
  }

  return result;
}

// Delete a recipe
export async function deleteRecipe(id: number): Promise<boolean> {
  // First check if the recipe exists
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) {
    return false;
  }

  // Delete the recipe
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting recipe with ID ${id}:`, error);
    return false;
  }

  return true;
}
