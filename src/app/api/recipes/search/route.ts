import { NextResponse } from 'next/server';
import { searchRecipes } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Validate API key
    const apiKeyValidation = validateApiKey(request);
    if (!apiKeyValidation.valid) {
      return NextResponse.json(
        { error: apiKeyValidation.error },
        { status: 401 }
      );
    }

    // Get search parameters from URL
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || undefined;
    const author = url.searchParams.get('author') || undefined;
    const platform = url.searchParams.get('platform') || undefined;
    const style = url.searchParams.get('style') || undefined;

    // Search for recipes
    const recipes = await searchRecipes(name, author, platform, style);

    // Transform the data to include standardized properties
    const transformedRecipes = recipes.map(recipe => ({
      id: recipe.id,
      recipeId: recipe.recipe_id,
      name: recipe.name,
      normalizedName: recipe.normalized_name,
      author: recipe.author,
      normalizedAuthor: recipe.normalized_author,
      platform: recipe.platform,
      description: recipe.description,
      style: recipe.style,
      createdAt: recipe.created_at,
      updatedAt: recipe.updated_at
    }));

    return NextResponse.json(transformedRecipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
