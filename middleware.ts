import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/dashboard',
  '/profile',
  '/orders',
  '/settings',
  '/wishlist',
];

// Define admin-only routes
const adminRoutes = ['/admin'];

// Define public routes that should redirect to account if authenticated
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Define routes that should always be accessible
const alwaysAccessibleRoutes = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/unauthorized',
  '/_next',
  '/api',
  '/favicon.ico',
];

/**
 * Check if a pathname matches any of the given route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
}

/**
 * Validate JWT token format and expiry
 */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Add 30s leeway to account for time skew
    return payload.exp > now + 30;
  } catch {
    return false;
  }
}

/**
 * Extract redirect URL from request parameters
 */
function getRedirectUrl(request: NextRequest): string {
  const { searchParams } = request.nextUrl;
  return searchParams.get('redirect') || '/account';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for always accessible routes
  if (matchesRoute(pathname, alwaysAccessibleRoutes)) {
    return NextResponse.next();
  }

  // Get access token from localStorage via cookie (set by client-side)
  const accessToken = request.cookies.get('access_token')?.value;

  // Check route types
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isAdminRoute = matchesRoute(pathname, adminRoutes);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);

  // Handle protected routes
  if (isProtectedRoute) {
    if (!accessToken || !isTokenValid(accessToken)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!accessToken || !isTokenValid(accessToken)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Note: Role-based access control for admin routes is handled client-side
    // since we can't easily decode JWT tokens in middleware without the public key
  }

  // Handle public routes - redirect authenticated users to account
  if (isPublicRoute && accessToken && isTokenValid(accessToken)) {
    const redirectUrl = getRedirectUrl(request);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
