'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, X, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';
import { CMSData, GalleryItem } from '@/lib/cms-types';

interface GalleryProps {
  cmsData: CMSData;
  onOpenQuote: (serviceName?: string) => void;
}

const CATEGORIES = [
  'All',
  'New Pools',
  'Pool Repairs', 'Pool Renovation', 'Paving',
  'Maintenance',
  'Equipment Installs',
  'Transformations',
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export default function Gallery({ cmsData, onOpenQuote }: GalleryProps) {
  const galleryData = cmsData.gallery || {
    eyebrow: 'GALLERY',
    heading: 'Our Work in',
    headingHighlight: 'Action',
    description:
      'Explore a selection of our recent pool projects, repairs and transformations. Quality workmanship you can see for yourself.',
    items: [],
  };

  const allItems: GalleryItem[] = useMemo(() => {
    return galleryData.items?.filter(item => item.imageUrl.trim()) || [];
  }, [galleryData.items]);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [currentSlide, setCurrentSlide] = useState(0); // 0-indexed (0 to 3 for 4 slides)
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Group items by slide for "All" view (4 slide groups)
  const totalSlides = 4;

  const currentSlideItems = useMemo(() => {
    const excludedProjectIds = new Set(['gal-2', 'gal-3', 'gal-4']);
    const keep = (item: GalleryItem) => !excludedProjectIds.has(item.id);
    if (activeCategory !== 'All') {
      return allItems.filter((item) => item.category === activeCategory && keep(item));
    }
    // Slide group is 1-indexed (1, 2, 3, 4)
    const targetGroup = (currentSlide % totalSlides) + 1;
    const groupItems = allItems.filter((item) => item.slideGroup === targetGroup);
    if (groupItems.length >= 4) return groupItems.slice(0, 5).filter(keep);
    // Fallback: take slice of 5 items
    const start = (currentSlide * 5) % Math.max(1, allItems.length);
    return allItems.slice(start, start + 5).filter(keep);
  }, [allItems, activeCategory, currentSlide]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allItems.findIndex((it) => it.id === lightboxItem.id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % allItems.length;
          setLightboxItem(allItems[nextIndex]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allItems.findIndex((it) => it.id === lightboxItem.id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
          setLightboxItem(allItems[prevIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, allItems]);

  // The homepage keeps its fixed composition, independent of gallery card sizing.
  const col1Item = currentSlideItems[0];
  const col2Item = currentSlideItems[1];
  const col3TopItem = currentSlideItems[2];
  const col3BottomItem = currentSlideItems[3];
  const col4Item = currentSlideItems[4];

  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden bg-white py-14 sm:py-20 lg:py-24 select-none"
      data-purpose="gallery-showcase"
    >


      {/* Gentle center water wave contour bands */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-40">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M -100 240 C 200 180, 500 320, 850 260 C 1150 210, 1350 280, 1550 240"
            stroke="#e0f2fe"
            strokeWidth="1.5"
          />
          <path
            d="M -100 380 C 250 320, 600 440, 950 380 C 1200 340, 1400 400, 1550 370"
            stroke="#e0f2fe"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col">
        {/* Top Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow: —— GALLERY —— */}
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <span className="w-8 sm:w-12 h-[1.5px] bg-sky-300 rounded-full" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-sky-600 uppercase">
              {galleryData.eyebrow || 'GALLERY'}
            </span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-sky-300 rounded-full" />
          </div>

          {/* Heading: Our Work in Action */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {galleryData.heading}{' '}
            <span className="text-sky-500 font-extrabold">{galleryData.headingHighlight}</span>
          </h2>

          {/* Subhead Description */}
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed mt-3 px-2">
            {galleryData.description}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mb-10 sm:mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentSlide(0);
                }}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-[1.02]'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>{cat}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Visual Showcase Track / Grid */}
        <div className="relative w-full">
          {/* Navigation Arrow: Left */}
          <button
            onClick={handlePrevSlide}
            aria-label="Previous pool projects"
            className="absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-700 hover:text-sky-600 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Arrow: Right */}
          <button
            onClick={handleNextSlide}
            aria-label="Next pool projects"
            className="absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-700 hover:text-sky-600 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Gallery Showcase Content */}
          {activeCategory === 'All' ? (
            /* 4-Column Layout with Column 3 Stacked (Matches mockup image_88afc482.png) */
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${currentSlideItems.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4 sm:gap-5 lg:gap-6 min-h-[460px] lg:h-[480px]`}>
              {/* Column 1: Tall Card */}
              {col1Item && (
                <div
                  onClick={() => setLightboxItem(col1Item)}
                  className="group relative h-[360px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                >
                  <Image
                    src={col1Item.imageUrl}
                    alt={col1Item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                      {col1Item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors">
                      {col1Item.title}
                    </h3>
                    
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Column 2: Tall Card */}
              {col2Item && (
                <div
                  onClick={() => setLightboxItem(col2Item)}
                  className="group relative h-[360px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                >
                  <Image
                    src={col2Item.imageUrl}
                    alt={col2Item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                      {col2Item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors">
                      {col2Item.title}
                    </h3>
                    
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Column 3: Stacked Cards (Top & Bottom) */}
              {(col3TopItem || col3BottomItem) && <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 h-[460px] sm:h-[420px] lg:h-full">
                {/* Top Stacked Card */}
                {col3TopItem && (
                  <div
                    onClick={() => setLightboxItem(col3TopItem)}
                    className="group relative flex-1 h-[210px] sm:h-[195px] lg:h-auto rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                  >
                    <Image
                      src={col3TopItem.imageUrl}
                      alt={col3TopItem.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                        {col3TopItem.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-sm leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors line-clamp-1">
                        {col3TopItem.title}
                      </h4>
                      
                    </div>
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Stacked Card */}
                {col3BottomItem && (
                  <div
                    onClick={() => setLightboxItem(col3BottomItem)}
                    className="group relative flex-1 h-[210px] sm:h-[195px] lg:h-auto rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                  >
                    <Image
                      src={col3BottomItem.imageUrl}
                      alt={col3BottomItem.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                        {col3BottomItem.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-sm leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors line-clamp-1">
                        {col3BottomItem.title}
                      </h4>
                      
                    </div>
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>}

              {/* Column 4: Tall Card */}
              {col4Item && (
                <div
                  onClick={() => setLightboxItem(col4Item)}
                  className="group relative h-[360px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                >
                  <Image
                    src={col4Item.imageUrl}
                    alt={col4Item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                      {col4Item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors">
                      {col4Item.title}
                    </h3>
                    
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Filtered Category Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 min-h-[420px]">
              {currentSlideItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative h-[340px] sm:h-[380px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-100 border border-slate-200/40"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-sky-700 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-base leading-snug drop-shadow-sm group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Controls Bar (Matches mockup image_88afc482.png) */}
        <div className="flex items-center justify-between mt-8 sm:mt-10 pt-4 border-t border-slate-100">
          {/* Slide Indicator & Progress Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm font-bold text-slate-500 font-mono">
              0{(currentSlide % totalSlides) + 1}
            </span>
            <div className="w-20 sm:w-28 lg:w-36 h-1 bg-slate-200/90 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${(((currentSlide % totalSlides) + 1) / totalSlides) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-400 font-mono">
              0{totalSlides}
            </span>
          </div>

          {/* VIEW FULL GALLERY Link CTA */}
          <button
            onClick={() => {
              if (allItems.length > 0) {
                setLightboxItem(allItems[0]);
              }
            }}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-slate-800 hover:text-sky-600 transition-colors uppercase"
          >
            <span>VIEW FULL GALLERY</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-sky-600" />
          </button>
        </div>
      </div>

      {/* Interactive Lightbox / Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: High-Res Image View */}
            <div className="relative w-full lg:w-3/5 h-[280px] sm:h-[380px] lg:h-[560px] bg-slate-900">
              <Image
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fill
                priority
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-600 text-white shadow-md">
                  {lightboxItem.category}
                </span>
              </div>
            </div>

            {/* Right: Project Details & Action */}
            <div className="w-full lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pur Pool Project Showcase</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {lightboxItem.title}
                </h3>

                

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Scope of Craftsmanship
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {lightboxItem.description ||
                      'Expertly engineered and maintained using commercial-grade filtration, custom waterline tiling, and precision water chemistry balancing.'}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Certified master aquatic engineering & structural warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pure mineral sanitation & smart app automation</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setLightboxItem(null);
                    onOpenQuote(lightboxItem.category);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Request Similar Pool Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                  <span>Use ← → keys to browse</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const currentIndex = allItems.findIndex((it) => it.id === lightboxItem.id);
                        const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
                        setLightboxItem(allItems[prevIndex]);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = allItems.findIndex((it) => it.id === lightboxItem.id);
                        const nextIndex = (currentIndex + 1) % allItems.length;
                        setLightboxItem(allItems[nextIndex]);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
