import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
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

    // Get brews by recipe ID
    const { data, error } = await supabase
      .from('brews')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching brews for recipe ${recipeId}:`, error);
      return NextResponse.json(
        { error: 'Failed to fetch brews' },
        { status: 500 }
      );
    }

    // Transform the data to include standardized properties
    const transformedBrews = data.map(brew => ({
      id: brew.id,
      name: brew.name,
      style: brew.style,
      abv: brew.abv,
      ibu: brew.ibu,
      description: brew.description,
      brewDate: brew.brew_date,
      kegLevel: brew.keg_level,
      brewUuid: brew.brew_uuid,
      apiBrewUuid: brew.api_brew_uuid,
      recipeId: brew.recipe_id,
      createdAt: brew.created_at,
      updatedAt: brew.updated_at
    }));

    return NextResponse.json(transformedBrews);
  } catch (error) {
    console.error(`Error fetching brews for recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch brews' },
      { status: 500 }
    );
  }
}
