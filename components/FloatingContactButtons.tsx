'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import type { CMSData } from '@/lib/cms-types';

function internationalNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('0') ? `27${digits.slice(1)}` : digits;
}

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [data, setData] = useState<CMSData | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/cms', { signal: controller.signal }).then(response => response.json()).then(payload => {
      if (payload?.success && payload.data) setData(payload.data);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  if (!data || pathname.startsWith('/admin')) return null;
  const whatsapp = internationalNumber(data.branding.whatsappNumber || '');
  const phone = internationalNumber(data.contactSection?.phone || data.branding.telephone || '');
  return <aside aria-label="Quick contact" className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-40 flex flex-col items-end gap-3 sm:right-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
    {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="floating-contact-button group flex h-12 items-center gap-2 rounded-full bg-[#168A48] px-3.5 text-white shadow-lg transition-transform hover:-translate-x-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#35D4DB]"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.88 11.88 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.16 1.6 5.98L.02 24l6.24-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.47-8.43ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.51-5.29c0-5.47 4.45-9.92 9.92-9.92a9.85 9.85 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.98 9.88Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg><span className="hidden pr-1 text-xs font-bold sm:inline">WhatsApp</span></a>}
    {phone && <a href={`tel:+${phone}`} aria-label="Call our team" className="floating-contact-button group flex h-12 items-center gap-2 rounded-full bg-[#079BC5] px-3.5 text-white shadow-lg transition-transform hover:-translate-x-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#35D4DB]"><Phone size={21} aria-hidden="true" /><span className="hidden pr-1 text-xs font-bold sm:inline">Call us</span></a>}
  </aside>;
}
