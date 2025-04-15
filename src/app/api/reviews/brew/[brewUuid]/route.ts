import { NextResponse } from 'next/server';
import { getReviewsByBrewUuid } from '@/lib/db/review-service';

export async function GET(
  request: Request,
  context: { params: { brewUuid: string } }
) {
  const { params } = context;
  try {
    // Use await to ensure params is fully resolved
    const { brewUuid } = await params;

    const reviews = await getReviewsByBrewUuid(brewUuid);

    return NextResponse.json(reviews);
  } catch (error) {
    // Use a try-catch block to safely access params.brewUuid
    let brewUuid;
    try {
      brewUuid = params.brewUuid;
    } catch (e) {
      brewUuid = 'unknown';
    }

    console.error(`Error fetching reviews for brew UUID ${brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
