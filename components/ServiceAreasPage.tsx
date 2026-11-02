import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown, MapPin, Phone } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { CMSData, GalleryItem } from '@/lib/cms-types';
import { serviceAreas } from './ServiceAreas';
import Navbar from './Navbar';
import Footer from './Footer';
import { getBusinessDetails } from '@/lib/business-details';

const additionalAreas = [
  'Bryanston', 'Fourways', 'Morningside', 'Randburg', 'Bedfordview',
  'Germiston', 'Midrand', 'Benoni', 'Sunninghill', 'Centurion',
  'Edenvale', 'Rosebank', 'Houghton Estate', 'Kempton Park', 'Kyalami',
].filter(area => serviceAreas.includes(area));

const serviceGroups = [
  { number: '01', title: 'Pool care', ids: ['service-3', 'pool-service', 'green-pool-treatments'], extras: ['Pool cleaning and vacuuming', 'Water testing and balancing', 'Filter cleaning and backwashing'] },
  { number: '02', title: 'Pool repairs and renovation', ids: ['service-2', 'leaking-pipe-repair', 'pool-plastering', 'pool-painting', 'pool-draining', 'pool-sand-change', 'multiport-valve-installation'], extras: [] },
  { number: '03', title: 'Equipment installation', ids: ['pump-installation', 'filter-tank-installation', 'pool-light-installation', 'service-4'], extras: [] },
  { number: '04', title: 'Property maintenance', ids: ['garden-service', 'paving-installation'], extras: [] },
];

const faqs = [
  { question: 'Do you provide pool maintenance in Sandton?', answer: 'Yes. Sandton is our primary service area. Our pool maintenance service includes cleaning, water testing and balancing, filter care and equipment checks. Contact us with your address to confirm availability.' },
  { question: 'Do you also serve Bryanston and Fourways?', answer: 'Yes, Bryanston and Fourways are listed service areas. Availability depends on your exact address, the work required and our current schedule, so please confirm with our team before arranging a visit.' },
  { question: 'Do you have offices in every listed suburb?', answer: 'No. These are service areas rather than separate branches. We operate from our Johannesburg base and visit customers by arrangement.' },
  { question: 'Do you cover my suburb if it is not listed?', answer: 'Send us your address or suburb and a short description of the work. We will check whether we can assist.' },
];

const featuredProjectIds = ['gal-2', 'gal-5', 'gal-7', 'gal-20', 'gal-6', 'gal-8'];

function recentProjects(items: GalleryItem[]) {
  const available = items.filter(item => item.imageUrl.trim() && item.location?.trim());
  const selected = featuredProjectIds.map(id => available.find(item => item.id === id)).filter((item): item is GalleryItem => Boolean(item));
  return [...selected, ...available.filter(item => !selected.some(project => project.id === item.id))].slice(0, 6);
}

export default function ServiceAreasPage({ cmsData }: { cmsData: CMSData }) {
  const theme = {
    '--cms-button-background': cmsData.branding.primaryBrandColor,
    '--cms-button-text': cmsData.branding.buttonTextColor,
    '--cms-button-hover': cmsData.branding.buttonHoverColor,
    '--cms-accent-text': cmsData.branding.accentTextColor,
  } as CSSProperties;
  const projects = recentProjects(cmsData.gallery.items);
  const { phone, telephone } = getBusinessDetails(cmsData);

  return <main className="min-h-screen overflow-x-clip bg-white text-[#172638]" style={theme}>
    <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12">
      <header className="relative flex h-[calc(100dvh-1rem)] min-h-[640px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] sm:h-[calc(100dvh-1.5rem)] md:rounded-[36px]">
        <Image data-parallax-image src="/assets/hero_service.png" alt="Swimming pool at sunset" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[#0A1A2B]/55" />
        <Navbar cmsData={cmsData} />
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center text-white sm:px-10">
          <p className="hero-pop mb-5 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">Areas we serve</p>
          <h1 className="hero-pop hero-pop-delay-1 max-w-4xl text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Pool services across <span className="text-[#B8F4F5]">Sandton and Johannesburg.</span></h1>
          <p className="hero-pop hero-pop-delay-2 mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">VS Maintenance Services provides pool maintenance, repairs, renovations, equipment installation and property maintenance in Sandton and surrounding Johannesburg areas. Sandton is our primary service area, with availability in nearby suburbs depending on your address, the work required and our current schedule.</p>
          <div className="hero-pop hero-pop-delay-3 mt-8 flex flex-wrap justify-center gap-3"><Link href="/contact?area=check#enquiry" className="cms-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg">Check your area <ArrowUpRight size={17} /></Link><Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">Explore our services <ArrowRight size={17} /></Link></div>
        </div>
      </header>
    </div>

    <section id="areas" className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Where we work</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Areas we serve<span className="text-[#079BC5]">.</span></h2></div><p className="max-w-md text-sm leading-relaxed text-[#647785] sm:text-base">These are service areas, with visits arranged for each address and project. They are not separate branches or offices.</p></div>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="relative flex min-h-[350px] flex-col justify-between overflow-hidden rounded-[30px] bg-[#10283F] p-8 text-white sm:p-10"><div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#35D4DB]/15 blur-3xl" /><div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#B8F4F5]"><MapPin size={28} /></div><div className="relative"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">Primary service area</p><h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Our primary service area: Sandton</h3><p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75">Sandton is our primary service area for swimming pool maintenance, repairs, renovations and equipment installation. We also assist with related outdoor property work, including garden services and paving where the project requires it. Contact us with your suburb and pool requirements so we can confirm availability before arranging a visit.</p><Link href="/areas/sandton" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#B8F4F5] hover:underline">View Sandton services <ArrowUpRight size={17} /></Link></div></article>
        <div className="rounded-[30px] border border-[#B8F4F5] bg-[#EBFBFA] p-7 sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Additional service areas</p><h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Pool care close to home.</h3><ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">{additionalAreas.map(area => <li key={area} className="flex min-h-14 items-center rounded-2xl border border-[#B8F4F5]/80 bg-white px-3 py-3 text-sm font-semibold text-[#172638] sm:px-4"><MapPin size={15} className="mr-2 shrink-0 text-[#079BC5]" aria-hidden="true" />{area}</li>)}</ul></div>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-[#647785]">Outside these areas? <Link href="/contact?area=check#enquiry" className="font-bold text-[#079BC5] underline-offset-4 hover:underline">Ask us about your address</Link> and we will let you know whether we can help.</p>
    </section>

    <section className="px-3 sm:px-6 lg:px-8 xl:px-12"><div className="mx-auto max-w-[1360px] rounded-[32px] bg-[#10283F] px-7 py-14 text-white sm:px-12 sm:py-16"><div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">What we can help with</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Services available in these areas.</h2></div><p className="max-w-md text-sm leading-relaxed text-white/75">Tell us your address and the work required so we can confirm availability for your project.</p></div><div className="grid gap-4 md:grid-cols-2">{serviceGroups.map(group => {
        const services = group.ids.map(id => cmsData.services.items.find(service => service.id === id)).filter((service): service is CMSData['services']['items'][number] => Boolean(service));
        return <article key={group.title} className="flex flex-col rounded-[24px] border border-white/20 bg-white/10 p-6 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">{group.number} / Services</p><h3 className="mt-3 text-2xl font-extrabold tracking-tight">{group.title}</h3><ul className="mt-5 grid gap-x-4 gap-y-2 sm:grid-cols-2">{services.map(service => <li key={service.id} className="text-sm leading-relaxed text-white/80">{service.title.trim().replace(/\.$/, '')}</li>)}{group.extras.map(extra => <li key={extra} className="text-sm leading-relaxed text-white/80">{extra}</li>)}</ul><Link href="/services" className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-[#B8F4F5] hover:underline">View services <ArrowUpRight size={17} /></Link></article>;
      })}</div></div></section>

    <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-24"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Booking a visit</p><h2 className="max-w-lg text-4xl font-extrabold tracking-tight sm:text-5xl">How our service-area coverage works.</h2><p className="mt-6 max-w-lg text-sm leading-relaxed text-[#647785] sm:text-base">We work from our Johannesburg base and visit customers by arrangement. Coverage depends on your exact suburb, property access, the type of service required and current team availability. Send us your suburb, property type and a short description of the work, and we will confirm whether we can assist.</p></div><ol className="grid gap-4">{[['01', 'Tell us your suburb', 'Share your address or suburb so we can check coverage.'], ['02', 'Describe the work', 'Tell us about the pool or property work required and your property type.'], ['03', 'We confirm the next step', 'We confirm availability and advise how to arrange an assessment or quote.']].map(([number, title, copy]) => <li key={number} className="flex gap-5 rounded-[24px] border border-[#B8F4F5] bg-[#EBFBFA] p-6 sm:p-7"><span className="text-2xl font-extrabold text-[#079BC5]">{number}</span><div><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#647785]">{copy}</p></div></li>)}</ol></div></section>

    {projects.length > 0 && <section className="mx-auto max-w-[1360px] px-6 pb-20 sm:px-10 sm:pb-24"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Work you can see</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Recent work across Johannesburg.</h2></div><Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">View the gallery <ArrowUpRight size={17} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map(project => <article key={project.id} className="overflow-hidden rounded-[26px] border border-[#B8F4F5]/60 bg-white shadow-card"><div className="relative aspect-[4/3] bg-[#E0FAFA]"><Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div><div className="p-6"><p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#079BC5]"><MapPin size={14} />{project.location}</p><h3 className="mt-2 text-xl font-extrabold">{project.title.trim()}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#647785]">{project.description?.trim() || `A ${project.title.trim().toLowerCase()} project featured in our gallery.`}</p><Link href="/gallery" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">See more projects <ArrowUpRight size={16} /></Link></div></article>)}</div></section>}

    <section className="mx-auto grid max-w-[1360px] gap-12 px-6 pb-20 sm:px-10 sm:pb-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Good to know</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Service area <span className="text-[#079BC5]">questions.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#647785]">If you are unsure about coverage, send your suburb and a brief description of the work.</p></div><div className="divide-y divide-[#B8F4F5] border-y border-[#B8F4F5]">{faqs.map(({ question, answer }) => <details key={question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-bold marker:content-none sm:text-lg"><span>{question}</span><ChevronDown size={21} className="shrink-0 text-[#079BC5] transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-[#647785]">{answer}</p></details>)}</div></section>

    <section className="mx-auto max-w-[900px] px-6 pb-16 text-center"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Let us come to you</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Not sure whether we cover your address?</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#647785] sm:text-base">Send us your suburb and a short description of the pool or property work you need. We will confirm current coverage and help you decide the right next step.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/contact?area=check#enquiry" className="cms-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Check my area <ArrowUpRight size={17} /></Link>{telephone && <a href={`tel:${telephone}`} className="cms-button-outline inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold"><Phone size={17} />Call {phone}</a>}</div></section>
    <Footer cmsData={cmsData} />
  </main>;
}
