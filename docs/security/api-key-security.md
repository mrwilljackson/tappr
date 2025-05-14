# API Key Security Best Practices

**Last Updated: 30-05-2024**

This document outlines the security best practices for handling API keys in the TAPPr application.

## Security Concerns with API Keys

API keys should be treated as sensitive credentials and should never be exposed in client-side code. Exposing API keys in client-side JavaScript makes them visible to anyone who inspects your application's source code, which can lead to unauthorized API access.

## Secure Pattern: Server-Side Proxy

To securely access API endpoints from client-side code without exposing API keys, we use a server-side proxy pattern:

1. Client-side code makes requests to a server-side proxy endpoint
2. The server-side proxy endpoint adds the API key to the request
3. The server-side proxy forwards the request to the actual API endpoint
4. The server-side proxy returns the response to the client

This pattern ensures that API keys are only used on the server side and never exposed to clients.

### Implementation Example

#### 1. Server-Side Proxy Endpoint

```typescript
// src/app/api/proxy/beers/route.ts
import { NextResponse } from 'next/server';

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
        'X-API-Key': apiKey
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
```

#### 2. Client-Side Component

```typescript
// src/app/review-test/page.tsx (excerpt)
'use client';

import React, { useState, useEffect } from 'react';

export default function ReviewTestPage() {
  const [beers, setBeers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBeers() {
      try {
        setIsLoading(true);
        
        // Use our proxy endpoint which handles the API key on the server side
        const response = await fetch('/api/proxy/beers');

        if (!response.ok) {
          throw new Error('Failed to fetch beers');
        }

        const data = await response.json();
        setBeers(data);
      } catch (err) {
        console.error('Error fetching beers:', err);
        setError(err.message || 'Failed to load beers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBeers();
  }, []);

  // Component rendering code...
}
```

## Environment Variables

The following environment variables are used for API authentication:

- `TAPPR_API_KEY`: The API key used for server-side authentication (never exposed to clients)
- `NEXT_PUBLIC_API_URL`: (Optional) The base URL for API requests (can be exposed to clients)

Example `.env.local` file:

```
# API key for authentication (server-side only)
TAPPR_API_KEY=your_api_key_here

# API URL for client-side requests (optional)
NEXT_PUBLIC_API_URL=
```

## Security Recommendations

1. **Never hardcode API keys** in client-side code or commit them to version control
2. **Use environment variables** for storing API keys
3. **Create proxy endpoints** for client-side access to authenticated APIs
4. **Implement proper error handling** to avoid leaking sensitive information
5. **Use HTTPS** for all API requests to prevent man-in-the-middle attacks
6. **Implement rate limiting** to prevent abuse of your API
7. **Rotate API keys** periodically and after suspected compromises

## Related Documentation

- [API Overview](../api/README.md)
- [Environment Variables](../deployment/environment-variables.md)
- [Deployment Guide](../deployment/vercel.md)
