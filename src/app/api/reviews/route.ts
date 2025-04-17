import { NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/db/review-service';

export async function GET() {
  try {
    const reviews = await getAllReviews();

    // Transform the reviews to include standardized properties
    const transformedReviews = reviews.map(review => ({
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
    }));

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
