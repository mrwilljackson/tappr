import { NextResponse } from 'next/server';
import { getBrewById } from '@/lib/db/beer-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // Await params to ensure it's fully resolved
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const brew = await getBrewById(id);

    if (!brew) {
      return NextResponse.json(
        { error: 'Brew not found' },
        { status: 404 }
      );
    }

    // Transform the data to include standardized properties
    const transformedBrew = {
      id: brew.id,
      name: brew.name,
      style: brew.style,
      abv: brew.abv,
      ibu: brew.ibu,
      description: brew.description,
      brewDate: brew.brew_date,
      kegLevel: brew.keg_level,
      brewUuid: brew.brew_uuid,
      api_brew_uuid: brew.api_brew_uuid,
      createdAt: brew.created_at,
      updatedAt: brew.updated_at
    };

    return NextResponse.json(transformedBrew);
  } catch (error) {
    console.error(`Error fetching brew with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch brew' },
      { status: 500 }
    );
  }
}
