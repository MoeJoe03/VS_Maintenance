'use client';
import ServiceAreas from './ServiceAreas';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, MapPin } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';
import ProcessSection from './ProcessSection';
import Testimonials from './Testimonials';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import Navbar from './Navbar';
import BeforeAfterSlider from './BeforeAfterSlider';

const serviceDetails: Record<string, { eyebrow: string; included: string[] }> = {
  'service-1': {
    eyebrow: '01 / DESIGN & BUILD',
    included: ['Site consultation and planning', 'Custom pool design and layout', 'Construction and waterproofing', 'Finishes, fittings and final handover'],
  },
  'service-2': {
    eyebrow: '02 / REPAIR & RESTORE',
    included: ['Pool condition assessment', 'Leak and fault investigation', 'Surface, tile and structural repairs', 'Restoration recommendations'],
  },
  'service-3': {
    eyebrow: '03 / ONGOING CARE',
    included: ['Water testing and chemical balancing', 'Vacuuming and surface cleaning', 'Filter cleaning and backwashing', 'Equipment and water condition checks'],
  },
  'service-4': {
    eyebrow: '04 / EQUIPMENT',
    included: ['Equipment assessment and recommendations', 'Pump and filtration installation', 'Heating, chlorination and lighting options', 'Setup and operation guidance'],
  },
};

const faqs = [
  { q: 'How do I know which service my pool needs?', a: 'Tell us what you are planning or what is going wrong. We will discuss the pool, arrange an assessment where needed, and recommend the right scope before work begins.' },
  { q: 'Can you tailor a maintenance plan to my pool?', a: 'Yes. The visit frequency and tasks depend on your pool size, equipment, water condition and usage. Contact us for a plan suited to your pool.' },
  { q: 'Do you repair existing pools as well as build new ones?', a: 'Yes. We work on new pool projects and existing pools, including repairs, restoration, ongoing care and equipment installation.' },
  { q: 'Will I receive a quote before work starts?', a: 'Yes. After we understand the project and any site conditions, we can outline the recommended work and provide a quote for your review.' },
  { q: 'Do you service my area?', a: 'Sandton is our primary service area. We also serve Fourways, Germiston, Morningside, Midrand, Bedfordview, Benoni, Sunninghill, Centurion, Edenvale, Rosebank, Bryanston, Houghton Estate, Kempton Park, Randburg and Kyalami.' },
];

export default function ClientServicesPage({ initialData }: { initialData: CMSData }) {
  const [cmsData, setCmsData] = useState(initialData);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Building New Pools');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/cms').then((res) => res.json()).then((payload) => {
      if (payload?.success && payload?.data) setCmsData(payload.data);
    }).catch(() => {});
  }, []);

  const openQuote = (service?: string) => {
    if (service) setSelectedService(service.replace(/\.$/, ''));
    window.location.assign('/contact#enquiry');
  };
  const theme = {
    '--cms-button-background': cmsData.branding.primaryBrandColor,
    '--cms-button-text': cmsData.branding.buttonTextColor,
    '--cms-button-hover': cmsData.branding.buttonHoverColor,
    '--cms-accent-text': cmsData.branding.accentTextColor,
  } as React.CSSProperties;
  const location = cmsData.contactSection?.location || 'Sandton, South Africa';

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#172638]" style={theme}>
      <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12">
        <header className="relative flex h-[calc(100dvh-1rem)] min-h-[640px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] sm:h-[calc(100dvh-1.5rem)] md:rounded-[36px]">
          <Image data-parallax-image src="/assets/hero_service.png" alt="Sunset over a swimming pool with underwater steps" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[#0A1A2B]/45" />
          <Navbar cmsData={cmsData} />
          <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center text-white sm:px-10">
            <span className="hero-pop mb-5 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">Crafted for your pool</span>
            <h1 className="hero-pop hero-pop-delay-1 max-w-3xl text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Everything your pool needs, <span className="text-[#B8F4F5]">beautifully handled.</span></h1>
            <p className="hero-pop hero-pop-delay-2 mt-6 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">From the first design conversation to years of clear water, our team brings thoughtful workmanship to every stage of pool ownership.</p>
            <div className="hero-pop hero-pop-delay-3 mt-8 flex flex-wrap justify-center gap-3"><button onClick={() => openQuote()} className="cms-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg">Request a Quote <ArrowUpRight size={17} /></button><a href="#all-services" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">Explore Services <ArrowDown size={17} /></a></div>
          </div>
        </header>
      </div>

      <section id="all-services" className="mx-auto max-w-[1440px] px-6 pb-8 pt-20 sm:px-10 sm:pb-10 sm:pt-24 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Our expertise</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">All our services<span className="text-[#079BC5]">.</span></h2></div><p className="max-w-md text-sm leading-relaxed text-[#647785] sm:text-base">{cmsData.services.description}</p></div>
        <div className="divide-y divide-[#B8F4F5]/70 border-y border-[#B8F4F5]/70">
          {cmsData.services.items.map((service, index) => {
            const detail = serviceDetails[service.id];
            return <article id={service.id} key={service.id} className="group grid items-center gap-7 py-10 sm:gap-10 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
              {service.id === 'green-pool-treatments' ? <div className={index % 2 === 1 ? 'lg:order-2' : ''}><BeforeAfterSlider before={service.image} after={service.afterImage} /></div> : <div className={`relative aspect-[1.45] min-h-[230px] overflow-hidden rounded-[26px] bg-[#E0FAFA] shadow-card sm:aspect-[1.6] ${index % 2 === 1 ? 'lg:order-2' : ''}`}><Image src={service.image} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" /></div>}
              <div className={`max-w-xl ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">{detail?.eyebrow || `0${index + 1} / SERVICE`}</span>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172638] sm:text-4xl">{service.title.replace(/\.$/, '')}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#647785] sm:text-base">{service.description}</p>
                <h4 className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[#079BC5]">What&apos;s included</h4>
                <ul className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">{(service.included || detail?.included || ['A tailored assessment', 'A clear scope of work', 'Professional service', 'Care guidance']).map((item) => <li key={item} className="flex items-start gap-2.5 text-sm text-[#172638]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E0FAFA] text-[#079BC5]"><Check size={13} strokeWidth={3} /></span>{item}</li>)}</ul>
                <button onClick={() => openQuote(service.title)} className="cms-button mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all hover:shadow-lg">Enquire about this service <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20"><ArrowRight size={15} /></span></button>
              </div>
            </article>;
          })}
        </div>
        <p className="mt-6 text-center text-xs text-[#647785]">The exact scope is tailored to your pool and confirmed in your quote.</p>
      </section>

      <div className="px-3 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 xl:px-12"><ProcessSection cmsData={cmsData} onOpenQuote={() => openQuote()} /></div>

      <Testimonials cmsData={cmsData} />

      <section id="faq" className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Good to know</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently asked <span className="text-[#079BC5]">questions.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#647785]">Have something else in mind? Tell us about your pool and we&apos;ll help you find the right next step.</p><button onClick={() => openQuote()} className="cms-button mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Ask us a question <ArrowUpRight size={16} /></button></div><div className="divide-y divide-[#B8F4F5] border-y border-[#B8F4F5]">{faqs.map((faq, index) => <div key={faq.q}><button type="button" className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-bold text-[#172638] sm:text-lg" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{faq.q}</span><ChevronDown size={21} className={`shrink-0 text-[#079BC5] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-[#647785]">{faq.a}</p>}</div>)}</div></section>

      <section id="areas" className="px-3 pb-4 sm:px-6 lg:px-8 xl:px-12"><div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[#10283F] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16"><div className="absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#35D4DB]/15 blur-3xl" /><div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]"><div><p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">Where we work</p><h2 className="max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">Pool care close to home.</h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">Sandton is our primary service area. We also serve the locations listed below. Service availability depends on your address and the work required.</p><button onClick={() => openQuote()} className="cms-button mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold">Check your area <ArrowUpRight size={16} /></button></div><div className="rounded-[26px] border border-white/20 bg-white/10 p-7 backdrop-blur-sm sm:p-9"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#35D4DB]/20 text-[#B8F4F5]"><MapPin size={25} /></div><p className="text-xs font-bold uppercase tracking-widest text-[#B8F4F5]">Primary service area</p><p className="mt-2 text-2xl font-extrabold">Sandton</p><div className="my-6 border-t border-white/20" /><p className="text-xs font-bold uppercase tracking-widest text-[#B8F4F5]">Also serving</p><ServiceAreas dark /><p className="mt-4 text-sm leading-relaxed text-white/70">Share your suburb or address when you enquire and we&apos;ll confirm whether we can come to you.</p></div></div></div></section>

      <Footer cmsData={cmsData} onOpenQuote={() => openQuote()} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} cmsData={cmsData} initialService={selectedService} />
    </main>
  );
}
