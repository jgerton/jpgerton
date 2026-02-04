import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/admin"];

// Public routes accessible without authentication
const publicRoutes = [
  "/",
  "/login",
  "/projects",
  "/services",
  "/contact",
  "/about",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected (starts with /admin)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for auth session cookie
  // Convex Auth stores the session in a cookie named "__convexAuthToken"
  const authToken = request.cookies.get("__convexAuthToken");
  const hasValidSession = !!authToken;

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user visits login page, redirect to admin
  if (pathname === "/login" && hasValidSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Allow all other requests to proceed
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
