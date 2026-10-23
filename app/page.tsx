import React from 'react';
import { getCMSData } from '@/lib/cms-storage';
import ClientHomePage from '@/components/ClientHomePage';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = getCMSData();
  return {
    title: cmsData.branding.browserTitle || `${cmsData.branding.companyName} — ${cmsData.branding.companyTagline}`,
    description: cmsData.branding.shortDescription,
    openGraph: {
      title: cmsData.branding.browserTitle || `${cmsData.branding.companyName} — ${cmsData.branding.companyTagline}`,
      description: cmsData.branding.shortDescription,
      images: [
        {
          url: cmsData.hero.backgroundImage,
          width: 1200,
          height: 630,
          alt: cmsData.branding.companyName,
        },
      ],
    },
  };
}

export default function HomePage() {
  const cmsData = getCMSData();

  return <ClientHomePage initialData={cmsData} />;
}
