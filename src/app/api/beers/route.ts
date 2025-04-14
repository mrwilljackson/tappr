import { NextResponse } from 'next/server';
import { getAllBeers } from '@/lib/db/beer-service';

export async function GET() {
  try {
    const beers = await getAllBeers();
    return NextResponse.json(beers);
  } catch (error) {
    console.error('Error fetching beers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beers' },
      { status: 500 }
    );
  }
}
