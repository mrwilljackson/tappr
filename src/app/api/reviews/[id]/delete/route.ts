import { NextResponse } from 'next/server';
import { deleteReview } from '@/lib/db/review-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = context.params;

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
    console.error(`Error deleting review with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
