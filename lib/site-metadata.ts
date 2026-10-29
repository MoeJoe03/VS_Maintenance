import type { Metadata } from 'next';
import type { CMSData } from './cms-types';

export const SITE_URL = 'https://vsmaintenanceservices.co.za';

export function routeMetadata(data: CMSData, path: string, title: string, description: string, image: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: new URL(path, SITE_URL).href,
      type: 'website',
      siteName: 'VS Maintenance Services',
      images: [{ url: new URL(image, SITE_URL).href, alt: `${data.branding.companyName.trim()} swimming pool services` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [new URL(image, SITE_URL).href] },
  };
}
