import { NextResponse } from 'next/server';
import { getAllBrews } from '@/lib/db/beer-service';

export async function GET() {
  try {
    const brews = await getAllBrews();

    // Transform the data to include standardized properties
    const transformedBrews = brews.map(brew => ({
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
    }));

    return NextResponse.json(transformedBrews);
  } catch (error) {
    console.error('Error fetching brews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brews' },
      { status: 500 }
    );
  }
}
