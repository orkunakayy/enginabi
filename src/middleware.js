import { NextResponse } from 'next/server';
import { verifySession } from './lib/auth';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Protect /admin routes, but exclude static assets and /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    const session = await verifySession(sessionCookie);
    if (!session) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Protect /api/admin/* API endpoints (excluding login/logout/verify and public appointments POST)
  if (pathname.startsWith('/api/admin') && 
      pathname !== '/api/admin/login' && 
      pathname !== '/api/admin/logout' && 
      pathname !== '/api/admin/verify' &&
      !(pathname === '/api/admin/appointments' && request.method === 'POST')) {
    
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(sessionCookie);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Limit middleware to run only on /admin and /api/admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
