import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'vs-maintenance-services';
if (!url || !secret) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY before importing.');
const supabase = createClient(url, secret, { auth: { persistSession: false } });
const source = path.join(process.cwd(), 'data', 'cms-data.json');
const cms = JSON.parse(await fs.readFile(source, 'utf8'));
const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml' };
const uploaded = new Map();

async function replaceImages(value, section = 'content') {
  if (Array.isArray(value)) {
    const output = [];
    for (const item of value) output.push(await replaceImages(item, section));
    return output;
  }
  if (value && typeof value === 'object') {
    const output = {};
    for (const [key, nested] of Object.entries(value)) {
      output[key] = await replaceImages(nested, ['branding', 'services', 'gallery'].includes(key) ? key : section);
    }
    return output;
  }
  if (typeof value !== 'string' || !value.startsWith('/uploads/')) return value;
  if (uploaded.has(value)) return uploaded.get(value);
  const basename = path.basename(value);
  const extension = path.extname(basename).slice(1).toLowerCase();
  const contentType = mime[extension];
  if (!contentType) throw new Error(`Unsupported existing image: ${basename}`);
  const bytes = await fs.readFile(path.join(process.cwd(), 'public', 'uploads', basename));
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 20);
  const objectPath = `${siteId}/${section}/imported-${hash}.${extension}`;
  const { error } = await supabase.storage.from('site-assets').upload(objectPath, bytes, { contentType, upsert: false, cacheControl: '3600' });
  if (error && !/already exists|duplicate/i.test(error.message)) throw new Error(`Upload ${basename}: ${error.message}`);
  const publicUrl = supabase.storage.from('site-assets').getPublicUrl(objectPath).data.publicUrl;
  uploaded.set(value, publicUrl);
  return publicUrl;
}

const prepared = await replaceImages(cms);
const { error } = await supabase.from('site_settings').upsert({ site_id: siteId, content: prepared, updated_at: new Date().toISOString() }, { onConflict: 'site_id' });
if (error) throw new Error(`CMS import failed: ${error.message}`);
console.log(`Imported CMS content for ${siteId}; migrated ${uploaded.size} local image references.`);
