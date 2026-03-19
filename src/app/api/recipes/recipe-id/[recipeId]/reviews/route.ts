import { NextResponse } from 'next/server';
import sql from '@/lib/neon';
import { validateApiKey } from '@/lib/auth';
import { BrewDB } from '@/lib/db/beer-service';
import { Review } from '@/lib/db/review-service';

interface RouteContext {
  params: {
    recipeId: string;
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
    const { recipeId } = params;

    // First, get all brews associated with the recipe
    const brews = await sql`SELECT * FROM brews WHERE recipe_id = ${recipeId}`;

    if (!brews || brews.length === 0) {
      return NextResponse.json([]);
    }

    // Get the API brew UUIDs for all brews
    const apiBrewUuids = (brews as BrewDB[]).map((brew) => brew.api_brew_uuid);

    // Get all reviews for these brews
    const reviews = await sql`SELECT * FROM reviews WHERE api_brew_uuid = ANY(${apiBrewUuids})`;

    // Transform the reviews to include brew information
    const transformedReviews = (reviews as Review[]).map((review) => {
      const brew = (brews as BrewDB[]).find((b) => b.api_brew_uuid === review.api_brew_uuid);
      return {
        reviewId: review.id,
        reviewerName: review.reviewer_name,
        isAnonymous: review.is_anonymous,
        reviewType: review.review_type,
        quickReview: review.quick_review,
        standardReview: review.standard_review,
        expertReview: review.expert_review,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        brewInfo: {
          id: brew.id,
          name: brew.name,
          style: brew.style,
          apiBrewUuid: brew.api_brew_uuid,
          brewUuid: brew.brew_uuid
        }
      };
    });

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error(`Error fetching reviews for recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews for recipe' },
      { status: 500 }
    );
  }
}
