import { serviceAreas } from './ServiceAreas';
import type { CMSData } from '@/lib/cms-types';
import { SITE_URL } from '@/lib/site-metadata';
import { serviceFaqs } from '@/lib/service-faqs';
import { getBusinessDetails } from '@/lib/business-details';
import { areaFaqs } from '@/lib/area-faqs';
import { sandtonFaqs } from '@/lib/sandton-faqs';

export default function StructuredData({ data, path, title }: { data: CMSData; path: string; title: string }) {
  const businessId = `${SITE_URL}/#business`;
  const websiteId = `${SITE_URL}/#website`;
  const url = new URL(path, SITE_URL).href;
  const business = getBusinessDetails(data);
  const { address, telephone } = business;
  const addressParts = address.match(/^(.*),\s*([^,]+),\s*(\d{4})$/);
  const graph: Record<string, unknown>[] = [
    {
      '@type': ['LocalBusiness', 'Organization'], '@id': businessId,
      name: data.branding.companyName.trim(), url: SITE_URL,
      ...(data.branding.logoUrl ? { logo: { '@type': 'ImageObject', url: new URL(data.branding.logoUrl, SITE_URL).href } } : {}),
      ...(telephone ? { telephone } : {}),
      ...(business.email ? { email: business.email } : {}),
      contactPoint: { '@id': `${SITE_URL}/#contact-point` },
      ...(address ? { address: addressParts ? {
        '@type': 'PostalAddress', streetAddress: addressParts[1].trim(),
        addressLocality: addressParts[2].trim(), postalCode: addressParts[3], addressCountry: 'ZA',
      } : address } : {}),
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
      ],
      sameAs: [data.branding.facebookUrl, data.branding.instagramUrl, data.branding.linkedinUrl].filter(value => value && /^https?:\/\//.test(value) && !/^https?:\/\/(www\.)?(facebook|instagram|linkedin)\.com\/?$/.test(value)),
      areaServed: serviceAreas.map(name => ({ '@type': 'Place', name: `${name}, South Africa` })),
    },
    { '@type': 'WebSite', '@id': websiteId, url: SITE_URL, name: data.branding.companyName.trim(), publisher: { '@id': businessId }, inLanguage: 'en-ZA' },
    { '@type': path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : path === '/gallery' ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, isPartOf: { '@id': websiteId }, about: { '@id': businessId }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }, ...(path === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: title, item: url }])] },
  ];
  graph.push({ '@type': 'ContactPoint', '@id': `${SITE_URL}/#contact-point`, contactType: 'customer enquiries', url: `${SITE_URL}/contact`, ...(telephone ? { telephone } : {}), ...(business.email ? { email: business.email } : {}) });
  if (path === '/contact') {
    const page = graph.find(node => node['@id'] === `${url}#webpage`);
    if (page) page.mainEntity = { '@id': businessId };
  }
  if (path === '/services' || path === '/' || path === '/areas') {
    graph.push(...data.services.items.map(service => ({
      '@type': 'Service', '@id': `${SITE_URL}/services#${service.id}`,
      name: service.title.trim().replace(/\.$/, ''), description: service.description,
      url: `${SITE_URL}/services#${service.id}`, provider: { '@id': businessId },
      areaServed: serviceAreas.map(name => ({ '@type': 'Place', name: `${name}, South Africa` })),
    })));
  }
  if (path === '/areas') {
    const areaServiceId = `${url}#pool-services`;
    const page = graph.find(node => node['@id'] === `${url}#webpage`);
    if (page) page.mainEntity = { '@id': areaServiceId };
    graph.push({
      '@type': 'Service', '@id': areaServiceId,
      name: 'Swimming Pool Services in Sandton and Johannesburg',
      description: 'Pool maintenance, repairs, renovations, equipment installation and property care in Sandton and surrounding Johannesburg service areas.',
      url, provider: { '@id': businessId }, mainEntityOfPage: { '@id': `${url}#webpage` },
      areaServed: serviceAreas.map(name => ({ '@type': 'Place', name: `${name}, South Africa` })),
    });
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`, url: `${url}#faq`,
      isPartOf: { '@id': `${url}#webpage` },
      mainEntity: areaFaqs.map(({ question, answer }) => ({
        '@type': 'Question', name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }
  if (path === '/areas/sandton') {
    const serviceId = `${url}#service`;
    const page = graph.find(node => node['@id'] === `${url}#webpage`);
    if (page) page.mainEntity = { '@id': serviceId };
    graph.push({
      '@type': 'Service', '@id': serviceId,
      name: 'Pool Maintenance and Renovations in Sandton',
      serviceType: ['Swimming pool maintenance', 'Swimming pool repairs', 'Swimming pool renovation', 'Pool equipment installation'],
      description: 'Pool maintenance, repairs, renovations and equipment installation in Sandton. Availability depends on the address and work required.',
      url, provider: { '@id': businessId }, mainEntityOfPage: { '@id': `${url}#webpage` },
      areaServed: { '@type': 'Place', name: 'Sandton, Johannesburg, South Africa' },
    });
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`, url: `${url}#faq`,
      isPartOf: { '@id': `${url}#webpage` },
      mainEntity: sandtonFaqs.map(({ question, answer }) => ({
        '@type': 'Question', name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }
  if (path === '/services') {
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`, url: `${url}#faq`,
      isPartOf: { '@id': `${url}#webpage` },
      mainEntity: serviceFaqs.map(faq => ({
        '@type': 'Question', name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }
  if (path === '/gallery') {
    const projects = data.gallery.items.filter(project => project.imageUrl.trim());
    const listId = `${url}#projects`;
    const page = graph.find(node => node['@id'] === `${url}#webpage`);
    if (page) page.mainEntity = { '@id': listId };
    graph.push({
      '@type': 'ItemList', '@id': listId, name: 'Featured projects',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem', position: index + 1,
        item: { '@id': `${url}#image-${project.id}` },
      })),
    });
    graph.push(...projects.map(project => ({
      '@type': 'ImageObject', '@id': `${url}#image-${project.id}`,
      name: project.title.trim(), caption: project.title.trim(),
      contentUrl: new URL(project.imageUrl, SITE_URL).href,
      thumbnailUrl: new URL(project.imageUrl, SITE_URL).href,
      genre: project.category,
      ...(project.description?.trim() ? { description: project.description.trim() } : {}),
      ...(project.location?.trim() ? { contentLocation: { '@type': 'Place', name: project.location.trim() } } : {}),
      isPartOf: { '@id': `${url}#webpage` },
    })));
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') }} />;
}
