import { NextResponse } from 'next/server';
import { getAverageReviewScore } from '@/lib/db/review-service';
import { validateApiKey } from '@/lib/auth';
import { getBrewByApiBrewUuid } from '@/lib/db/beer-service';

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

    // Await params to ensure it's fully resolved
    const params = await context.params;
    const { apiBrewUuid } = params;

    // Verify that the brew exists
    const brew = await getBrewByApiBrewUuid(apiBrewUuid);
    if (!brew) {
      return NextResponse.json(
        { error: 'Brew not found' },
        { status: 404 }
      );
    }

    // Get average review score
    const averageScore = await getAverageReviewScore(apiBrewUuid);

    if (!averageScore) {
      return NextResponse.json(
        { error: 'No reviews found for this brew' },
        { status: 404 }
      );
    }

    // Return the average score
    return NextResponse.json({
      api_brew_uuid: apiBrewUuid,
      averageScore: averageScore.averageScore,
      reviewCount: averageScore.reviewCount
    });
  } catch (error) {
    console.error(`Error fetching average review score:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch average review score' },
      { status: 500 }
    );
  }
}
