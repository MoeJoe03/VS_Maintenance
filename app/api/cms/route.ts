import { NextRequest, NextResponse } from 'next/server';
import { getCMSData, saveCMSData, resetCMSData } from '@/lib/cms-storage';
import { CMSData } from '@/lib/cms-types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getCMSData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve CMS content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CMSData;

    // Basic validation
    if (!body || !body.branding || !body.hero) {
      return NextResponse.json(
        { success: false, error: 'Invalid CMS payload structure' },
        { status: 400 }
      );
    }

    const saved = saveCMSData(body);
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
      { success: false, error: 'Server error processing save request' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const reset = resetCMSData();
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
