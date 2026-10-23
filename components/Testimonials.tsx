'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface TestimonialsProps {
  cmsData: CMSData;
}

export default function Testimonials({ cmsData }: TestimonialsProps) {
  const items = cmsData.testimonials?.items || [];
  const heading = cmsData.testimonials?.heading || 'What Our';
  const headingHighlight = cmsData.testimonials?.headingHighlight || 'Customers';
  const headingSuffix = cmsData.testimonials?.headingSuffix || 'Say';
  const subtitle =
    cmsData.testimonials?.infoCardText ||
    'Real reviews and experiences from pool owners who count on Pur Pools for crystal-clear water and effortless care.';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Measure and center the active card perfectly within the viewport container
  const updateActivePosition = useCallback(() => {
    const activeEl = cardRefs.current[activeIndex];
    const container = containerRef.current;
    if (activeEl && container) {
      const containerCenter = container.offsetWidth / 2;
      const itemCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;
      setTranslateX(containerCenter - itemCenter);
    }
  }, [activeIndex]);

  useEffect(() => {
    updateActivePosition();
  }, [activeIndex, updateActivePosition]);

  useEffect(() => {
    const handleResize = () => {
      updateActivePosition();
    };
    window.addEventListener('resize', handleResize);
    // Double check on load/font rendering
    const timer = setTimeout(updateActivePosition, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [updateActivePosition]);

  // Auto-advance slides every 6 seconds if not paused
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  // Alternating floating rotations as seen in the reference design
  const cardRotations = [
    '-rotate-[2.5deg]',
    'rotate-[1.8deg]',
    '-rotate-[2deg]',
    'rotate-[2.2deg]',
  ];

  return (
    <section
      id="reviews"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#0086cf] via-[#0277bd] to-[#0165a2] min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-12 sm:py-16 select-none"
      data-purpose="reviews-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Pool Water Caustics & Reflection Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="poolCaustics"
              width="300"
              height="200"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-6)"
            >
              <g fill="none" stroke="#ffffff" strokeLinecap="round">
                <path
                  d="M-20 50 Q30 15 80 50 T170 55 Q230 20 300 50"
                  strokeWidth="2.5"
                  opacity="0.45"
                />
                <path
                  d="M-15 60 Q35 110 95 100 T195 90 Q270 115 320 60"
                  strokeWidth="1.8"
                  opacity="0.6"
                />
                <path
                  d="M80 -10 Q110 35 80 55 Q50 80 90 100 Q125 140 90 200"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <path
                  d="M170 -10 Q145 35 170 58 Q205 85 185 92 Q150 140 190 200"
                  strokeWidth="1.8"
                  opacity="0.55"
                />
                <path
                  d="M-10 150 Q60 120 90 145 T190 140 Q250 118 310 160"
                  strokeWidth="2.2"
                  opacity="0.4"
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#poolCaustics)" />
          {/* Subtle curved pool bottom arc */}
          <path
            d="M-100 640 Q720 540 1540 660"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.2"
          />
          <path
            d="M-50 710 Q720 610 1490 720"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.12"
          />
        </svg>
      </div>

      {/* Radial soft lighting highlights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header: "What Our Customers Say" */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 shadow-sm">
          <span className="flex items-center text-[#fbbf24] text-xs sm:text-sm tracking-tight">★★★★★</span>
          <span className="text-white/95">Trusted Local Reviews</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md uppercase font-sans">
          {heading} <span className="text-sky-200">{headingHighlight}</span> {headingSuffix}
        </h2>

        {subtitle && (
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-sky-100/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm px-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Floating Cards Carousel Track */}
      <div className="relative w-full z-10 flex items-center justify-center overflow-hidden py-4 sm:py-6">
        {/* Navigation Arrow - Left */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous review"
          className="hidden sm:flex absolute left-4 md:left-8 lg:left-12 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md border border-white/30 items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Dynamic Carousel Container */}
        <div
          ref={containerRef}
          className="w-full relative overflow-hidden flex items-center"
        >
          <div
            className="flex items-center gap-6 sm:gap-8 md:gap-10 transition-transform duration-500 ease-out py-6"
            style={{
              transform: `translateX(${translateX}px)`,
            }}
          >
            {items.map((item, idx) => {
              const isActive = idx === activeIndex;
              const rotationClass = cardRotations[idx % cardRotations.length];

              return (
                <div
                  key={item.id || idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative cursor-pointer transition-all duration-500 ease-out shrink-0 ${rotationClass} hover:rotate-0 hover:scale-[1.02] ${
                    isActive
                      ? 'scale-100 opacity-100 z-10'
                      : 'scale-[0.96] opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    width: 'clamp(320px, 85vw, 540px)',
                  }}
                >
                  {/* White Review Card without Photo Head */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-white/95 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                    <div>
                      {/* 5 Yellow Stars */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(item.stars || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#fbbf24] text-[#fbbf24]"
                          />
                        ))}
                      </div>

                      {/* Quote & Right Blue Vertical Accent Line */}
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-slate-700 text-sm sm:text-[15px] font-normal leading-relaxed line-clamp-4">
                          &ldquo;{item.quoteBody}&rdquo;
                        </p>
                        {/* Distinct vertical blue bar on right edge */}
                        <div className="w-[3px] sm:w-1 h-10 sm:h-12 bg-[#0284c7] rounded-full shrink-0 mt-0.5" />
                      </div>
                    </div>

                    {/* Author Name & Location */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-[#172638] tracking-wider uppercase leading-tight font-sans">
                          {item.authorName}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                          {item.location || item.authorRole}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrow - Right */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next review"
          className="hidden sm:flex absolute right-4 md:right-8 lg:right-12 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md border border-white/30 items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Pagination Indicators - Replicating screenshot double-ring active dot */}
      <div className="relative z-10 flex items-center justify-center gap-3.5 mt-4 sm:mt-6">
        {items.map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to review ${idx + 1}`}
              className="group p-1 cursor-pointer transition-transform duration-200"
            >
              {isActive ? (
                /* Active dot: Double circle (outer white border ring with solid white inner circle) */
                <span className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-sm transition-all duration-300">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              ) : (
                /* Inactive dot: Soft translucent white circle */
                <span className="block w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white/70 transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
