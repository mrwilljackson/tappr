import { NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/db/review-service';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
