import { NextResponse } from 'next/server';
import { ReviewCreateInput } from '@/types/review';
import { createReview } from '@/lib/db/review-service';
import { getBeerByBrewUuid } from '@/lib/db/beer-service';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as ReviewCreateInput;

    // Validate the request body (basic validation)
    if (!body.brewUuid || !body.reviewType || !body.quickReview) {
      return NextResponse.json(
        { error: 'Missing required fields: brewUuid, reviewType, and quickReview are required' },
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

    // Verify that the beer exists
    const beer = await getBeerByBrewUuid(body.brewUuid);
    if (!beer) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    // Save to the database
    const newReview = await createReview(body);

    return NextResponse.json(
      { message: 'Review added successfully', review: newReview },
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
