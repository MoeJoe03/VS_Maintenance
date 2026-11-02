import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';

import { getCMSData } from '@/lib/cms-storage';
import ClientServicesPage from '@/components/ClientServicesPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/services', 'Swimming Pool Construction, Repairs & Maintenance | VS Maintenance', 'Explore pool maintenance, renovations, equipment installation, garden care and paving services in Sandton and surrounding areas.', '/assets/hero_service.png');
}

export default async function ServicesPage() {
  const data = await getCMSData(); return <><StructuredData data={data} path="/services" title="Services" /><ClientServicesPage initialData={data} /></>;
}
