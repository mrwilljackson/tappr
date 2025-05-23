import { NextResponse } from 'next/server';
import { ReviewCreateInput } from '@/types/review';
import { createReview } from '@/lib/db/review-service';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as ReviewCreateInput;

    // Validate the request body (basic validation)
    if (!body.apiBrewUuid || !body.reviewType || !body.quickReview) {
      return NextResponse.json(
        { error: 'Missing required fields: apiBrewUuid, reviewType, and quickReview are required' },
        { status: 400 }
      );
    }

    // Validate quick review
    if (!body.quickReview.overallRating || !body.quickReview.comments) {
      return NextResponse.json(
        { error: 'Quick review must include overallRating and comments' },
        { status: 400 }
      );
    }

    // Validate review type and corresponding data
    if (body.reviewType === 'standard' && !body.standardReview) {
      return NextResponse.json(
        { error: 'Standard review type requires standardReview data' },
        { status: 400 }
      );
    }

    if (body.reviewType === 'expert' && (!body.standardReview || !body.expertReview)) {
      return NextResponse.json(
        { error: 'Expert review type requires both standardReview and expertReview data' },
        { status: 400 }
      );
    }

    // Save to the database
    const newReview = await createReview(body);

    if (!newReview) {
      return NextResponse.json(
        { error: 'Failed to add review' },
        { status: 500 }
      );
    }

    // Transform the response to include camelCase properties
    const transformedReview = {
      id: newReview.id,
      reviewId: newReview.review_id,
      apiBrewUuid: newReview.api_brew_uuid,
      brewUuid: newReview.brew_uuid,
      reviewerId: newReview.reviewer_id,
      reviewerName: newReview.reviewer_name,
      isAnonymous: newReview.is_anonymous,
      reviewDate: newReview.review_date,
      reviewType: newReview.review_type,
      quickReview: newReview.quick_review,
      standardReview: newReview.standard_review,
      expertReview: newReview.expert_review,
      createdAt: newReview.created_at,
      updatedAt: newReview.updated_at
    };

    return NextResponse.json(
      { message: 'Review added successfully', review: transformedReview },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
