import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import { getCMSData } from '@/lib/cms-storage';
import { routeMetadata } from '@/lib/site-metadata';

export const dynamic = 'force-dynamic';

const TITLE = 'Pool Maintenance and Renovation in Sandton | VS Maintenance Services';
const DESCRIPTION = 'Pool maintenance, repairs, renovation and equipment installation in Sandton from VS Maintenance Services. Tell us about your pool to confirm availability and request a quote.';

export async function generateMetadata() {
  const data = await getCMSData();
  return routeMetadata(data, '/areas/sandton', TITLE, DESCRIPTION, '/assets/hero_service.png');
}

export default async function SandtonPage() {
  const data = await getCMSData();
  const theme = {
    '--cms-button-background': data.branding.primaryBrandColor,
    '--cms-button-text': data.branding.buttonTextColor,
    '--cms-button-hover': data.branding.buttonHoverColor,
    '--cms-accent-text': data.branding.accentTextColor,
  } as CSSProperties;
  const sandtonProjects = data.gallery.items.filter(item => item.imageUrl.trim() && item.location?.trim().toLowerCase() === 'sandton').slice(0, 3);
  const featuredServices = ['service-3', 'service-2', 'service-4', 'garden-service', 'paving-installation'].map(id => data.services.items.find(item => item.id === id)).filter(item => item !== undefined);

  return <><StructuredData data={data} path="/areas/sandton" title={TITLE} /><main style={theme} className="min-h-screen overflow-x-clip bg-white text-[#172638]">
    <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12"><header className="relative flex min-h-[620px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] text-white md:rounded-[36px]"><Image src="/assets/hero_service.png" alt="Swimming pool at sunset" fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-[#0A1A2B]/55" /><Navbar cmsData={data} /><div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-28 text-center"><p className="hero-pop mb-5 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">Primary service area</p><h1 className="hero-pop hero-pop-delay-1 max-w-4xl text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Pool services in <span className="text-[#B8F4F5]">Sandton.</span></h1><p className="hero-pop hero-pop-delay-2 mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">VS Maintenance Services provides pool maintenance, repairs, renovations and equipment installation in Sandton. Share your address and the work required so we can confirm availability.</p><Link href="/contact?area=check#enquiry" className="cms-button hero-pop hero-pop-delay-3 mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Check availability <ArrowUpRight size={17} /></Link></div></header></div>
    <section className="mx-auto grid max-w-[1360px] gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-2"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Local pool care</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our primary service area: Sandton.</h2><p className="mt-6 text-sm leading-relaxed text-[#647785] sm:text-base">Sandton is our primary service area for swimming pool maintenance, repairs, renovations and equipment installation. We also assist with garden services and paving where the project requires it. We visit by arrangement, and availability depends on the address, access, service and current schedule.</p><Link href="/areas" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">See all areas we serve <ArrowRight size={17} /></Link></div><div className="rounded-[30px] border border-[#B8F4F5] bg-[#EBFBFA] p-7 sm:p-9"><MapPin size={27} className="text-[#079BC5]" /><h3 className="mt-5 text-2xl font-extrabold">Planning work in Sandton?</h3><p className="mt-4 text-sm leading-relaxed text-[#647785]">Send us your suburb or address, property type and a brief description of your pool or outdoor work. We will confirm whether we can assist and explain the next step.</p><Link href="/contact?area=check#enquiry" className="cms-button mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Enquire about your property <ArrowUpRight size={17} /></Link></div></section>
    <section className="px-3 sm:px-6 lg:px-8 xl:px-12"><div className="mx-auto max-w-[1360px] rounded-[32px] bg-[#10283F] px-7 py-14 text-white sm:px-12 sm:py-16"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">Available services</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">How we can help in Sandton.</h2><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featuredServices.map(service => <Link key={service.id} href={`/services#${service.id}`} className="group rounded-[22px] border border-white/20 bg-white/10 p-6 transition-colors hover:bg-white/20"><h3 className="text-xl font-extrabold">{service.title.trim().replace(/\.$/, '')}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">{service.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#B8F4F5]">View service <ArrowUpRight size={16} /></span></Link>)}</div></div></section>
    {sandtonProjects.length > 0 && <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-24"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Work from the gallery</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Sandton projects.</h2><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sandtonProjects.map(project => <Link key={project.id} href="/gallery" className="group overflow-hidden rounded-[26px] border border-[#B8F4F5]/60 bg-white shadow-card"><div className="relative aspect-[4/3] bg-[#E0FAFA]"><Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#079BC5]">Sandton</p><h3 className="mt-2 text-xl font-extrabold">{project.title.trim()}</h3><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#079BC5]">View the gallery <ArrowUpRight size={16} /></span></div></Link>)}</div></section>}
    <Footer cmsData={data} />
  </main></>;
}
