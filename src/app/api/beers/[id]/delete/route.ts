import { NextResponse } from 'next/server';
import { deleteBeer } from '@/lib/db/beer-service';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
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
    console.error(`Error deleting beer with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete beer' },
      { status: 500 }
    );
  }
}
