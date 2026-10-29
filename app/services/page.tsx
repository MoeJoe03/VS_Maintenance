import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';

import { getCMSData } from '@/lib/cms-storage';
import ClientServicesPage from '@/components/ClientServicesPage';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const data = getCMSData();
  return routeMetadata(data, '/services', 'Swimming Pool Construction, Repairs & Maintenance | VS Maintenance', 'Explore pool maintenance, renovations, equipment installation, garden care and paving services in Sandton and surrounding areas.', '/assets/hero_service.png');
}

export default function ServicesPage() {
  const data = getCMSData(); return <><StructuredData data={data} path="/services" title="Services" /><ClientServicesPage initialData={data} /></>;
}
