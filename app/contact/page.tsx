import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import { getCMSData } from '@/lib/cms-storage';
import ClientContactPage from '@/components/ClientContactPage';
export const dynamic = 'force-dynamic';
export function generateMetadata() {
  const data = getCMSData();
  return routeMetadata(data, '/contact', 'Contact a Pool Maintenance Company in Sandton| VS Maintenance', 'Contact VS Maintenance Services for pool care and property maintenance in Sandton and surrounding areas. Call 067 933 0920 or send an enquiry.', data.hero.backgroundImage);
}

export default function ContactPage() { const data = getCMSData(); return <><StructuredData data={data} path="/contact" title="Contact" /><ClientContactPage cmsData={data} /></>; }
