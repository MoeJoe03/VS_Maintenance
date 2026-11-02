import { timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

// A trusted access gateway must set this HttpOnly cookie after authorising the editor.
// The application never sends the secret to browser JavaScript.
export function canEditCMS(request: NextRequest): boolean {
  const secret = process.env.CMS_EDITOR_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production' && request.nextUrl.hostname === 'localhost';
  const candidate = request.cookies.get('cms_editor')?.value ?? '';
  const expected = Buffer.from(secret);
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
