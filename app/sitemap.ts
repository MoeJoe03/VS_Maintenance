import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-metadata';

const publicPaths = [
  '/',
  '/about',
  '/services',
  '/gallery',
  '/contact',
  '/areas',
  '/areas/sandton',
  '/areas/bryanston',
  '/areas/morningside',
  '/areas/sunninghill',
  '/areas/kempton-park',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map(path => ({ url: new URL(path, SITE_URL).href }));
}
