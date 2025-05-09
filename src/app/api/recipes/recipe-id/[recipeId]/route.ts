import { NextResponse } from 'next/server';
import { getRecipeByRecipeId } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

// Define the type for the route handler context
interface RouteContext {
  params: {
    recipeId: string;
  };
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // Validate API key
    const apiKeyValidation = validateApiKey(request);
    if (!apiKeyValidation.valid) {
      return NextResponse.json(
        { error: apiKeyValidation.error },
        { status: 401 }
      );
    }

    // Await params to ensure it's fully resolved
    const params = await context.params;
    const { recipeId } = params;

    const recipe = await getRecipeByRecipeId(recipeId);

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Transform the data to include standardized properties
    const transformedRecipe = {
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
    };

    return NextResponse.json(transformedRecipe);
  } catch (error) {
    console.error(`Error fetching recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}
