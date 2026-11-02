import { notFound } from 'next/navigation';
import LocalAreaPage from '@/components/LocalAreaPage';
import StructuredData from '@/components/StructuredData';
import { getCMSData } from '@/lib/cms-storage';
import { getLocalAreaPage, localAreaPages } from '@/lib/local-area-pages';
import { routeMetadata } from '@/lib/site-metadata';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(localAreaPages).map(area => ({ area }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const config = getLocalAreaPage(area);
  if (!config) notFound();
  const data = await getCMSData();
  return routeMetadata(data, `/areas/${area}`, config.title, config.description, '/assets/hero_service.png');
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const config = getLocalAreaPage(area);
  if (!config) notFound();
  const data = await getCMSData();
  return <><StructuredData data={data} path={`/areas/${area}`} title={config.title} /><LocalAreaPage cmsData={data} config={config} /></>;
}
