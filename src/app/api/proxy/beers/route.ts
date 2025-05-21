import { NextResponse } from 'next/server';

/**
 * This endpoint acts as a proxy for the beers API.
 * It uses the server-side TAPPR_API_KEY environment variable
 * to make authenticated requests to the beers API.
 */
export async function GET() {
  try {
    // Use the server-side environment variable
    const apiKey = process.env.TAPPR_API_KEY;

    if (!apiKey) {
      console.error('TAPPR_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Make the request to the beers API using the server-side API key
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/beers`, {
      headers: {
        'X_API_Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch beers: ${response.statusText}`);
    }

    // Get the data from the response
    const data = await response.json();

    // Return the data to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in proxy endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beers' },
      { status: 500 }
    );
  }
}
