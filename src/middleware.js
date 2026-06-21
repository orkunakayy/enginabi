import { NextResponse } from 'next/server';

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

    try {
      // Fetch status from the verification endpoint
      const verifyRes = await fetch(new URL('/api/admin/verify', request.url), {
        headers: {
          Cookie: `admin_session=${sessionCookie}`
        },
        // Avoid caching the verification request
        cache: 'no-store'
      });

      if (verifyRes.status !== 200) {
        // Tampered or expired token
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    } catch (err) {
      console.error("Middleware verification fetch error:", err);
      // In case of error, redirect to login for safety
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
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

    try {
      const verifyRes = await fetch(new URL('/api/admin/verify', request.url), {
        headers: {
          Cookie: `admin_session=${sessionCookie}`
        },
        cache: 'no-store'
      });

      if (verifyRes.status !== 200) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return NextResponse.next();
}

// Limit middleware to run only on /admin and /api/admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
