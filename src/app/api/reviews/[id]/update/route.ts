import { NextResponse } from 'next/server';
import { ReviewCreateInput } from '@/types/review';
import { updateReview } from '@/lib/db/review-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    // Parse the request body
    const body = await request.json() as Partial<ReviewCreateInput>;

    // Update the review
    const updatedReview = await updateReview(id, body);

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error(`Error updating review with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
