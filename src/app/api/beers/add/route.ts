import { NextResponse } from 'next/server';
import { Beer, BeerCreateInput } from '@/types/beer';

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

    // In a real app, you would save this to a database
    // For now, we'll just return the data with a fake ID
    const newBeer: Beer = {
      id: Math.floor(Math.random() * 1000) + 4, // Generate a random ID
      ...body,
      brewDate: body.brewDate || new Date().toISOString().split('T')[0],
      kegLevel: body.kegLevel || 100, // New keg is full
    };

    return NextResponse.json(
      { message: 'Beer added successfully', beer: newBeer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding beer:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
