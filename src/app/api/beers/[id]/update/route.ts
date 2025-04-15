import { NextResponse } from 'next/server';
import { BeerCreateInput } from '@/types/beer';
import { updateBeer } from '@/lib/db/beer-service';

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
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

    // Parse the request body
    const body = await request.json() as Partial<BeerCreateInput>;

    // Update the beer
    const updatedBeer = await updateBeer(id, body);

    if (!updatedBeer) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Beer updated successfully',
      beer: updatedBeer
    });
  } catch (error) {
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error updating beer with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update beer' },
      { status: 500 }
    );
  }
}
