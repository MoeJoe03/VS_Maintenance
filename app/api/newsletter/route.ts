import { NextRequest, NextResponse } from 'next/server';
import { getSubscribers, addSubscriber } from '@/lib/cms-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const subscribers = getSubscribers();
  return NextResponse.json({ success: true, subscribers });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const sub = addSubscriber(String(email).trim().toLowerCase());
    return NextResponse.json({
      success: true,
      message: 'You have been successfully subscribed to our newsletter!',
      subscriber: sub,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
