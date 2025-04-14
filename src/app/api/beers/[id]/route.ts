import { NextResponse } from 'next/server';
import { getBeerById } from '@/lib/db/beer-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use await to ensure params is fully resolved
    const { id: idStr } = await params;
    const id = parseInt(idStr);

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
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error fetching beer with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch beer' },
      { status: 500 }
    );
  }
}
