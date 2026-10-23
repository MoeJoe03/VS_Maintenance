'use client';

import React from 'react';
import Image from 'next/image';
import { CMSData } from '@/lib/cms-types';

interface CtaBannerProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

export default function CtaBanner({ cmsData, onOpenQuote }: CtaBannerProps) {
  const cta = cmsData.ctaBanner;

  return (
    <section
      id="cta"
      className="relative rounded-2xl overflow-visible shadow-elevated border-2 border-white max-w-[1440px] mx-auto w-full"
      data-purpose="call-to-action"
    >
      <div className="relative rounded-2xl overflow-hidden h-[460px] sm:h-[520px] lg:h-[560px] w-full flex flex-col items-center justify-center text-center px-6 sm:px-10">
        {/* Background Imagery */}
        <Image
          src={cta.backgroundImage}
          alt="Sunken lounge area inside an azure luxury pool"
          fill
          className="object-cover rounded-2xl"
          referrerPolicy="no-referrer"
        />

        {/* Deep cyan ambient overlay */}
        <div className="absolute inset-0 bg-[#0682A6]/70 backdrop-blur-[2px] rounded-2xl" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-white uppercase drop-shadow-sm mb-3">
            {cta.topBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm mb-8">
            {cta.heading}
          </h2>
          <button
            type="button"
            onClick={onOpenQuote}
            className="cms-button inline-flex items-center justify-center px-9 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            {cta.buttonLabel}
          </button>
        </div>
      </div>

      {/* Overlapping Centered Stamp Badge at bottom edge */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
        <div className="relative w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100">
          {/* Central Monogram */}
          <span className="text-[#079BC5] font-extrabold text-lg tracking-tighter">
            {cta.stampBadgeMonogram}
          </span>

          {/* SVG Circular Path Text */}
          <svg className="absolute inset-0 w-full h-full spin-slow" viewBox="0 0 100 100">
            <path
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
              id="ctaCirclePath"
            />
            <text fill="#079BC5" fontSize="9" fontWeight="700" letterSpacing="2">
              <textPath href="#ctaCirclePath" startOffset="0%">
                {cta.stampBadgeText}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
