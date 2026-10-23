'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import AboutApproachSection from './AboutApproachSection';
import AboutDetailsSection from './AboutDetailsSection';
import AboutHero from './AboutHero';
import AboutWhatWeDoMosaic from './AboutWhatWeDoMosaic';

export default function ClientAboutPage({ initialData }: { initialData: CMSData }) {
  const [cmsData, setCmsData] = useState(initialData);
  const [quoteOpen, setQuoteOpen] = useState(false);
  useEffect(() => {
    fetch('/api/cms').then((res) => res.json()).then((payload) => {
      if (payload?.success && payload?.data) setCmsData(payload.data);
    }).catch(() => {});
  }, []);

  const name = cmsData.branding.companyName.trim();
  const location = cmsData.contactSection?.location || 'Sandton, South Africa';
  const projects = cmsData.gallery.items.filter((item) => item.imageUrl.startsWith('/uploads/')).slice(0, 3);
  const theme = {
    '--cms-button-background': cmsData.branding.primaryBrandColor,
    '--cms-button-text': cmsData.branding.buttonTextColor,
    '--cms-button-hover': cmsData.branding.buttonHoverColor,
    '--cms-accent-text': cmsData.branding.accentTextColor,
  } as React.CSSProperties;

  return <main className="min-h-screen overflow-x-clip bg-white text-[#172638]" style={theme}>
    <AboutHero cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} />

    <AboutWhatWeDoMosaic cmsData={cmsData} />

    <AboutApproachSection cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} />

    <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-28"><div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Work you can see</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">A closer look at our projects.</h2></div><p className="max-w-md text-sm leading-relaxed text-[#647785]">Explore pool repair and transformation examples from the site gallery. The project cards link to the full collection.</p></div><div className="grid gap-6 md:grid-cols-3">{projects.map((project) => <Link href="/#gallery" key={project.id} className="group overflow-hidden rounded-[26px] border border-[#B8F4F5]/60 bg-white shadow-card"><div className="relative h-64 overflow-hidden bg-[#E0FAFA]"><Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6"><span className="text-[11px] font-extrabold uppercase tracking-widest text-[#079BC5]">{project.category}</span><h3 className="mt-2 text-xl font-extrabold">{project.title.trim()}</h3><p className="mt-3 flex items-center gap-1.5 text-sm text-[#647785]"><MapPin size={15} />{project.location}</p></div></Link>)}</div><Link href="/#gallery" className="mt-8 inline-flex items-center gap-2 font-bold text-[#079BC5] hover:underline">View the full gallery <ArrowRight size={17} /></Link></section>

    <section className="px-3 pb-6 sm:px-6 lg:px-8 xl:px-12"><div className="mx-auto grid max-w-[1360px] gap-10 rounded-[32px] bg-[#10283F] p-7 text-white sm:p-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-16"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">The people behind the work</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Meet the team through the work we do.</h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{name} is the team behind the pool projects and services shown here. Tell us what you are planning or what needs attention, and we will connect you with the right person to discuss the next step.</p><button onClick={() => window.location.assign('/contact#enquiry')} className="cms-button mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold">Speak with our team <ArrowUpRight size={16} /></button></div><div className="rounded-[26px] border border-white/20 bg-white/10 p-7 sm:p-9"><p className="text-xs font-extrabold uppercase tracking-widest text-[#B8F4F5]">At a glance</p><ul className="mt-6 space-y-5">{['New pool construction', 'Existing pool repairs', 'Regular maintenance', 'Equipment installation'].map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#35D4DB]/20 text-[#B8F4F5]"><Check size={15} /></span>{item}</li>)}</ul><div className="my-7 border-t border-white/20" /><p className="flex items-start gap-3 text-sm text-white/75"><MapPin size={18} className="shrink-0 text-[#B8F4F5]" />Based in {location}. Send us your address to confirm service availability.</p></div></div></section>

    <AboutDetailsSection location={location} onOpenQuote={() => window.location.assign('/contact#enquiry')} />
    <Footer cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} />
    <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} cmsData={cmsData} initialService="Building New Pools" />
  </main>;
}
