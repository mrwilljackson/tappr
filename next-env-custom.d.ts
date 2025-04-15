// Add custom type definitions for Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_API_URL: string;
  }
}

// Define route handler parameter types
declare module 'next/types' {
  interface RouteHandlerContext<T = Record<string, string>> {
    params: T;
  }
}
