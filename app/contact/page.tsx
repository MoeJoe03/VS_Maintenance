import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import { getCMSData } from '@/lib/cms-storage';
import ClientContactPage from '@/components/ClientContactPage';
export const dynamic = 'force-static';
export const revalidate = 300;
const PAGE_TITLE = 'Contact a Pool Maintenance Company in Sandton | VS Maintenance';
export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/contact', PAGE_TITLE, `Contact VS Maintenance Services for pool care and property maintenance in Sandton and surrounding areas. Call ${data.branding.telephone.trim()} or send an enquiry.`, data.hero.backgroundImage);
}

export default async function ContactPage() { const data = await getCMSData(); return <><StructuredData data={data} path="/contact" title={PAGE_TITLE} /><ClientContactPage cmsData={data} /></>; }
