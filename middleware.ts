import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route handling.
 *
 * Note: Convex Auth stores tokens in localStorage (client-side), not cookies.
 * Actual auth protection happens in the admin layout component using useConvexAuth().
 * This middleware just handles basic routing.
 */
export default function middleware(_request: NextRequest) {
  // Let all requests through - auth is handled client-side by Convex Auth
  return NextResponse.next();
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image files (png, jpg, svg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
