import sql from '@/lib/neon';
import { RecipeCreateInput } from '@/types/recipe';
import { createHash } from 'crypto';

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

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateRecipeId(platform: string, author: string, name: string): string {
  const normalizedPlatform = normalizeString(platform);
  const normalizedAuthor   = normalizeString(author);
  const normalizedName     = normalizeString(name);
  const stringToHash = `${normalizedPlatform}:${normalizedAuthor}:${normalizedName}`;
  const hash = createHash('sha256').update(stringToHash).digest('hex').substring(0, 32);
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
}

export async function getAllRecipes(): Promise<RecipeDB[]> {
  try {
    const result = await sql`SELECT * FROM recipes ORDER BY name`;
    return result as RecipeDB[];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function getRecipeById(id: number): Promise<RecipeDB | null> {
  try {
    const result = await sql`SELECT * FROM recipes WHERE id = ${id}`;
    return (result[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    return null;
  }
}

export async function getRecipeByRecipeId(recipeId: string): Promise<RecipeDB | null> {
  try {
    const result = await sql`SELECT * FROM recipes WHERE recipe_id = ${recipeId}`;
    return (result[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error fetching recipe with recipe_id ${recipeId}:`, error);
    return null;
  }
}

export async function searchRecipes(
  name?: string,
  author?: string,
  platform?: string,
  style?: string
): Promise<RecipeDB[]> {
  const namePat   = name   ? '%' + normalizeString(name)   + '%' : null;
  const authorPat = author ? '%' + normalizeString(author) + '%' : null;
  const stylePat  = style  ? '%' + style + '%'                   : null;
  const platformVal = platform ?? null;

  try {
    const result = await sql`
      SELECT * FROM recipes
      WHERE (${namePat}    IS NULL OR normalized_name   ILIKE ${namePat})
        AND (${authorPat}  IS NULL OR normalized_author ILIKE ${authorPat})
        AND (${platformVal} IS NULL OR platform = ${platformVal})
        AND (${stylePat}   IS NULL OR style ILIKE ${stylePat})
      ORDER BY name
    `;
    return result as RecipeDB[];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export async function findOrCreateRecipe(data: RecipeCreateInput): Promise<RecipeDB | null> {
  const recipeId = generateRecipeId(data.platform, data.author, data.name);
  const existing = await getRecipeByRecipeId(recipeId);
  if (existing) return existing;
  return createRecipe(data);
}

export async function createRecipe(data: RecipeCreateInput): Promise<RecipeDB | null> {
  const normalizedName   = normalizeString(data.name);
  const normalizedAuthor = normalizeString(data.author);
  const recipeId         = generateRecipeId(data.platform, data.author, data.name);
  const description      = data.description ?? null;
  const style            = data.style       ?? null;

  try {
    const result = await sql`
      INSERT INTO recipes (recipe_id, name, normalized_name, author, normalized_author, platform, description, style)
      VALUES (${recipeId}, ${data.name}, ${normalizedName}, ${data.author}, ${normalizedAuthor},
              ${data.platform}, ${description}, ${style})
      RETURNING *
    `;
    return (result[0] as RecipeDB) || null;
  } catch (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
}

export async function updateRecipe(id: number, data: Partial<RecipeCreateInput>): Promise<RecipeDB | null> {
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) return null;

  const name     = data.name     ?? existingRecipe.name;
  const author   = data.author   ?? existingRecipe.author;
  const platform = data.platform ?? existingRecipe.platform;

  const normalizedName   = normalizeString(name);
  const normalizedAuthor = normalizeString(author);
  const recipeId         = generateRecipeId(platform, author, name);
  const description      = data.description ?? existingRecipe.description ?? null;
  const style            = data.style       ?? existingRecipe.style       ?? null;

  try {
    const result = await sql`
      UPDATE recipes
      SET recipe_id = ${recipeId}, name = ${name}, normalized_name = ${normalizedName},
          author = ${author}, normalized_author = ${normalizedAuthor},
          platform = ${platform}, description = ${description}, style = ${style},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (result[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error updating recipe with ID ${id}:`, error);
    return null;
  }
}

export async function deleteRecipe(id: number): Promise<boolean> {
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) return false;

  try {
    await sql`DELETE FROM recipes WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error(`Error deleting recipe with ID ${id}:`, error);
    return false;
  }
}
