import { NextResponse } from 'next/server';
import { deleteReview } from '@/lib/db/review-service';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    // Use await to ensure params is fully resolved
    const { id } = await params;

    // Delete the review
    const success = await deleteReview(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error deleting review with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
