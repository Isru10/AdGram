import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Define URLs for redirection
  const signInUrl = new URL('/auth/signin', req.url);
  const adsUrl = new URL('/ads', req.url); // New URL for logged-in users

  // Add callbackUrl for admin redirect
  signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);

  // --- NEW LOGIC: Prevent logged-in users from accessing auth pages ---
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/signin') || 
                      req.nextUrl.pathname.startsWith('/auth/signup');

  if (isAuthRoute) {
    // If the user is logged in (has a token) AND they are trying to access /auth/signin or /auth/signup
    if (token) {
      return NextResponse.redirect(adsUrl); // Redirect them to the marketplace
    }
    // If they are not logged in, allow them to proceed to the auth page
    return NextResponse.next();
  }
  // --- END OF NEW LOGIC ---

  // Existing Authorization Logic for Admin Routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(signInUrl);
    }
  }

  // If all checks pass, allow the request to continue
  return NextResponse.next();
}

// 5. Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*', // Admin routes
    '/auth/signin',  // Sign in page
    '/auth/signup',  // Sign up page
  ],
};