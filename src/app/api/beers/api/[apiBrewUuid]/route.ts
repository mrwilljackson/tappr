import { NextResponse } from 'next/server';
import { getBrewByApiBrewUuid } from '@/lib/db/beer-service';
import { validateApiKey } from '@/lib/auth';

// Define the type for the route handler context
interface RouteContext {
  params: {
    apiBrewUuid: string;
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

    // Get params from context
    const { apiBrewUuid } = context.params;

    // Get brew by apiBrewUuid
    const brew = await getBrewByApiBrewUuid(apiBrewUuid);

    if (!brew) {
      return NextResponse.json(
        { error: 'Brew not found' },
        { status: 404 }
      );
    }

    // Transform the data to include camelCase properties
    const transformedBrew = {
      ...brew,
      // Add camelCase versions of snake_case properties
      brewDate: brew.brew_date,
      kegLevel: brew.keg_level,
      brewUuid: brew.brew_uuid,
      apiBrewUuid: brew.api_brew_uuid,
      createdAt: brew.created_at,
      updatedAt: brew.updated_at
    };

    return NextResponse.json(transformedBrew);
  } catch (error) {
    console.error(`Error fetching brew:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch brew' },
      { status: 500 }
    );
  }
}
