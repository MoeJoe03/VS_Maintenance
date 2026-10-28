export const ADMIN_COOKIE = 'vs_admin_session';
async function signature(value: string) {
  const secret = process.env.CMS_AUTH_SECRET;
  if (!secret) throw new Error('CMS authentication is not configured');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export async function createAdminSession() {
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expiry}.${await signature(expiry)}`;
}
export async function validAdminSession(token?: string) {
  if (!token || !process.env.CMS_AUTH_SECRET) return false;
  const [expiry, supplied] = token.split('.');
  if (!expiry || !supplied || !/^\d+$/.test(expiry) || Number(expiry) <= Date.now()) return false;
  const expected = await signature(expiry);
  if (expected.length !== supplied.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return difference === 0;
}
