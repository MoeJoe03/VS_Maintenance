'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CMSData, ServiceItem } from '@/lib/cms-types';
import WaterDesignSvg from './WaterDesignSvg';

interface ServicesProps {
  cmsData: CMSData;
  onSelectService: (serviceName: string) => void;
}

export default function Services({ cmsData, onSelectService }: ServicesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const items = cmsData.services.items;

  // Rotate / cycle services when clicking the arrow button
  const handleNext = () => {
    if (items.length <= 4) {
      setStartIndex((prev) => (prev + 1) % items.length);
    } else {
      setStartIndex((prev) => (prev + 1) % (items.length - 3));
    }
  };

  // Reorder items according to carousel startIndex
  const visibleItems =
    items.length <= 4
      ? [...items.slice(startIndex), ...items.slice(0, startIndex)]
      : items.slice(startIndex, startIndex + 4);

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-white min-h-screen min-h-[100dvh] lg:min-h-[100dvh] flex flex-col items-center justify-start pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16"
      data-purpose="services-showcase"
    >
      {/* Background Water Design SVG - Spanning 100% Full Width & Viewport */}
      <WaterDesignSvg />

      {/* Main Content (relative z-10 over water SVG) - Brought up to start of SVG */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-between mt-2 sm:mt-4 lg:mt-6">
        {/* 5-Column Grid: Left Headline Card (Longer/Wider) + 4 Vertical Photographic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.32fr_1fr_1fr_1fr_1fr] gap-5 lg:gap-6 items-start">
          {/* Column 1: Left Headline & Navigation Card with Inverted Cutout for Arrow Button */}
          <div className="relative min-h-[380px] sm:min-h-[410px] lg:h-[calc(38vh+64px)] max-h-[460px] flex flex-col justify-between p-6 sm:p-8 filter drop-shadow-xl select-none group">
            {/* Notched White Card Shape SVG Background (matches user drawing image_57463948.png) */}
            <svg
              className="absolute inset-0 w-full h-full -z-10 drop-shadow-sm"
              viewBox="0 0 350 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M 32 0 
                   H 318 
                   C 336 0, 350 14, 350 32 
                   V 280 
                   C 350 298, 336 312, 318 312 
                   H 250 
                   C 232 312, 218 326, 218 344 
                   V 370 
                   C 218 388, 204 400, 186 400 
                   H 32 
                   C 14 400, 0 386, 0 368 
                   V 32 
                   C 0 14, 14 0, 32 0 Z"
                fill="#FFFFFF"
                stroke="rgba(241, 245, 249, 0.9)"
                strokeWidth="1.5"
              />
            </svg>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next services"
              className="cms-button group/btn absolute left-[77%] top-[88%] z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
              title="Browse next service"
            >
              <svg
                className="h-6 w-6 rotate-90 transition-transform group-hover/btn:translate-y-1 md:rotate-0 md:group-hover/btn:translate-x-1 md:group-hover/btn:translate-y-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </button>

            {/* Top Text Content */}
            <div className="relative z-10 pr-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172638] tracking-tight mb-2.5 sm:mb-3">
                {cmsData.services.heading}
              </h3>
              <p className="text-xs sm:text-sm text-[#647785] leading-relaxed">
                {cmsData.services.description}
              </p>
            </div>

            {/* Bottom Row: Thumbnail */}
            <div className="relative z-10 flex items-center justify-between mt-auto pt-3 sm:pt-4">
              {/* Left Thumbnail Image - Increased size, crisp subtle roundness, positioned slightly down */}
              <div className="relative w-28 sm:w-32 lg:w-[132px] aspect-[16/11] rounded-lg overflow-hidden shadow-md border border-slate-200/90 flex-shrink-0 bg-slate-100 translate-y-2 sm:translate-y-2.5 transition-transform duration-300 hover:scale-105">
                <Image
                  src={cmsData.services.thumbnailImage}
                  alt="Pool service relaxing preview"
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 132px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>
          </div>

          {/* Columns 2-5: The 4 Photographic Service Cards with Separate White Pills Below */}
          {visibleItems.slice(0, 4).map((service: ServiceItem) => (
            <div
              key={service.id}
              className="flex flex-col items-center group w-full"
            >
              {/* Photo Card */}
              <div
                onClick={() => onSelectService(service.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectService(service.title);
                }}
                className="relative rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-xl h-[280px] sm:h-[320px] md:h-[340px] lg:h-[38vh] min-h-[280px] max-h-[380px] w-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#35D4DB]/50 border-2 border-white/60 transition-transform duration-500 group-hover:-translate-y-1.5"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Distinct White Pill Label Placed DIRECTLY BELOW the Photo Card */}
              <button
                type="button"
                onClick={() => onSelectService(service.title)}
                className="mt-3 sm:mt-3.5 w-full py-2.5 sm:py-3 px-4 rounded-full bg-white text-[#172638] font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:text-[#079BC5] hover:bg-slate-50 transition-all duration-300 text-center flex items-center justify-center border border-white/90 cursor-pointer whitespace-nowrap transform group-hover:scale-[1.02]"
              >
                {service.title}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Aquatic Guarantee Quote Banner (Inside Water SVG Design) */}
        <div className="mt-10 sm:mt-16 lg:mt-20 text-center px-4">
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-[22px] font-bold tracking-wide max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {cmsData.services.guaranteeBanner}
          </p>
        </div>
      </div>
    </section>
  );
}
