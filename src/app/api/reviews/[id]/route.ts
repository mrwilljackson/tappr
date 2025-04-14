import { NextResponse } from 'next/server';
import { getReviewById } from '@/lib/db/review-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use await to ensure params is fully resolved
    const { id } = await params;

    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error fetching review with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
