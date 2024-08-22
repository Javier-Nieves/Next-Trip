import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  if (req.nextUrl.pathname.includes('/account')) {
    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // If the token does not exist, redirect to the sign-in page
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    // If the token exists, proceed with the request
    return NextResponse.next();
  } else return NextResponse.next();
}
// paths in which the middleware applies
export const config = {
  matcher: ['/account'],
};
