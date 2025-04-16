import { NextResponse } from 'next/server';
import { getReviewsByApiBrewUuid } from '@/lib/db/review-service';
import { validateApiKey } from '@/lib/auth';

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

    // Get params from context
    const { apiBrewUuid } = context.params;

    // Get reviews by API brew UUID
    const reviews = await getReviewsByApiBrewUuid(apiBrewUuid);

    // Transform the reviews to include camelCase properties
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      reviewId: review.review_id,
      apiBrewUuid: review.api_brew_uuid,
      brewUuid: review.brew_uuid,
      reviewerId: review.reviewer_id,
      reviewerName: review.reviewer_name,
      isAnonymous: review.is_anonymous,
      reviewDate: review.review_date,
      reviewType: review.review_type,
      quickReview: review.quick_review,
      standardReview: review.standard_review,
      expertReview: review.expert_review,
      createdAt: review.created_at,
      updatedAt: review.updated_at
    }));

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error(`Error fetching reviews:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
