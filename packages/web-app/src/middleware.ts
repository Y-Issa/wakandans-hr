import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes: RegExp[] = [/^\/login$/, /^\/login\/[^\/]+$/];

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('loggedIn');

  const isPublicRoute = publicRoutes.some((regex) =>
    regex.test(req.nextUrl.pathname),
  );

  if (isPublicRoute) {
    // If token exists and the user is trying to access login page, redirect to home
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // If token does not exist and the user is trying to access a protected page, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow access to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Exclude static paths and images
  ],
};
