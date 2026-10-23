import { NextRequest, NextResponse } from 'next/server';
import { getLeads, addLead } from '@/lib/cms-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({ success: true, leads });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, poolDetails, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const saved = addLead({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      service: String(service || 'General Inquiry').trim(),
      poolDetails: String(poolDetails || '').trim(),
      message: String(message).trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your quote request has been received. Our master pool engineer will contact you shortly.',
      lead: saved,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record quote request' },
      { status: 500 }
    );
  }
}
