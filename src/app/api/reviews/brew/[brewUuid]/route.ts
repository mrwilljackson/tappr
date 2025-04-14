import { NextResponse } from 'next/server';
import { getReviewsByBrewUuid } from '@/lib/db/review-service';

export async function GET(
  request: Request,
  { params }: { params: { brewUuid: string } }
) {
  try {
    const brewUuid = params.brewUuid;
    
    const reviews = await getReviewsByBrewUuid(brewUuid);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews for brew UUID ${params.brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
