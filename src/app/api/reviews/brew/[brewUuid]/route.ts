import { NextResponse } from 'next/server';
import { getReviewsByBrewUuid } from '@/lib/db/review-service';

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

    const reviews = await getReviewsByBrewUuid(brewUuid);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews for brew UUID ${context.params.brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
