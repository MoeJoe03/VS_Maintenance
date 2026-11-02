import StructuredData from '@/components/StructuredData';
import ServiceAreasPage from '@/components/ServiceAreasPage';
import { getCMSData } from '@/lib/cms-storage';
import { routeMetadata } from '@/lib/site-metadata';

export const dynamic = 'force-dynamic';

const PAGE_TITLE = 'Pool Service Areas in Johannesburg | VS Maintenance Services';
const DESCRIPTION = 'See where VS Maintenance Services provides pool maintenance, repairs, renovations, equipment installation and property care across Sandton and surrounding Johannesburg areas.';

export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/areas', PAGE_TITLE, DESCRIPTION, '/assets/hero_service.png');
}

export default async function Page() {
  const data = await getCMSData();
  return <><StructuredData data={data} path="/areas" title={PAGE_TITLE} /><ServiceAreasPage cmsData={data} /></>;
}
