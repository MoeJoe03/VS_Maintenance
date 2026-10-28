import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { ADMIN_COOKIE, createAdminSession } from '@/lib/admin-auth';
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
  if (!process.env.CMS_ADMIN_PASSWORD || !process.env.CMS_AUTH_SECRET) return NextResponse.json({ error: 'CMS login is not configured.' }, { status: 503 });
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';
  if (password.length > 256 || !timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(process.env.CMS_ADMIN_PASSWORD).digest())) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminSession(), { httpOnly: true, sameSite: 'strict', secure: request.nextUrl.protocol === 'https:', path: '/', maxAge: 8 * 60 * 60 });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
