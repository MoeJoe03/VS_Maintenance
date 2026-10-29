import StructuredData from '@/components/StructuredData';
import { routeMetadata } from '@/lib/site-metadata';
import { getCMSData } from '@/lib/cms-storage';
import ClientGalleryPage from '@/components/ClientGalleryPage';
export const dynamic = 'force-dynamic';
export function generateMetadata() {
  const data = getCMSData();
  return routeMetadata(data, '/gallery', 'Swimming Pool Projects in Sandton | VS Maintenance Services', 'Browse the swimming pool and property maintenance gallery from VS Maintenance Services.', '/assets/gallery-hero.png');
}

export default function GalleryPage() { const data = getCMSData(); return <><StructuredData data={data} path="/gallery" title="Our Work" /><ClientGalleryPage cmsData={data} /></>; }
