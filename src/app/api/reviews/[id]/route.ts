import { NextResponse } from 'next/server';
import { getReviewById } from '@/lib/db/review-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    // Await params to ensure it's fully resolved
    const params = await context.params;
    const { id } = params;

    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Transform the review to include standardized properties
    const transformedReview = {
      id: review.id,
      reviewId: review.review_id,
      api_brew_uuid: review.api_brew_uuid,
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
    };

    return NextResponse.json(transformedReview);
  } catch (error) {
    console.error(`Error fetching review with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
