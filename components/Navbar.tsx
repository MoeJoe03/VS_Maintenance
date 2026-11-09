'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Phone, MessageSquare, ChevronDown, MapPin } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

const links = [{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/services', label: 'Services' }, { href: '/areas', label: 'Areas We Serve' }, { href: '/gallery', label: 'Our Work' }, { href: '/contact', label: 'Contact' }];
const areaLinks = [{ href: '/areas', label: 'All areas we serve' }, { href: '/areas/sandton', label: 'Sandton' }, { href: '/areas/bryanston', label: 'Bryanston' }, { href: '/areas/morningside', label: 'Morningside' }, { href: '/areas/sunninghill', label: 'Sunninghill' }, { href: '/areas/kempton-park', label: 'Kempton Park' }, { href: '/areas/centurion', label: 'Centurion' }];
export default function Navbar({ cmsData }: { cmsData: CMSData; onOpenQuote?: () => void }) {
  const [open, setOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const previousScrollY = useRef(0);
  const areasRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const menuId = useId();
  const areasMenuId = useId();
  const mobileAreasMenuId = useId();
  const isAreaPage = pathname === '/areas' || pathname.startsWith('/areas/');
  const words = cmsData.branding.companyName.trim().split(/\s+/);
  const phone = cmsData.branding.telephone;
  const rawWhatsapp = cmsData.branding.whatsappNumber.replace(/\D/g, '');
  const whatsapp = rawWhatsapp.startsWith('0') ? `27${rawWhatsapp.slice(1)}` : rawWhatsapp;
  useEffect(() => {
    previousScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - previousScrollY.current;
      if (open) {
        setVisible(true);
        previousScrollY.current = currentY;
        return;
      }
      if (currentY < 30) {
        setVisible(true);
        setScrolled(false);
      }
      else if (Math.abs(difference) > 3) {
        const movingUp = difference < 0;
        setVisible(movingUp);
        setScrolled(movingUp && currentY > 70);
        previousScrollY.current = currentY;
      }
      if (currentY < 30) previousScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    if (!areasOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (areasRef.current && !areasRef.current.contains(event.target as Node)) setAreasOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [areasOpen]);

  return <nav aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); setAreasOpen(false); setMobileAreasOpen(false); } }} className={`${scrolled ? 'liquid-glass-nav' : 'bg-transparent'} fixed inset-x-3 top-2 z-[100] flex items-center justify-between gap-4 rounded-[26px] px-5 py-3 text-white transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out sm:inset-x-6 sm:top-3 sm:px-8 lg:inset-x-8 xl:inset-x-12`} style={{ transform: visible ? 'translateY(0)' : 'translateY(calc(-100% - 24px))' }}>
    <Link href="/" aria-label={`${cmsData.branding.companyName.trim()} home`} onClick={() => setOpen(false)} className="flex max-w-[75%] items-center gap-2 lg:max-w-[30%]">
      {cmsData.branding.logoUrl && <span className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14"><Image src={cmsData.branding.logoUrl} alt="" fill className="scale-[1.25] object-contain" /></span>}
      <span className="text-lg font-extrabold leading-tight tracking-tight sm:text-xl">{words.map((word,index) => <span key={`${word}-${index}`} style={{ color: cmsData.branding.companyNameWordColors?.[index] || (index === 0 ? '#ffffff' : '#B8F4F5') }}>{word}{index < words.length - 1 ? ' ' : ''}</span>)}</span>
    </Link>
    <div className="hidden items-center gap-6 text-sm font-semibold text-white lg:flex">{links.map(link => link.href === '/areas' ? <div key={link.href} ref={areasRef} className="relative" onMouseEnter={() => setAreasOpen(true)} onMouseLeave={() => setAreasOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAreasOpen(false); }}><button type="button" onClick={() => setAreasOpen(true)} aria-expanded={areasOpen} aria-controls={areasMenuId} className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#B8F4F5] ${isAreaPage ? 'text-[#B8F4F5] underline decoration-[#35D4DB] decoration-2 underline-offset-8' : ''}`}>Areas We Serve <ChevronDown size={15} className={`transition-transform ${areasOpen ? 'rotate-180' : ''}`} /></button>{areasOpen && <div id={areasMenuId} className="absolute left-1/2 top-full z-[110] w-60 -translate-x-1/2 pt-4"><div className="rounded-[20px] border border-[#B8F4F5]/70 bg-white p-2 text-[#172638] shadow-2xl">{areaLinks.map(area => <Link key={area.href} href={area.href} aria-current={pathname === area.href ? 'page' : undefined} onClick={() => setAreasOpen(false)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${pathname === area.href ? 'bg-[#EBFBFA] text-[#079BC5]' : 'hover:bg-[#EBFBFA] hover:text-[#079BC5]'}`}><MapPin size={14} className="shrink-0" />{area.label}</Link>)}</div></div>}</div> : <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className={pathname === link.href ? 'text-[#B8F4F5] underline decoration-[#35D4DB] decoration-2 underline-offset-8' : 'transition-colors hover:text-[#B8F4F5]'}>{link.label}</Link>)}</div>
    <Link href="/contact#enquiry" className="cms-button hidden shrink-0 rounded-full px-6 py-3 text-sm font-bold shadow-md lg:inline-flex">Free Quote</Link>
    <button type="button" onClick={() => { setOpen(!open); if (open) setMobileAreasOpen(false); }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls={menuId} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md lg:hidden">{open ? <X size={21} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 6c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg>}</button>
    {open && <div id={menuId} style={{ textShadow: 'none' }} className="absolute inset-x-4 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-[24px] border border-white bg-white p-5 text-[#172638] shadow-2xl lg:hidden">
      <div className="flex flex-col gap-2 text-sm font-semibold">{links.map(link => link.href === '/areas' ? <div key={link.href}><button type="button" onClick={() => setMobileAreasOpen(!mobileAreasOpen)} aria-expanded={mobileAreasOpen} aria-controls={mobileAreasMenuId} className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left ${isAreaPage ? 'bg-[#EBFBFA] text-[#079BC5]' : 'hover:bg-slate-50'}`}>Areas We Serve <ChevronDown size={17} className={`transition-transform ${mobileAreasOpen ? 'rotate-180' : ''}`} /></button>{mobileAreasOpen && <div id={mobileAreasMenuId} className="ml-3 mt-1 flex flex-col gap-1 border-l-2 border-[#B8F4F5] pl-3">{areaLinks.map(area => <Link key={area.href} href={area.href} onClick={() => { setOpen(false); setMobileAreasOpen(false); }} aria-current={pathname === area.href ? 'page' : undefined} className={`rounded-lg px-2 py-2 ${pathname === area.href ? 'bg-[#EBFBFA] text-[#079BC5]' : 'hover:bg-slate-50'}`}>{area.label}</Link>)}</div>}</div> : <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? 'page' : undefined} className={`rounded-lg px-2 py-2 ${pathname === link.href ? 'bg-[#EBFBFA] text-[#079BC5]' : 'hover:bg-slate-50'}`}>{link.label}</Link>)}</div>
      <div className="mt-3 border-t border-slate-100 pt-4"><Link href="/contact#enquiry" onClick={() => setOpen(false)} className="cms-button block rounded-full px-5 py-3 text-center text-sm font-bold">Free Quote</Link><div className="mt-4 flex justify-around text-xs font-semibold text-[#647785]"><a href={`tel:${phone.replace(/\s+/g,'')}`} className="flex items-center gap-2 py-2"><Phone size={16} />Call</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2"><MessageSquare size={16} />WhatsApp</a></div></div>
    </div>}
  </nav>;
}
