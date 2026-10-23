import { getCMSData } from '@/lib/cms-storage';
import ClientGalleryPage from '@/components/ClientGalleryPage';
export const dynamic = 'force-dynamic';
export function generateMetadata() { const data = getCMSData(); return { title: `Swimming Pool Gallery | ${data.branding.companyName.trim()}`, description: 'Explore swimming pool repairs, renovations and pool care projects in Sandton and surrounding communities.' }; }
export default function GalleryPage() { return <ClientGalleryPage cmsData={getCMSData()} />; }
