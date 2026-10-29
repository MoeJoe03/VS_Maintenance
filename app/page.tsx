import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import React from 'react';
import { getCMSData } from '@/lib/cms-storage';
import ClientHomePage from '@/components/ClientHomePage';


export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const data = getCMSData();
  return routeMetadata(data, '/', 'Pool Maintenance & Repairs in Sandton | VS Maintenance Services', 'Pool care, renovations, equipment installation, garden services and property maintenance in Sandton and surrounding service areas.', data.hero.backgroundImage);
}

export default function HomePage() {
  const cmsData = getCMSData();

  return <><StructuredData data={cmsData} path="/" title="Home" /><ClientHomePage initialData={cmsData} /></>;
}
