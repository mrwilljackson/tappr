import { NextResponse } from 'next/server';
import { getAllBeers } from '@/lib/db/beer-service';

export async function GET() {
  try {
    const beers = await getAllBeers();

    // Transform the data to include camelCase properties
    const transformedBeers = beers.map(beer => ({
      ...beer,
      // Add camelCase versions of snake_case properties
      brewDate: beer.brew_date,
      kegLevel: beer.keg_level,
      brewUuid: beer.brew_uuid,
    }));

    return NextResponse.json(transformedBeers);
  } catch (error) {
    console.error('Error fetching beers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beers' },
      { status: 500 }
    );
  }
}
