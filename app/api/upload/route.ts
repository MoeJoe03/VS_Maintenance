import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { canEditCMS } from '@/lib/cms-editor-access';
import { isSupabaseConfigured, SITE_ID, supabaseClient } from '@/lib/cms-storage';

export const dynamic = 'force-dynamic';
const MAX_SIZE = 5 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
  'image/avif': 'avif', 'image/svg+xml': 'svg',
};

export async function POST(req: NextRequest) {
  if (!canEditCMS(req)) return NextResponse.json({ success: false, error: 'CMS uploads are unavailable until editor access is configured.' }, { status: 403 });
  try {
    const form = await req.formData();
    const file = form.get('file');
    const field = String(form.get('target') ?? 'general');
    if (!(file instanceof File)) return NextResponse.json({ success: false, error: 'Choose an image to upload.' }, { status: 400 });
    const ext = MIME_EXT[file.type];
    if (!ext) return NextResponse.json({ success: false, error: 'Upload PNG, JPG, WebP, AVIF, or SVG.' }, { status: 400 });
    if (file.size > MAX_SIZE || file.size === 0) return NextResponse.json({ success: false, error: 'Image must be between 1 byte and 5 MB.' }, { status: 400 });
    if (ext === 'svg' && !/^branding\./.test(field)) return NextResponse.json({ success: false, error: 'SVG is accepted for branding images only.' }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const validSignature = ext === 'svg' ||
      (ext === 'png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
      (ext === 'jpg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
      (ext === 'webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') ||
      (ext === 'avif' && bytes.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(bytes.toString('ascii', 8, 24)));
    if (!validSignature) return NextResponse.json({ success: false, error: 'The file content does not match its image format.' }, { status: 400 });
    if (ext === 'svg') {
      const markup = bytes.toString('utf8');
      if (!/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(markup) || /<\s*(?:script|foreignObject|iframe|object|embed)\b|\bon\w+\s*=|javascript:|data:text\/html/i.test(markup)) {
        return NextResponse.json({ success: false, error: 'Unsafe SVG content.' }, { status: 400 });
      }
    }
    const group = field.startsWith('branding.') ? 'branding' : field.startsWith('services.') ? 'services' : field.startsWith('gallery.') ? 'gallery' : field.split('.')[0].replace(/[^a-z0-9-]/gi, '') || 'general';
    const objectPath = `${SITE_ID}/${group}/${randomUUID()}.${ext}`;
    if (isSupabaseConfigured()) {
      const supabase = supabaseClient(true);
      if (!supabase) throw new Error('SUPABASE_SECRET_KEY is required for uploads.');
      const { error } = await supabase.storage.from('site-assets').upload(objectPath, bytes, { contentType: file.type, upsert: false, cacheControl: '3600' });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from('site-assets').getPublicUrl(objectPath);
      return NextResponse.json({ success: true, url: data.publicUrl });
    }
    if (process.env.NODE_ENV === 'production') throw new Error('Supabase is required for production uploads.');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, name), bytes);
    return NextResponse.json({ success: true, url: `/uploads/${name}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Upload failed.' }, { status: 500 });
  }
}
