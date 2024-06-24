// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the token does not exist, redirect to the sign-in page
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/api/auth/signin';
    return NextResponse.redirect(url);
  }

  // If the token exists, proceed with the request
  return NextResponse.next();
}

// Specify the paths that the middleware should apply to
export const config = {
  matcher: ['/account'],
};
