import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import { getCMSData } from '@/lib/cms-storage';
import ClientGalleryPage from '@/components/ClientGalleryPage';
export const dynamic = 'force-dynamic';
const PAGE_TITLE = 'Swimming Pool Projects in Sandton | VS Maintenance Services';
export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/gallery', PAGE_TITLE, 'View pool maintenance, repairs, renovations and equipment installation projects completed by VS Maintenance Services in Sandton and surrounding Johannesburg areas.', '/assets/gallery-hero.png');
}

export default async function GalleryPage() { const data = await getCMSData(); return <><StructuredData data={data} path="/gallery" title={PAGE_TITLE} /><ClientGalleryPage cmsData={data} /></>; }
