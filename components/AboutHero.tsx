'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

export default function AboutHero({ cmsData, onOpenQuote }: { cmsData: CMSData; onOpenQuote: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = cmsData.branding.companyName.trim();
  const location = cmsData.contactSection?.location || 'Sandton, South Africa';

  return <div className="px-3 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:px-12">
    <header className="relative flex h-[calc(100dvh-1rem)] min-h-[640px] flex-col overflow-hidden rounded-[28px] bg-[#10283F] sm:h-[calc(100dvh-1.5rem)] md:rounded-[36px]">
      <Image data-parallax-image src="/assets/about-hero.png" alt="Infinity pool and terrace at sunset" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[#0A1A2B]/45" />
      <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-6 py-6 sm:px-10" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3 text-white">{cmsData.branding.logoUrl && <span className="relative h-12 w-12 overflow-hidden rounded-full border border-white/50 bg-white/10"><Image src={cmsData.branding.logoUrl} alt="" fill className="object-contain" /></span>}<span className="text-lg font-extrabold tracking-tight sm:text-xl">{name}</span></Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-white md:flex"><Link href="/" className="hover:text-[#B8F4F5]">Home</Link><Link href="/about" aria-current="page" className="text-[#B8F4F5] underline decoration-[#35D4DB] decoration-2 underline-offset-8">About</Link><Link href="/services" className="hover:text-[#B8F4F5]">Services</Link><Link href="/gallery" className="hover:text-[#B8F4F5]">Our Work</Link><Link href="/contact" className="hover:text-[#B8F4F5]">Contact</Link></div>
<button type="button" onClick={onOpenQuote} className="cms-button hidden shrink-0 items-center justify-center rounded-full px-6 py-3 text-sm font-bold shadow-md transition-shadow hover:shadow-lg md:inline-flex">Free Quote</button>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/40 bg-white/15 p-2 text-white md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        {menuOpen && <div className="absolute inset-x-4 top-20 flex flex-col gap-4 rounded-2xl bg-white p-6 text-sm font-semibold shadow-xl md:hidden"><Link href="/">Home</Link><Link href="/about" aria-current="page" className="text-[#079BC5]">About</Link><Link href="/services">Services</Link><Link href="/gallery">Our Work</Link><Link href="/contact">Contact</Link></div>}
      </nav>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center text-white sm:px-10"><span className="hero-pop mb-5 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">About {name}</span><h1 className="hero-pop hero-pop-delay-1 max-w-3xl break-words text-[clamp(2.5rem,5vw,60px)] font-extrabold leading-[1.06] tracking-tight">Pool workmanship, <span className="text-[#B8F4F5]">from first plan to everyday care.</span></h1><p className="hero-pop hero-pop-delay-2 mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">{name} builds, repairs and maintains swimming pools for people who want a space that looks good and works well. Our team works from {location}, with service in surrounding communities subject to availability.</p><div className="hero-pop hero-pop-delay-3 mt-8 flex flex-wrap justify-center gap-3"><button onClick={onOpenQuote} className="cms-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg">Tell us about your pool <ArrowUpRight size={17} /></button><Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">Explore services <ArrowRight size={17} /></Link></div></div>
    </header>
  </div>;
}
