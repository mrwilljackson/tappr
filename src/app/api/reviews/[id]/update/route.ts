import { NextResponse } from 'next/server';
import { ReviewCreateInput } from '@/types/review';
import { updateReview } from '@/lib/db/review-service';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use await to ensure params is fully resolved
    const { id } = await params;

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
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error updating review with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
