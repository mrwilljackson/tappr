import { NextResponse } from 'next/server';
import { BeerCreateInput } from '@/types/beer';
import { createBeer } from '@/lib/db/beer-service';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as BeerCreateInput;

    // Validate the request body (basic validation)
    if (!body.name || !body.style || !body.abv) {
      return NextResponse.json(
        { error: 'Missing required fields: name, style, and abv are required' },
        { status: 400 }
      );
    }

    // Save to the database
    const newBeer = await createBeer(body);

    return NextResponse.json(
      { message: 'Beer added successfully', beer: newBeer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding beer:', error);
    return NextResponse.json(
      { error: 'Failed to add beer' },
      { status: 500 }
    );
  }
}
