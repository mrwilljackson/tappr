import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/api-key';

export function middleware(request: NextRequest) {
  // Only run on API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API] ${request.method} ${request.nextUrl.pathname}`);

    // Skip API key check for documentation, public endpoints, and OPTIONS requests (CORS preflight)
    if (
      request.nextUrl.pathname === '/api/docs' ||
      request.nextUrl.pathname.startsWith('/api/reviews/public/') ||
      request.nextUrl.pathname.startsWith('/api/beers/public/') ||
      request.method === 'OPTIONS'
    ) {
      return NextResponse.next();
    }

    // Get the API key from the request headers
    // Try both formats to ensure backward compatibility
    const apiKey = request.headers.get('x_api_key') || request.headers.get('x-api-key');

    // Check if the API key is valid
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing API key' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
