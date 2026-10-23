import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload (e.g. dataURL or remote URL)
    if (contentType.includes('application/json')) {
      const { dataUrl, filename = 'image.webp' } = await req.json();

      if (!dataUrl || typeof dataUrl !== 'string') {
        return NextResponse.json(
          { success: false, error: 'No image data provided' },
          { status: 400 }
        );
      }

      // If it's an external URL (http/https), just return it
      if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
        return NextResponse.json({ success: true, url: dataUrl });
      }

      // Parse base64
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json(
          { success: false, error: 'Invalid data URL format' },
          { status: 400 }
        );
      }

      const mimeType = matches[1];
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, error: 'Unsupported image format. Allowed: PNG, JPG, WebP, SVG.' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(matches[2], 'base64');
      if (buffer.length > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: 'Image exceeds maximum allowed size of 5MB.' },
          { status: 400 }
        );
      }

      const ext = mimeType.split('/')[1].replace('svg+xml', 'svg').replace('jpeg', 'jpg');
      const safeName = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, safeName), buffer);
        return NextResponse.json({ success: true, url: `/uploads/${safeName}` });
      } catch (err) {
        // Fallback to data URL if writing to public/uploads fails in isolated environments
        return NextResponse.json({ success: true, url: dataUrl });
      }
    }

    // Handle FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file received' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Please upload PNG, JPG, WebP, or SVG.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop() || 'jpg';
    const safeName = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, safeName), buffer);
      return NextResponse.json({ success: true, url: `/uploads/${safeName}` });
    } catch {
      // Fallback: convert to base64 data URL
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
