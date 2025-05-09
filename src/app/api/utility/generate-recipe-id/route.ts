import { NextResponse } from 'next/server';
import { generateRecipeId } from '@/lib/db/recipe-service';

// Define the request body type
interface GenerateRecipeIdRequest {
  platform: string;
  author: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as GenerateRecipeIdRequest;

    // Validate the request body
    if (!body.platform || !body.author || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, author, and name are required' },
        { status: 400 }
      );
    }

    // Generate the recipe ID
    const recipeId = generateRecipeId(body.platform, body.author, body.name);

    return NextResponse.json({
      recipeId: recipeId,
      inputs: {
        platform: body.platform,
        author: body.author,
        name: body.name
      }
    });
  } catch (error) {
    console.error('Error generating recipe ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe ID' },
      { status: 500 }
    );
  }
}
