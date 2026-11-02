import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import React from 'react';
import { getCMSData } from '@/lib/cms-storage';
import ClientHomePage from '@/components/ClientHomePage';


export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/', data.branding.browserTitle || 'Pool Maintenance & Repairs in Sandton | VS Maintenance Services', data.branding.shortDescription || 'Pool care, renovations, equipment installation, garden services and property maintenance in Sandton and surrounding service areas.', data.hero.backgroundImage);
}

export default async function HomePage() {
  const cmsData = await getCMSData();

  return <><StructuredData data={cmsData} path="/" title="Home" /><ClientHomePage initialData={cmsData} /></>;
}
