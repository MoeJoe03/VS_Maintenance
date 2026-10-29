import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';

import { getCMSData } from '@/lib/cms-storage';
import ClientAboutPage from '@/components/ClientAboutPage';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const data = getCMSData();
  return routeMetadata(data, '/about', 'About VS Maintenance Services | Sandton', 'Meet VS Maintenance Services and learn about our approach to pool care and property maintenance in Sandton and surrounding areas.', '/assets/about-hero.png');
}

export default function AboutPage() {
 const data = getCMSData();
 return <><StructuredData data={data} path="/about" title="About" /><ClientAboutPage initialData={data} /></>;
}
