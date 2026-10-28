import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, validAdminSession } from '@/lib/admin-auth';
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === '/admin/login') return NextResponse.next();
  const protectedRequest = path.startsWith('/admin') || path.startsWith('/api/upload') || (path === '/api/cms' && request.method !== 'GET') || ((path === '/api/leads' || path === '/api/newsletter') && request.method !== 'POST');
  if (!protectedRequest) return NextResponse.next();
  if (!await validAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    if (path.startsWith('/api/')) return NextResponse.json({ success: false, error: 'Please log in to the CMS.' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ success: false, error: 'Invalid request origin.' }, { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/api/cms', '/api/upload/:path*', '/api/leads', '/api/newsletter'] };
