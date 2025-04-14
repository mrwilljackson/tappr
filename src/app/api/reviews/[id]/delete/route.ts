import { NextResponse } from 'next/server';
import { deleteReview } from '@/lib/db/review-service';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    
    // Delete the review
    const success = await deleteReview(reviewId);
    
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
    console.error(`Error deleting review with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
