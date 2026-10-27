'use client';
import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown, MapPin, ChevronDown } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';
import Footer from './Footer';
import QuoteModal from './QuoteModal';
import Navbar from './Navbar';
import { GALLERY_CATEGORIES } from '@/lib/gallery-categories';

export default function ClientGalleryPage({ cmsData }: { cmsData: CMSData }) {
  const [category, setCategory] = useState('All');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const projects = cmsData.gallery.items.filter(item => item.imageUrl.trim());
  const categories = ['All', ...GALLERY_CATEGORIES];
  const visible = projects.filter(item => category === 'All' || item.category === category);
  const theme = { '--cms-button-background': cmsData.branding.primaryBrandColor, '--cms-button-text': cmsData.branding.buttonTextColor, '--cms-button-hover': cmsData.branding.buttonHoverColor, '--cms-accent-text': cmsData.branding.accentTextColor } as CSSProperties;
  return <main style={theme} className="min-h-screen overflow-x-clip bg-white text-[#172638]">
    <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12">
    <header className="relative flex h-[calc(100dvh-1rem)] min-h-[640px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] text-white sm:h-[calc(100dvh-1.5rem)] md:rounded-[36px]">
      <Image data-parallax-image src="/assets/gallery-hero.png" alt="Swimming pool with waterfall feature" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[#0A1A2B]/45" />
      <Navbar cmsData={cmsData} />
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center sm:px-10"><p className="hero-pop mb-5 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">The project gallery</p><h1 className="hero-pop hero-pop-delay-1 max-w-3xl text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Pools with a story.<br /><span className="text-[#B8F4F5]">Work worth a closer look.</span></h1><p className="hero-pop hero-pop-delay-2 mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">Explore pool repairs and transformations featured by {cmsData.branding.companyName.trim()}. We serve Sandton and the surrounding areas, helping property owners bring their pools back to life.</p><a href="#featured-projects" className="hero-pop hero-pop-delay-3 cms-button mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg">Explore our work <ArrowDown size={17} /></a></div>
    </header>
    </div>
    <section id="featured-projects" className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#079BC5]">Selected work</p><h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Featured projects.</h2></div><p className="max-w-sm text-sm leading-relaxed text-[#647785]">A closer look at the pools, finishes and transformations in our collection.</p></div>
      <div className="my-10"><h2 className="mb-4 text-sm font-bold">Browse by category</h2><div className="flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${category === item ? 'cms-button border-transparent' : 'border-[#B8F4F5] bg-white text-[#647785] hover:bg-[#EBFBFA]'}`}>{item}</button>)}</div></div>
      <div className="columns-2 gap-1 sm:columns-3 lg:columns-4" aria-live="polite">
        {visible.map((project) => <article key={project.id} className="mb-1 break-inside-avoid">
          <button type="button" onClick={() => window.location.assign('/contact#enquiry')} aria-label={`Enquire about ${project.title.trim()}${project.location ? ` in ${project.location}` : ''}`} className={`group relative block w-full overflow-hidden bg-[#E0FAFA] text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#35D4DB] ${project.layoutType === 'stacked-top' ? 'aspect-[4/3]' : project.layoutType === 'stacked-bottom' ? 'aspect-square' : 'aspect-[2/3]'}`}>
            <Image src={project.imageUrl} alt={project.title.trim()} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10283F]/85 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4"><p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#B8F4F5] sm:text-[10px]">{project.category}</p><h3 className="text-xs font-extrabold leading-snug sm:text-sm">{project.title.trim()}</h3>{project.location && <p className="mt-1 flex items-center gap-1 text-[10px] text-white/80 sm:text-xs"><MapPin size={11} className="shrink-0" />{project.location}</p>}</div>
          </button>
        </article>)}
      </div>
    </section>
    <section className="mx-3 rounded-[32px] bg-[#10283F] px-7 py-14 text-white sm:mx-6 sm:px-12 lg:mx-12"><div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-2"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#B8F4F5]">About the work</p><h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Thoughtful work.<br />Lasting enjoyment.</h2></div><div><p className="text-base leading-relaxed text-white/75">Every project starts with the pool, the property and what its owner needs. We discuss the condition and intended use, recommend a scope, and plan the construction, repairs or care around those requirements.</p><Link href="/services" className="mt-7 inline-flex items-center gap-2 font-bold text-[#B8F4F5]">Explore our services <ArrowUpRight size={18} /></Link></div></div></section>
    <section className="mx-auto grid max-w-[1360px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2"><h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Frequently asked<br /><span className="text-[#079BC5]">questions.</span></h2><div>{[['Can you help with a pool like mine?', 'Tell us about your existing pool or planned project. We offer construction, repairs, maintenance and equipment installation, with the scope tailored to your requirements.'], ['Where do you work?', 'Sandton is our primary service area. We also serve Fourways, Germiston, Morningside, Midrand, Bedfordview, Benoni, Sunninghill, Centurion, Edenvale, Rosebank, Bryanston, Houghton Estate, Kempton Park, Randburg and Kyalami.'], ['How much will my project cost?', 'Pricing depends on the pool, condition, materials and scope. Contact us with your requirements so we can discuss an assessment and quote.'], ['Can I use these images?', 'Please contact the team before reproducing gallery images so usage permission can be confirmed.']].map(([q,a]) => <details key={q} className="group border-b border-[#B8F4F5] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold">{q}<ChevronDown size={18} className="shrink-0 text-[#079BC5] group-open:rotate-180" /></summary><p className="mt-4 text-sm leading-relaxed text-[#647785]">{a}</p></details>)}</div></section>
    <section className="mx-auto max-w-[1000px] px-6 pb-16 text-center"><h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Have a pool project in mind?</h2><p className="mt-5 text-[#647785]">Tell us what you want to build, restore or improve.</p><button onClick={() => window.location.assign('/contact#enquiry')} className="cms-button mt-7 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold">Discuss your project <ArrowUpRight size={18} /></button></section>
    <Footer cmsData={cmsData} onOpenQuote={() => window.location.assign('/contact#enquiry')} /><QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} cmsData={cmsData} initialService="Building New Pools" />
  </main>;
}
