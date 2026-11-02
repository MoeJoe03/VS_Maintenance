import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { CMSData, GalleryItem } from '@/lib/cms-types';
import type { LocalAreaPageConfig } from '@/lib/local-area-pages';
import Navbar from './Navbar';
import Footer from './Footer';

function getAreaProjects(data: CMSData, config: LocalAreaPageConfig) {
  const located = data.gallery.items.filter(item => item.imageUrl.trim() && item.location?.trim().toLowerCase() === config.name.toLowerCase());
  const selected = config.projectIds.map(id => located.find(item => item.id === id)).filter((item): item is GalleryItem => Boolean(item));
  return [...selected, ...located.filter(item => !selected.some(project => project.id === item.id))].slice(0, 4);
}

export default function LocalAreaPage({ cmsData, config }: { cmsData: CMSData; config: LocalAreaPageConfig }) {
  const theme = {
    '--cms-button-background': cmsData.branding.primaryBrandColor,
    '--cms-button-text': cmsData.branding.buttonTextColor,
    '--cms-button-hover': cmsData.branding.buttonHoverColor,
    '--cms-accent-text': cmsData.branding.accentTextColor,
  } as CSSProperties;
  const projects = getAreaProjects(cmsData, config);
  const services = cmsData.services.items;
  const heroImage = projects[0]?.imageUrl || '/assets/hero_service.png';

  return <main style={theme} className="min-h-screen overflow-x-clip bg-white text-[#172638]">
    <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12">
      <header className="relative flex h-[calc(100dvh-1rem)] min-h-[640px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] text-white sm:h-[calc(100dvh-1.5rem)] md:rounded-[36px]">
        <Image data-parallax-image src={heroImage} alt={`Swimming pool work in ${config.name}`} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[#0A1A2B]/60" />
        <Navbar cmsData={cmsData} />
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center sm:px-10">
          <p className="hero-pop mb-5 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">Areas we serve</p>
          <h1 className="hero-pop hero-pop-delay-1 max-w-4xl text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Pool services in <span className="text-[#B8F4F5]">{config.name}.</span></h1>
          <p className="hero-pop hero-pop-delay-2 mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{config.intro}</p>
          <div className="hero-pop hero-pop-delay-3 mt-8 flex flex-wrap justify-center gap-3"><Link href="/contact?area=check#enquiry" className="cms-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg">Check availability <ArrowUpRight size={17} /></Link><Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">Explore services <ArrowRight size={17} /></Link></div>
        </div>
      </header>
    </div>

    <section className="mx-auto grid max-w-[1360px] gap-10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:gap-16"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Local service area</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Pool care for {config.name} properties.</h2><p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#647785] sm:text-base">{config.focus}</p><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#647785] sm:text-base">{config.name} is a service area, not a separate office. We work from our Johannesburg base and visit customers by arrangement. Coverage depends on your exact address, the work required and our current schedule.</p><Link href="/areas" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">See all areas we serve <ArrowRight size={17} /></Link></div><div className="rounded-[30px] border border-[#B8F4F5] bg-[#EBFBFA] p-7 sm:p-9"><MapPin size={28} className="text-[#079BC5]" /><p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#079BC5]">Service area</p><h3 className="mt-2 text-3xl font-extrabold">{config.name}</h3><p className="mt-4 text-sm leading-relaxed text-[#647785]">Tell us your suburb or address, property type and a short description of the pool or outdoor work. We will confirm whether we can assist and advise if an assessment is needed.</p><Link href="/contact?area=check#enquiry" className="cms-button mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Enquire about your property <ArrowUpRight size={17} /></Link></div></section>

    <section className="px-3 sm:px-6 lg:px-8 xl:px-12"><div className="mx-auto max-w-[1360px] rounded-[32px] bg-[#10283F] px-7 py-14 text-white sm:px-12 sm:py-16"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">Available services</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">How we can help in {config.name}.</h2><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map(service => <Link key={service.id} href={`/services#${service.id}`} className="group rounded-[22px] border border-white/20 bg-white/10 p-6 transition-colors hover:bg-white/20"><h3 className="text-xl font-extrabold">{service.title.trim().replace(/\.$/, '')}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">{service.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#B8F4F5]">View service <ArrowUpRight size={16} /></span></Link>)}</div></div></section>

    <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-24"><div className="mb-9 max-w-2xl"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Booking a visit</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">How to arrange a visit in {config.name}.</h2><p className="mt-5 text-sm leading-relaxed text-[#647785] sm:text-base">We confirm coverage and availability before arranging a visit. The exact work and any assessment are discussed before a quote is prepared.</p></div><ol className="grid gap-4 md:grid-cols-3">{[['01', 'Share your location', `Tell us your ${config.name} suburb or address and the property type.`], ['02', 'Describe the work', 'Explain the pool condition, equipment issue or outdoor work, plus any access requirements.'], ['03', 'Confirm the next step', 'We check availability and discuss whether a site assessment or quote is needed.']].map(([number, title, copy]) => <li key={number} className="rounded-[24px] border border-[#B8F4F5] bg-[#EBFBFA] p-6 sm:p-8"><span className="text-2xl font-extrabold text-[#079BC5]">{number}</span><h3 className="mt-4 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#647785]">{copy}</p></li>)}</ol></section>

    {projects.length > 0 && <section className="mx-auto max-w-[1360px] px-6 pb-20 sm:px-10 sm:pb-24"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Work from the gallery</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{config.name} projects.</h2></div><Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">View the gallery <ArrowUpRight size={17} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{projects.map(project => <article key={project.id} className="overflow-hidden rounded-[26px] border border-[#B8F4F5]/60 bg-white shadow-card"><div className="relative aspect-[4/3] bg-[#E0FAFA]"><Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div><div className="p-6"><p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#079BC5]"><MapPin size={14} />{config.name}</p><h3 className="mt-2 text-xl font-extrabold">{project.title.trim()}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#647785]">{project.description?.trim() || `A ${project.title.trim().toLowerCase()} project featured in our ${config.name} gallery.`}</p><Link href="/gallery" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#079BC5] hover:underline">See more work <ArrowUpRight size={16} /></Link></div></article>)}</div></section>}

    <section id="faq" className="mx-auto grid max-w-[1360px] gap-12 px-6 pb-20 sm:px-10 sm:pb-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">{config.name} pool services</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently asked <span className="text-[#079BC5]">questions.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#647785]">Have another question about your pool or property? Contact our team with the details.</p></div><div className="divide-y divide-[#B8F4F5] border-y border-[#B8F4F5]">{config.faqs.map(({ question, answer }) => <details key={question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-bold marker:content-none sm:text-lg"><span>{question}</span><ChevronDown size={21} className="shrink-0 text-[#079BC5] transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-[#647785]">{answer}</p></details>)}</div></section>

    <section className="mx-auto max-w-[900px] px-6 pb-16 text-center sm:pb-20"><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Let us come to you</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Planning pool work in {config.name}?</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#647785] sm:text-base">Send us your address and a short description of the work. We will confirm availability and help you decide the right next step.</p><Link href="/contact?area=check#enquiry" className="cms-button mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Discuss your project <ArrowUpRight size={17} /></Link></section>
    <Footer cmsData={cmsData} />
  </main>;
}
