import { NextResponse } from 'next/server';
import { RecipeCreateInput } from '@/types/recipe';
import { createRecipe, findOrCreateRecipe } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Validate API key
    const apiKeyValidation = validateApiKey(request);
    if (!apiKeyValidation.valid) {
      return NextResponse.json(
        { error: apiKeyValidation.error },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json() as RecipeCreateInput;

    // Validate the request body (basic validation)
    if (!body.name || !body.author || !body.platform) {
      return NextResponse.json(
        { error: 'Missing required fields: name, author, and platform are required' },
        { status: 400 }
      );
    }

    // Check if we should find or create
    const url = new URL(request.url);
    const findOrCreate = url.searchParams.get('findOrCreate') === 'true';

    // Save to the database
    const newRecipe = findOrCreate 
      ? await findOrCreateRecipe(body)
      : await createRecipe(body);

    if (!newRecipe) {
      return NextResponse.json(
        { error: 'Failed to add recipe' },
        { status: 500 }
      );
    }

    // Transform the data to include standardized properties
    const transformedRecipe = {
      id: newRecipe.id,
      recipeId: newRecipe.recipe_id,
      name: newRecipe.name,
      normalizedName: newRecipe.normalized_name,
      author: newRecipe.author,
      normalizedAuthor: newRecipe.normalized_author,
      platform: newRecipe.platform,
      description: newRecipe.description,
      style: newRecipe.style,
      createdAt: newRecipe.created_at,
      updatedAt: newRecipe.updated_at
    };

    return NextResponse.json({
      message: 'Recipe added successfully',
      recipe: transformedRecipe
    });
  } catch (error) {
    console.error('Error adding recipe:', error);
    return NextResponse.json(
      { error: 'Failed to add recipe' },
      { status: 500 }
    );
  }
}
