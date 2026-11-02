import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';

import { getCMSData } from '@/lib/cms-storage';
import ClientAboutPage from '@/components/ClientAboutPage';

export const dynamic = 'force-dynamic';
const PAGE_TITLE = 'About VS Maintenance Services | Sandton';

export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/about', PAGE_TITLE, 'Meet VS Maintenance Services and learn about our approach to pool care and property maintenance in Sandton and surrounding areas.', '/assets/about-hero.png');
}

export default async function AboutPage() {
 const data = await getCMSData();
 return <><StructuredData data={data} path="/about" title={PAGE_TITLE} /><ClientAboutPage initialData={data} /></>;
}
