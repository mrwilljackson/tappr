import { NextResponse } from 'next/server';
import { deleteBeer } from '@/lib/db/beer-service';

export async function DELETE(
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

    // Delete the beer
    const success = await deleteBeer(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Beer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Beer deleted successfully'
    });
  } catch (error) {
    // Use a try-catch block to safely access params.id
    let id;
    try {
      id = params.id;
    } catch (e) {
      id = 'unknown';
    }

    console.error(`Error deleting beer with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete beer' },
      { status: 500 }
    );
  }
}
