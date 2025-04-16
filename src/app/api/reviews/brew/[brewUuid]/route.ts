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
    console.error(`Error fetching reviews for brew UUID ${context.params.brewUuid}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
