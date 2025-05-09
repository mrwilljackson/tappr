import { NextResponse } from 'next/server';
import { deleteRecipe } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(
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

    // Delete the recipe
    const success = await deleteRecipe(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
