import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // if (req.nextUrl.pathname.includes('/trips')) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', req.url);
  // }
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
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else
    return NextResponse.next({
      // Apply new request headers
      request: {
        headers: requestHeaders,
      },
    });
}

// paths in which the middleware applies
// export const config = {
//   matcher: ['/account'],
// };
