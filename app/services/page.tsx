import type { Metadata } from 'next';
import { getCMSData } from '@/lib/cms-storage';
import ClientServicesPage from '@/components/ClientServicesPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { branding } = getCMSData();
  return {
    title: `Services | ${branding.companyName.trim()}`,
    description: `Explore pool construction, repair, maintenance and equipment services from ${branding.companyName.trim()}. See what's included and how we work.`,
  };
}

export default function ServicesPage() {
  return <ClientServicesPage initialData={getCMSData()} />;
}
