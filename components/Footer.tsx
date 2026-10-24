'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface FooterProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

export default function Footer({ cmsData }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = cmsData.contactSection?.phone || cmsData.footer?.phone || cmsData.branding?.telephone || '067 933 0920';
  const email = cmsData.contactSection?.email || cmsData.footer?.email || cmsData.branding?.emailAddress || 'hello@royelpool.co.za';
  const logoSrc =
    cmsData.branding.footerLogoUrl || cmsData.branding.logoUrl || '/assets/royel-pool-logo.png';

  return (
    <footer
      className="relative w-full bg-white border-t border-[#7dd3fc] mt-12 sm:mt-16 overflow-hidden select-none"
      data-purpose="site-footer"
    >
      {/* Inner Content Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-6">
        {/* 4-Column Responsive Grid with Light Cyan Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1.1fr_1.2fr] gap-10 lg:gap-0 items-start">
          {/* Column 1: Brand & Tagline */}
          <div className="lg:pr-10 lg:border-r lg:border-[#bae6fd]/80 flex flex-col items-start">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-5">
              <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                <Image
                  src={logoSrc}
                  alt={cmsData.branding.companyName}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <span className="break-words text-base sm:text-lg font-extrabold tracking-tight text-[#172638]">
                {cmsData.branding.companyName}
              </span>
            </div>

            {/* Tagline Paragraph */}
            <p className="text-xl sm:text-2xl font-medium text-[#172638] leading-snug">
              {cmsData.footer?.taglineLine1 || 'Thoughtfully designed pools.'}
              <br />
              {cmsData.footer?.taglineLine2 || 'Built for the way you live.'}
            </p>

            {/* Cyan Accent Rule */}
            <div className="w-16 h-[2px] bg-[#38bdf8] my-5 rounded-full" />

            {/* Sub-tagline */}
            <p className="text-sm font-medium text-[#172638]/80">
              {cmsData.footer?.servicesTagline || 'Pool design · Construction · Care'}
            </p>
          </div>

          {/* Column 2: EXPLORE */}
          <div className="lg:px-10 lg:border-r lg:border-[#bae6fd]/80 flex flex-col items-start">
            <h4 className="text-xs font-bold tracking-[0.28em] text-[#0ea5e9] uppercase mb-6">
              Explore
            </h4>
            <ul className="space-y-3.5 text-base font-normal text-[#172638]">
              <li>
                <Link href="/about" className="hover:text-[#0ea5e9] transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#0ea5e9] transition-colors">
                  Swimming pools
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#0ea5e9] transition-colors">
                  Our work
                </Link>
              </li>
              <li>
                <Link href="/services#faq" className="hover:text-[#0ea5e9] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact#enquiry"
                  className="hover:text-[#0ea5e9] transition-colors text-left cursor-pointer"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SERVICES */}
          <div className="lg:px-10 lg:border-r lg:border-[#bae6fd]/80 flex flex-col items-start">
            <h4 className="text-xs font-bold tracking-[0.28em] text-[#0ea5e9] uppercase mb-6">
              Services
            </h4>
            <ul className="space-y-3.5 text-base font-normal text-[#172638]">
              <li>
                <Link href="/services#service-1"
                  className="hover:text-[#0ea5e9] transition-colors text-left cursor-pointer"
                >
                  New pool construction
                </Link>
              </li>
              <li>
                <Link href="/services#service-2"
                  className="hover:text-[#0ea5e9] transition-colors text-left cursor-pointer"
                >
                  Pool renovations
                </Link>
              </li>
              <li>
                <Link href="/services#service-3"
                  className="hover:text-[#0ea5e9] transition-colors text-left cursor-pointer"
                >
                  Pool maintenance
                </Link>
              </li>
              <li>
                <Link href="/services#service-4"
                  className="hover:text-[#0ea5e9] transition-colors text-left cursor-pointer"
                >
                  Equipment installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: LET'S TALK POOLS */}
          <div className="lg:pl-10 flex flex-col items-start">
            <h4 className="text-xs font-bold tracking-[0.28em] text-[#0ea5e9] uppercase mb-6">
              Let&apos;s Talk Pools
            </h4>

            {/* Phone */}
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-base text-[#172638] hover:text-[#0ea5e9] transition-colors group mb-4"
            >
              <Phone className="w-5 h-5 text-[#0ea5e9] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-medium">{phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-base text-[#172638] hover:text-[#0ea5e9] transition-colors group mb-7"
            >
              <Mail className="w-5 h-5 text-[#0ea5e9] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-medium">{email}</span>
            </a>

            {/* Plan Your Pool CTA Button */}
            <Link href="/contact#enquiry"
              className="cms-button-outline inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border-2 transition-all duration-300 font-semibold text-base shadow-xs hover:shadow-md cursor-pointer group"
            >
              <span>{cmsData.footer?.ctaButtonLabel || 'Plan your pool'}</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-full border-t border-[#7dd3fc]/60 mt-12 mb-6" />

        {/* Legal & Social Links Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-[#475569] gap-4 py-2">
          {/* Copyright */}
          <p className="font-normal text-center md:text-left">
            © {currentYear} {cmsData.branding?.companyName || 'Royel Pool'}. All rights reserved.
          </p>

          {/* Privacy & Terms */}
          <div className="flex items-center gap-3">
            <Link href="/contact#enquiry-privacy" className="hover:text-[#0ea5e9] transition-colors">
              Enquiry privacy
            </Link>
            <span className="text-[#94a3b8]">|</span>
            <Link href="/contact" className="hover:text-[#0ea5e9] transition-colors">
              Contact
            </Link>
          </div>

          {/* Socials & Admin */}
          <div className="flex items-center gap-3">
            {cmsData.branding.instagramUrl && !/^https?:\/\/(www\.)?instagram\.com\/?$/.test(cmsData.branding.instagramUrl) && (<a
              href={cmsData.branding?.instagramUrl || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0ea5e9] transition-colors"
            >
              Instagram
            </a>)}
            <span className="text-[#94a3b8]">|</span>
            {cmsData.branding.facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/?$/.test(cmsData.branding.facebookUrl) && (<a
              href={cmsData.branding?.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0ea5e9] transition-colors"
            >
              Facebook
            </a>)}
          </div>
        </div>
      </div>

      {/* Full-Bleed Pool Water Caustic Strip (Matches mockup footer.png) */}
      <div className="relative w-full h-24 sm:h-32 md:h-40 overflow-hidden select-none pointer-events-none mt-2">
        <Image
          src="/assets/footer-pool-water.png"
          alt="Crystal blue pool water ripple caustic texture"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Soft top gradient blend */}
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      </div>
    </footer>
  );
}
