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
    const { id } = context.params;

    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error(`Error fetching review with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
