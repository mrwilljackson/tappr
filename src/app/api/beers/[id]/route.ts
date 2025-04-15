import { NextResponse } from 'next/server';
import { getBeerById } from '@/lib/db/beer-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // Await params to ensure it's fully resolved
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const beer = await getBeerById(id);

    if (!beer) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(beer);
  } catch (error) {
    console.error(`Error fetching beer with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch beer' },
      { status: 500 }
    );
  }
}
