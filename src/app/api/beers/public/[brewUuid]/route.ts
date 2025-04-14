import { NextResponse } from 'next/server';
import { getBeerByBrewUuid } from '@/lib/db/beer-service';

export async function GET(
  request: Request,
  { params }: { params: { brewUuid: string } }
) {
  try {
    // Use await to ensure params is fully resolved
    const { brewUuid } = await params;

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
    // Use a try-catch block to safely access params.brewUuid
    let brewUuid;
    try {
      brewUuid = params.brewUuid;
    } catch (e) {
      brewUuid = 'unknown';
    }

    console.error(`Error fetching beer with UUID ${brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch beer' },
      { status: 500 }
    );
  }
}
