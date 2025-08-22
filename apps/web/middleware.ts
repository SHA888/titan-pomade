import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const role = req.cookies.get('role')?.value;

    // Redirect to login if not an admin
    if (role !== 'ADMIN') {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
