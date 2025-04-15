import { NextResponse } from 'next/server';
import { getBeerByBrewUuid } from '@/lib/db/beer-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    brewUuid: string;
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    // Await params to ensure it's fully resolved
    const params = await context.params;
    const { brewUuid } = params;

    // Get beer by brewUuid
    const beer = await getBeerByBrewUuid(brewUuid);

    if (!beer) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    // Transform the data to include camelCase properties
    const transformedBeer = {
      ...beer,
      // Add camelCase versions of snake_case properties
      brewDate: beer.brew_date,
      kegLevel: beer.keg_level,
      brewUuid: beer.brew_uuid,
    };

    return NextResponse.json(transformedBeer);
  } catch (error) {
    console.error(`Error fetching beer:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch beer' },
      { status: 500 }
    );
  }
}
