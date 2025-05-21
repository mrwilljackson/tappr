import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/api-key'; // This is the correct import

export function middleware(request: NextRequest) {
  // Only run on API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API] ${request.method} ${request.nextUrl.pathname}`);

    // Skip API key check for documentation, public endpoints, waitlist, and OPTIONS requests (CORS preflight)
    if (
      request.nextUrl.pathname === '/api/docs' ||
      request.nextUrl.pathname.startsWith('/api/reviews/public/') ||
      request.nextUrl.pathname.startsWith('/api/beers/public/') ||
      request.nextUrl.pathname === '/api/waitlist' ||
      request.method === 'OPTIONS'
    ) {
      return NextResponse.next();
    }

    // Get the API key from the request headers
    // Try all formats to ensure backward compatibility
    // Include both uppercase and lowercase variants with both underscore and hyphen
    const apiKey = request.headers.get('X_API_Key') ||
                  request.headers.get('x_api_key') ||
                  request.headers.get('X-API-Key') ||
                  request.headers.get('x-api-key');

    // Debug logging
    console.log(`[API] Received API key: ${apiKey}`);
    console.log(`[API] Valid API keys: ${process.env.TAPPR_API_KEY}, ${process.env.TAPPR_DEV_API_KEY}`);

    // Check if the API key is valid
    const isValid = validateApiKey(apiKey);
    console.log(`[API] API key validation result: ${isValid}`);

    if (!isValid) {
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
