// Type definitions for route handlers
export interface RouteHandlerContext<T = Record<string, string>> {
  params: T;
}
