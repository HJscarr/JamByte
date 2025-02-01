import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('oidc.user:https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_h3Lu8eCZl:18506g2uv82srnppeqn6bm673d');
  
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/private/:path*',
    '/cv-mentor/:path*',
    '/lesson/:path*',
    // Add other protected routes here
  ],
}