import { serviceAreas } from './ServiceAreas';
import type { CMSData } from '@/lib/cms-types';
import { SITE_URL } from '@/lib/site-metadata';

export default function StructuredData({ data, path, title }: { data: CMSData; path: string; title: string }) {
  const businessId = `${SITE_URL}/#business`;
  const websiteId = `${SITE_URL}/#website`;
  const url = new URL(path, SITE_URL).href;
  const graph: Record<string, unknown>[] = [
    {
      '@type': ['LocalBusiness', 'Organization'], '@id': businessId,
      name: 'VS Maintenance Services', url: SITE_URL,
      ...(data.branding.logoUrl ? { logo: { '@type': 'ImageObject', url: new URL(data.branding.logoUrl, SITE_URL).href } } : {}),
      telephone: '+27679330920',
      email: 'admin@vsmaintenanceservices.co.za',
      address: {
        '@type': 'PostalAddress', streetAddress: '4 Cross Rd, Glenhazel',
        addressLocality: 'Johannesburg', postalCode: '2090', addressCountry: 'ZA',
      },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
      ],
      sameAs: ['https://www.facebook.com/p/VS-Maintenance-Services-61575836252987/'],
      areaServed: serviceAreas.map(name => ({ '@type': 'Place', name: `${name}, South Africa` })),
    },
    { '@type': 'WebSite', '@id': websiteId, url: SITE_URL, name: 'VS Maintenance Services', publisher: { '@id': businessId }, inLanguage: 'en-ZA' },
    { '@type': path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : path === '/gallery' ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, isPartOf: { '@id': websiteId }, about: { '@id': businessId }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }, ...(path === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: title, item: url }])] },
  ];
  if (path === '/services' || path === '/') {
    graph.push(...data.services.items.map(service => ({
      '@type': 'Service', '@id': `${SITE_URL}/services#${service.id}`,
      name: service.title.trim().replace(/\.$/, ''), description: service.description,
      url: `${SITE_URL}/services#${service.id}`, provider: { '@id': businessId },
      areaServed: serviceAreas.map(name => ({ '@type': 'Place', name: `${name}, South Africa` })),
    })));
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') }} />;
}
