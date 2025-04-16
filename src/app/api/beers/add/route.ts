import { NextResponse } from 'next/server';
import { BrewCreateInput } from '@/types/beer';
import { createBrew } from '@/lib/db/beer-service';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as BrewCreateInput;

    // Validate the request body (basic validation)
    if (!body.name || !body.style || !body.abv) {
      return NextResponse.json(
        { error: 'Missing required fields: name, style, and abv are required' },
        { status: 400 }
      );
    }

    // Save to the database
    const newBrew = await createBrew(body);

    if (!newBrew) {
      return NextResponse.json(
        { error: 'Failed to add brew' },
        { status: 500 }
      );
    }

    // Transform the response to include both camelCase and snake_case properties
    const response = {
      message: 'Brew added successfully',
      brew: {
        ...newBrew,
        // Add camelCase versions of snake_case properties
        brewDate: newBrew.brew_date,
        kegLevel: newBrew.keg_level,
        brewUuid: newBrew.brew_uuid,
        apiBrewUuid: newBrew.api_brew_uuid,
        createdAt: newBrew.created_at,
        updatedAt: newBrew.updated_at
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error adding brew:', error);
    return NextResponse.json(
      { error: 'Failed to add brew' },
      { status: 500 }
    );
  }
}
