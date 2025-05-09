import { NextResponse } from 'next/server';
import { ReviewCreateInput } from '@/types/review';
import { createReview } from '@/lib/db/review-service';
import { getBrewByApiBrewUuid } from '@/lib/db/beer-service';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as ReviewCreateInput;

    // Validate the request body (basic validation)
    if (!body.api_brew_uuid || !body.reviewType || !body.quickReview) {
      return NextResponse.json(
        { error: 'Missing required fields: api_brew_uuid, reviewType, and quickReview are required' },
        { status: 400 }
      );
    }

    // For public endpoints, we use api_brew_uuid as the primary reference

    // Validate quick review
    if (!body.quickReview.overallRating) {
      return NextResponse.json(
        { error: 'Quick review must include overallRating' },
        { status: 400 }
      );
    }

    // Comments are now optional, so we don't validate them

    // Validate review type and corresponding data
    if (body.reviewType === 'standard' && !body.standardReview) {
      return NextResponse.json(
        { error: 'Standard review type requires standardReview data' },
        { status: 400 }
      );
    }

    if (body.reviewType === 'expert' && !body.expertReview) {
      return NextResponse.json(
        { error: 'Expert review type requires expertReview data' },
        { status: 400 }
      );
    }

    // For expert reviews, we also need standardReview
    if (body.reviewType === 'expert' && !body.standardReview) {
      return NextResponse.json(
        { error: 'Expert review type also requires standardReview data' },
        { status: 400 }
      );
    }

    // Verify that the brew exists using the api_brew_uuid
    const brew = await getBrewByApiBrewUuid(body.api_brew_uuid);

    if (!brew) {
      return NextResponse.json(
        { error: 'Brew not found' },
        { status: 404 }
      );
    }

    // Prepare the review data with standardized field names
    const reviewData = {
      ...body,
      apiBrewUuid: body.api_brew_uuid, // For backward compatibility with the review service
      brewUuid: brew.brew_uuid // Include the companion app UUID for reference
    };

    // Save to the database
    const newReview = await createReview(reviewData);

    if (!newReview) {
      return NextResponse.json(
        { error: 'Failed to add review' },
        { status: 500 }
      );
    }

    // Transform the response to include standardized properties
    const transformedReview = {
      id: newReview.id,
      reviewId: newReview.review_id,
      api_brew_uuid: newReview.api_brew_uuid,
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
