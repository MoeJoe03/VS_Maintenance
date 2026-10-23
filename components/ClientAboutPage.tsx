'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import AboutApproachSection from './AboutApproachSection';
import AboutDetailsSection from './AboutDetailsSection';
import AboutHero from './AboutHero';
import AboutBusinessStory from './AboutBusinessStory';
import AboutWhatWeDoMosaic from './AboutWhatWeDoMosaic';

export default function ClientAboutPage({ initialData }: { initialData: CMSData }) {
  const [cmsData, setCmsData] = useState(initialData);
  const [quoteOpen, setQuoteOpen] = useState(false);
  useEffect(() => {
    fetch('/api/cms').then((res) => res.json()).then((payload) => {
      if (payload?.success && payload?.data) setCmsData(payload.data);
    }).catch(() => {});
  }, []);


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
    <AboutBusinessStory />

    <AboutApproachSection cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} />

    <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-28"><div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Work you can see</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">A closer look at our projects.</h2></div><p className="max-w-md text-sm leading-relaxed text-[#647785]">Explore pool repair and transformation examples from the site gallery. The project cards link to the full collection.</p></div><div className="grid gap-6 md:grid-cols-3">{projects.map((project) => <Link href="/#gallery" key={project.id} className="group overflow-hidden rounded-[26px] border border-[#B8F4F5]/60 bg-white shadow-card"><div className="relative h-64 overflow-hidden bg-[#E0FAFA]"><Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6"><span className="text-[11px] font-extrabold uppercase tracking-widest text-[#079BC5]">{project.category}</span><h3 className="mt-2 text-xl font-extrabold">{project.title.trim()}</h3><p className="mt-3 flex items-center gap-1.5 text-sm text-[#647785]"><MapPin size={15} />{project.location}</p></div></Link>)}</div><Link href="/#gallery" className="mt-8 inline-flex items-center gap-2 font-bold text-[#079BC5] hover:underline">View the full gallery <ArrowRight size={17} /></Link></section>



    <AboutDetailsSection location={location} onOpenQuote={() => window.location.assign('/contact#enquiry')} />
    <Footer cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} />
    <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} cmsData={cmsData} initialService="Building New Pools" />
  </main>;
}
