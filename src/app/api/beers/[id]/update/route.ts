import { NextResponse } from 'next/server';
import { BeerCreateInput } from '@/types/beer';
import { updateBeer } from '@/lib/db/beer-service';

// Define the type for the route handler context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const id = parseInt(context.params.id);

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
    console.error(`Error updating beer with ID ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update beer' },
      { status: 500 }
    );
  }
}
