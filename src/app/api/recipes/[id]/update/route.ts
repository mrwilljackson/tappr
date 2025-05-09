import { NextResponse } from 'next/server';
import { RecipeCreateInput } from '@/types/recipe';
import { updateRecipe } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(
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

    const id = parseInt(context.params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json() as Partial<RecipeCreateInput>;

    // Update the recipe
    const updatedRecipe = await updateRecipe(id, body);

    if (!updatedRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Transform the data to include standardized properties
    const transformedRecipe = {
      id: updatedRecipe.id,
      recipeId: updatedRecipe.recipe_id,
      name: updatedRecipe.name,
      normalizedName: updatedRecipe.normalized_name,
      author: updatedRecipe.author,
      normalizedAuthor: updatedRecipe.normalized_author,
      platform: updatedRecipe.platform,
      description: updatedRecipe.description,
      style: updatedRecipe.style,
      createdAt: updatedRecipe.created_at,
      updatedAt: updatedRecipe.updated_at
    };

    return NextResponse.json({
      message: 'Recipe updated successfully',
      recipe: transformedRecipe
    });
  } catch (error) {
    console.error(`Error updating recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}
