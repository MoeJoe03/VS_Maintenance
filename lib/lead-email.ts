import type { LeadSubmission } from './cms-types';

const RECIPIENT = 'admin@vsmaintenanceservices.co.za';

export async function emailLead(lead: LeadSubmission): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM_EMAIL || 'VS Maintenance Services <website@vsmaintenanceservices.co.za>';
  const text = [
    'New website enquiry',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'Not provided'}`,
    `Service: ${lead.service}`,
    lead.poolDetails ? `Pool details: ${lead.poolDetails}` : '',
    `Message: ${lead.message || 'Not provided'}`,
  ].filter(Boolean).join('\n\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `website-lead-${lead.id}`,
    },
    body: JSON.stringify({
      from,
      to: [RECIPIENT],
      reply_to: lead.email,
      subject: `New website enquiry: ${lead.service || 'General enquiry'}`,
      text,
    }),
  });

  if (!response.ok) {
    console.error('Resend lead notification failed', response.status, await response.text());
    return false;
  }
  return true;
}
