'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from './Navbar';
import { CMSData } from '@/lib/cms-types';

interface HeroProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

export default function Hero({ cmsData, onOpenQuote }: HeroProps) {
  return (
    <header
      id="home"
      className="relative rounded-[28px] md:rounded-[36px] overflow-visible shadow-elevated bg-white border border-white/80 w-full"
      data-purpose="hero-banner"
    >
      <div className="relative rounded-[28px] md:rounded-[36px] overflow-hidden h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] min-h-[600px] w-full">
        {/* Background Image with Luxury Villa & Crystal Pool */}
        <Image
          data-parallax-image src={cmsData.hero.backgroundImage}
          alt="Luxury modern tropical villa with crystal blue infinity swimming pool"
          fill
          priority
          className="object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Atmospheric soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Navigation Bar */}
        <Navbar cmsData={cmsData} onOpenQuote={onOpenQuote} />

        {/* Floating Glass/White Headline Card (Bottom Left) */}
        <div className="absolute bottom-16 left-6 sm:bottom-12 sm:left-10 z-20 max-w-md w-[calc(100%-3rem)] sm:w-auto">
          <div className="bg-white/95 backdrop-blur-md p-7 sm:p-9 rounded-[28px] shadow-2xl border border-white flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172638] leading-[1.15] tracking-tight">
              {cmsData.hero.headlinePrefix}{' '}
              <span className="text-[#079BC5]">
                {cmsData.hero.headlineHighlight}
                <Image
                  src="/assets/dark-blue-isometric-pool.svg"
                  alt="Isometric swimming pool"
                  width={60}
                  height={40}
                  className="ml-2 inline-block h-8 w-12 object-contain align-middle sm:h-10 sm:w-14"
                />
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#647785] leading-relaxed">
              {cmsData.hero.supportingText}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenQuote}
                className="cms-button inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {cmsData.hero.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge with rotating message */}
      <div className="absolute -bottom-8 left-1/2 z-30 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-xl sm:h-28 sm:w-28">
        <svg className="spin-slow pointer-events-none absolute inset-0 h-full w-full fill-[#079BC5]" viewBox="0 0 112 112" aria-hidden="true">
          <defs><path id="hero-dream-pool-circle" d="M56 56 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0" /></defs>
          <text className="text-[9px] font-normal tracking-[0.12em]"><textPath href="#hero-dream-pool-circle">YOUR DREAM POOL • YOUR DREAM POOL •</textPath></text>
        </svg>
        <a
          href="#about"
          aria-label="Your dream pool — scroll to about content"
          className="cms-button relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-md transition-transform hover:scale-105 sm:h-16 sm:w-16"
        >
          <svg
            className="w-5 h-5 animate-bounce mt-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
