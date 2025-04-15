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
    const { brewUuid } = context.params;

    // Get beer by brewUuid
    const beer = await getBeerByBrewUuid(brewUuid);

    if (!beer) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(beer);
  } catch (error) {
    console.error(`Error fetching beer with UUID ${context.params.brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch beer' },
      { status: 500 }
    );
  }
}
