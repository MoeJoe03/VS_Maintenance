import { NextRequest, NextResponse } from 'next/server';
import { getCMSData, saveCMSData, resetCMSData } from '@/lib/cms-storage';
import { CMSData } from '@/lib/cms-types';
import { canEditCMS } from '@/lib/cms-editor-access';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getCMSData(true);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to retrieve CMS content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!canEditCMS(req)) return NextResponse.json({ success: false, error: 'CMS editing is unavailable until editor access is configured.' }, { status: 403 });
    const body = (await req.json()) as CMSData;

    // Basic validation
    if (!body || !body.branding || !body.hero) {
      return NextResponse.json(
        { success: false, error: 'Invalid CMS payload structure' },
        { status: 400 }
      );
    }

    const saved = await saveCMSData(body);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Could not write CMS configuration to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Website content & branding successfully saved and published!',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error processing save request' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!canEditCMS(req)) return NextResponse.json({ success: false, error: 'CMS editing is unavailable until editor access is configured.' }, { status: 403 });
    const reset = await resetCMSData();
    return NextResponse.json({
      success: true,
      message: 'Restored original Stitch design presets.',
      data: reset,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to reset CMS defaults' },
      { status: 500 }
    );
  }
}
