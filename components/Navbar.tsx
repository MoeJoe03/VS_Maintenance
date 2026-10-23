'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface NavbarProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

export default function Navbar({ cmsData, onOpenQuote }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const companyNameWords = cmsData.branding.companyName.trim().split(/\s+/).filter(Boolean);
  const displayCompanyNameWords = companyNameWords.length ? companyNameWords : ['Royel', 'Pool'];

  return (
    <nav
      aria-label="Main Navigation"
      className="absolute top-0 inset-x-0 z-20 px-6 sm:px-10 py-6 flex items-center justify-between"
    >
      {/* Brand Logo */}
      <Link
        href="#home"
        aria-label={`${cmsData.branding.companyName} Home`}
        className="flex items-center gap-2 group"
      >
        {cmsData.branding.logoUrl ? (
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border border-white/40 shadow-sm bg-white/10 backdrop-blur-md">
            <Image
              src={cmsData.branding.logoUrl}
              alt={cmsData.branding.companyName}
              fill
              className="object-contain p-1"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#079BC5]/20 backdrop-blur-md flex items-center justify-center p-2 border border-white/40 shadow-sm">
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M2 12c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
              <path d="M2 17c3-2 6-2 9 0s6 2 9 0 3-2 3-2" />
            </svg>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight drop-shadow-sm font-sans flex items-center gap-1">
            {displayCompanyNameWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                style={{
                  color:
                    cmsData.branding.companyNameWordColors?.[index] ||
                    (index === 0 ? '#ffffff' : '#B8F4F5'),
                }}
              >
                {word}
              </span>
            ))}
          </span>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-white drop-shadow-sm">
        <li>
          <a
            href="#home"
            className="text-[#B8F4F5] hover:text-white transition-colors duration-200 underline underline-offset-8 decoration-2 decoration-[#35D4DB]"
          >
            Home
          </a>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-[#B8F4F5] transition-colors duration-200"
          >
            About
          </Link>
        </li>
        <li>
          <Link href="/services" className="hover:text-[#B8F4F5] transition-colors duration-200">
            Services
          </Link>
        </li>
        <li>
          <a href="/gallery" className="hover:text-[#B8F4F5] transition-colors duration-200">
            Our Work
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-[#B8F4F5] transition-colors duration-200">
            Contact
          </a>
        </li>
      </ul>


      {/* Mobile Toggle */}
      <div className="flex items-center gap-3">
<button type="button" onClick={onOpenQuote} className="cms-button hidden shrink-0 items-center justify-center rounded-full px-6 py-3 text-sm font-bold shadow-md transition-shadow hover:shadow-lg md:inline-flex">Free Quote</button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/40"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full inset-x-4 mt-2 p-5 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white flex flex-col gap-4 text-[#172638] animate-fade-in z-30">
          <ul className="flex flex-col gap-3 font-semibold text-sm">
            <li>
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-[#079BC5]"
              >
                Home
              </a>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-[#079BC5]"
              >
                About
              </Link>
            </li>
            <li>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#079BC5]">
                Services
              </Link>
            </li>
            <li>
              <a href="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#079BC5]">
                Our Work
              </a>
            </li>
            <li>
              <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#079BC5]">
                Contact
              </a>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="cms-button w-full py-2.5 rounded-full text-xs font-bold text-center"
            >
              Request a Quote
            </button>
            <div className="flex items-center justify-around pt-2 text-xs text-[#647785]">
              <a
                href={`tel:${cmsData.branding.telephone}`}
                className="flex items-center gap-1 hover:text-[#079BC5]"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${cmsData.branding.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#079BC5]"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
