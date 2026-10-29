import { NextRequest, NextResponse } from 'next/server';
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRequest = path.startsWith('/admin') || path.startsWith('/api/upload') || (path === '/api/cms' && request.method !== 'GET') || ((path === '/api/leads' || path === '/api/newsletter') && request.method !== 'POST');
  if (!protectedRequest) return NextResponse.next();
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ success: false, error: 'Invalid request origin.' }, { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/api/cms', '/api/upload/:path*', '/api/leads', '/api/newsletter'] };
