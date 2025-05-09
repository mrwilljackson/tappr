import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { getBrewByApiBrewUuid } from '@/lib/db/beer-service';
import { getRecipeByRecipeId } from '@/lib/db/recipe-service';
import { validateApiKey } from '@/lib/auth';

// Define the type for the route handler context
interface RouteContext {
  params: {
    apiBrewUuid: string;
  };
}

// Define the request body type
interface LinkRecipeRequest {
  recipeId: string;
}

export async function POST(
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
    const { apiBrewUuid } = params;

    // Check if the brew exists
    const brew = await getBrewByApiBrewUuid(apiBrewUuid);
    if (!brew) {
      return NextResponse.json(
        { error: 'Brew not found' },
        { status: 404 }
      );
    }

    // Parse the request body
    const body = await request.json() as LinkRecipeRequest;

    if (!body.recipeId) {
      return NextResponse.json(
        { error: 'Missing required field: recipeId' },
        { status: 400 }
      );
    }

    // Check if the recipe exists
    const recipe = await getRecipeByRecipeId(body.recipeId);
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Update the brew with the recipe ID
    const { data: updatedBrew, error } = await supabase
      .from('brews')
      .update({ recipe_id: body.recipeId, updated_at: new Date().toISOString() })
      .eq('api_brew_uuid', apiBrewUuid)
      .select()
      .single();

    if (error) {
      console.error(`Error linking brew to recipe:`, error);
      return NextResponse.json(
        { error: 'Failed to link brew to recipe' },
        { status: 500 }
      );
    }

    // Transform the data to include standardized properties
    const transformedBrew = {
      id: updatedBrew.id,
      name: updatedBrew.name,
      style: updatedBrew.style,
      abv: updatedBrew.abv,
      ibu: updatedBrew.ibu,
      description: updatedBrew.description,
      brewDate: updatedBrew.brew_date,
      kegLevel: updatedBrew.keg_level,
      brewUuid: updatedBrew.brew_uuid,
      apiBrewUuid: updatedBrew.api_brew_uuid,
      recipeId: updatedBrew.recipe_id,
      createdAt: updatedBrew.created_at,
      updatedAt: updatedBrew.updated_at
    };

    return NextResponse.json({
      message: 'Brew linked to recipe successfully',
      brew: transformedBrew
    });
  } catch (error) {
    console.error(`Error linking brew to recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to link brew to recipe' },
      { status: 500 }
    );
  }
}
