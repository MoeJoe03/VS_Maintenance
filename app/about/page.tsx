import type { Metadata } from 'next';
import { getCMSData } from '@/lib/cms-storage';
import ClientAboutPage from '@/components/ClientAboutPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = getCMSData();
  const name = data.branding.companyName.trim();
  return {
    title: `About ${name} | Pool Services in Sandton`,
    description: `Learn what ${name} does, who we serve, where we work, and how our team approaches pool construction, repairs, maintenance and equipment installation.`,
  };
}

export default function AboutPage() {
  const data = getCMSData();
  const name = data.branding.companyName.trim();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description: data.branding.shortDescription,
    areaServed: { '@type': 'Place', name: data.contactSection?.location || 'Sandton, South Africa' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: data.contactSection?.phone || data.branding.telephone,
      email: data.contactSection?.email || data.branding.emailAddress,
      contactType: 'customer service',
    },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <ClientAboutPage initialData={data} />
  </>;
}
