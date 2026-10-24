'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Phone, MessageSquare } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

const links = [{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/services', label: 'Services' }, { href: '/gallery', label: 'Our Work' }, { href: '/contact', label: 'Contact' }];
export default function Navbar({ cmsData }: { cmsData: CMSData; onOpenQuote?: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const words = cmsData.branding.companyName.trim().split(/\s+/);
  const phone = cmsData.contactSection?.phone || cmsData.branding.telephone;
  const rawWhatsapp = cmsData.branding.whatsappNumber.replace(/\D/g, '');
  const whatsapp = rawWhatsapp.startsWith('0') ? `27${rawWhatsapp.slice(1)}` : rawWhatsapp;
  return <nav aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }} className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
    <Link href="/" aria-label={`${cmsData.branding.companyName.trim()} home`} onClick={() => setOpen(false)} className="flex max-w-[75%] items-center gap-2 lg:max-w-[30%]">
      {cmsData.branding.logoUrl && <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white/10 sm:h-14 sm:w-14"><Image src={cmsData.branding.logoUrl} alt="" fill className="object-contain p-1" /></span>}
      <span className="text-lg font-extrabold leading-tight tracking-tight sm:text-xl">{words.map((word,index) => <span key={`${word}-${index}`} style={{ color: cmsData.branding.companyNameWordColors?.[index] || (index === 0 ? '#ffffff' : '#B8F4F5') }}>{word}{index < words.length - 1 ? ' ' : ''}</span>)}</span>
    </Link>
    <div className="hidden items-center gap-6 text-sm font-semibold text-white lg:flex">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className={pathname === link.href ? 'text-[#B8F4F5] underline decoration-[#35D4DB] decoration-2 underline-offset-8' : 'transition-colors hover:text-[#B8F4F5]'}>{link.label}</Link>)}</div>
    <Link href="/contact#enquiry" className="cms-button hidden shrink-0 rounded-full px-6 py-3 text-sm font-bold shadow-md lg:inline-flex">Free Quote</Link>
    <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls={menuId} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md lg:hidden">{open ? <X size={21} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 6c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg>}</button>
    {open && <div id={menuId} className="absolute inset-x-4 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-[24px] border border-white bg-white p-5 text-[#172638] shadow-2xl lg:hidden">
      <div className="flex flex-col gap-2 text-sm font-semibold">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? 'page' : undefined} className={`rounded-lg px-2 py-2 ${pathname === link.href ? 'bg-[#EBFBFA] text-[#079BC5]' : 'hover:bg-slate-50'}`}>{link.label}</Link>)}</div>
      <div className="mt-3 border-t border-slate-100 pt-4"><Link href="/contact#enquiry" onClick={() => setOpen(false)} className="cms-button block rounded-full px-5 py-3 text-center text-sm font-bold">Free Quote</Link><div className="mt-4 flex justify-around text-xs font-semibold text-[#647785]"><a href={`tel:${phone.replace(/\s+/g,'')}`} className="flex items-center gap-2 py-2"><Phone size={16} />Call</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2"><MessageSquare size={16} />WhatsApp</a></div></div>
    </div>}
  </nav>;
}
