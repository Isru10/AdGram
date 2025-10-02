import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // 1. Get the session token
  // The secret is necessary to decrypt the JWT.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 2. Define the URL for the sign-in page
  const signInUrl = new URL('/auth/signin', req.url);
  // Add a `callbackUrl` so the user is redirected back to the admin page they tried to visit after signing in.
  signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);

  // 3. Authorization Logic
  // Check if the user is trying to access an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // If there's no token (user is not logged in) OR the token's role is not 'admin'
    if (!token || token.role !== 'admin') {
      // Redirect them to the sign-in page
      return NextResponse.redirect(signInUrl);
    }
  }

  // 4. If all checks pass, allow the request to continue
  return NextResponse.next();
}

// 5. Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*', // Run on all routes inside the /admin directory
  ],
};