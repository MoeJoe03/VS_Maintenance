'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

interface ProcessSectionProps {
  cmsData: CMSData;
  onOpenQuote: () => void;
}

function CalendarClockIcon({ className = 'w-6 h-6 sm:w-7 sm:h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect x="6" y="8" width="36" height="34" rx="3.5" />
      {/* Top bar separator */}
      <line x1="6" y1="17" x2="42" y2="17" />
      {/* Top hanging rings */}
      <line x1="14" y1="4.5" x2="14" y2="8" />
      <line x1="34" y1="4.5" x2="34" y2="8" />
      {/* Calendar grid squares */}
      <rect x="11.5" y="22" width="4.5" height="4.5" rx="1" />
      <rect x="19.5" y="22" width="4.5" height="4.5" rx="1" />
      <rect x="27.5" y="22" width="4.5" height="4.5" rx="1" />
      <rect x="35.5" y="22" width="4.5" height="4.5" rx="1" />
      <rect x="11.5" y="29.5" width="4.5" height="4.5" rx="1" />
      <rect x="19.5" y="29.5" width="4.5" height="4.5" rx="1" />
      <rect x="27.5" y="29.5" width="4.5" height="4.5" rx="1" />
      <rect x="11.5" y="37" width="4.5" height="4.5" rx="1" />
      <rect x="19.5" y="37" width="4.5" height="4.5" rx="1" />
      {/* Clock badge bottom right */}
      <circle cx="34" cy="34" r="8" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
      <polyline points="34 30.5 34 34 36.5 35.5" strokeWidth="2.2" />
    </svg>
  );
}

function SwimmerWavesIcon({ className = 'w-6 h-6 sm:w-7 sm:h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Swimmer head */}
      <circle cx="33" cy="13" r="3.2" fill="currentColor" fillOpacity="0.2" />
      {/* Swimmer forward crawl arm and shoulder */}
      <path d="M21 21 C24 18, 30 16, 36 18 C40 19.5, 41 23, 37 25" />
      <path d="M15 24 C19 22, 25 21, 31 23" />
      {/* Wave line 1 */}
      <path d="M7 30 C11 27.5, 16 27.5, 20 30 C24 32.5, 29 32.5, 33 30 C37 27.5, 42 27.5, 46 30" />
      {/* Wave line 2 */}
      <path d="M7 37 C11 34.5, 16 34.5, 20 37 C24 39.5, 29 39.5, 33 37 C37 34.5, 42 34.5, 46 37" />
    </svg>
  );
}

function PoolLadderIcon({ className = 'w-6 h-6 sm:w-7 sm:h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Handrails */}
      <path d="M17 31 V15 C17 11.5, 20 9, 23 9" />
      <path d="M31 31 V15 C31 11.5, 34 9, 37 9" />
      {/* Ladder steps */}
      <line x1="17" y1="18" x2="31" y2="18" />
      <line x1="17" y1="24" x2="31" y2="24" />
      <line x1="17" y1="30" x2="31" y2="30" />
      {/* Wave line 1 */}
      <path d="M8 35 C12 33, 16 33, 20 35 C24 37, 28 37, 32 35 C36 33, 40 33, 44 35" />
      {/* Wave line 2 */}
      <path d="M8 41 C12 39, 16 39, 20 41 C24 43, 28 43, 32 41 C36 39, 40 39, 44 41" />
    </svg>
  );
}

export default function ProcessSection({ cmsData, onOpenQuote }: ProcessSectionProps) {
  const pData = cmsData.processSection;

  const headingLine1 = pData?.headingLine1 || 'Our 3 Step Process';
  const headingLine2 = pData?.headingLine2 || 'to Your Dream Pool';
  const description =
    pData?.description ||
    'Our expert team handles everything from cleaning and water balancing to equipment maintenance — making pool care effortless and stress-free for you.';
  const ctaLabel = pData?.ctaLabel || 'Get In Touch';

  const defaultSteps = [
    {
      id: 'step-1',
      title: 'Book or Consult',
      description:
        'Reach out to discuss your project, whether you need a new pool installation, routine maintenance, or specialized repairs.',
      image: '/assets/process-step-1.png',
      alt: 'Pool technician in safety vest vacuuming pool',
      icon: <CalendarClockIcon />,
    },
    {
      id: 'step-2',
      title: 'Expert Execution & Care',
      description:
        'Our team arrives equipped to build, repair, clean, or balance your water, ensuring every detail and piece of equipment is handled with precision.',
      image: '/assets/process-step-2.png',
      alt: 'Professional pool cleaner servicing pool tile and filtration edge',
      icon: <SwimmerWavesIcon />,
    },
    {
      id: 'step-3',
      title: 'Enjoy Your Pool',
      description:
        'Dive into a pristine, safe, and beautifully finished pool, backed by quality craftsmanship and long-lasting care.',
      image: '/assets/process-step-3.png',
      alt: 'Technician equipped with tools in crystal clear pool with fountains',
      icon: <PoolLadderIcon />,
    },
  ];

  const steps = pData?.steps?.length
    ? pData.steps.slice(0, defaultSteps.length).map((step, idx) => ({
        id: step.id,
        title: defaultSteps[idx].title,
        description: defaultSteps[idx].description,
        image: step.image,
        alt: defaultSteps[idx].alt,
        icon:
          step.iconType === 'calendar' ? (
            <CalendarClockIcon />
          ) : step.iconType === 'cleaning' ? (
            <SwimmerWavesIcon />
          ) : (
            <PoolLadderIcon />
          ),
      }))
    : defaultSteps;

  return (
    <section
      id="process"
      className="relative w-full max-w-[1360px] mx-auto rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#F4FCFD]/90 via-white to-[#EBFBFA]/60 border border-[#35D4DB]/20 p-6 sm:p-10 lg:p-14 shadow-soft overflow-hidden"
      data-purpose="three-step-process"
    >
      {/* Ambient aquatic background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#35D4DB]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#079BC5]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center w-full">
        {/* Left Column: Eyebrow, Heading, Subtitle & Brand CTA */}
        <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">
          {/* Eyebrow Badge in Brand Colors */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBFBFA] border border-[#35D4DB]/40 mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-[#079BC5] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#079BC5] flex items-center gap-1.5">
              <span>Our 3-Step Process</span>
              <Sparkles className="w-3.5 h-3.5 text-[#35D4DB]" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-extrabold text-[#172638] tracking-tight leading-[1.12]">
            {headingLine1} <br />
            <span className="text-[#079BC5]">{headingLine2}</span>
          </h2>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-[16px] text-[#647785] font-normal leading-relaxed max-w-lg">
            {description}
          </p>

          <div className="mt-7 sm:mt-9">
            <button
              type="button"
              onClick={onOpenQuote}
              className="cms-button inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold shadow-[0_10px_25px_-5px_rgba(7,155,197,0.4)] hover:shadow-[0_14px_30px_-5px_rgba(7,155,197,0.55)] transition-all duration-300 cursor-pointer group hover:translate-y-[-1px] active:translate-y-0"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Column: 3 Horizontal Cards Stacked in Brand Palette */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 w-full">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="group bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 hover:border-[#35D4DB]/60 shadow-[0_4px_20px_-2px_rgba(16,40,63,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(7,155,197,0.14)] transition-all duration-300 p-3 sm:p-4 lg:p-4.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
            >
              {/* Thumbnail Image */}
              <div className="relative w-full sm:w-[195px] md:w-[210px] h-[190px] sm:h-[180px] lg:h-[190px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-900/5 group-hover:ring-[#35D4DB]/40 transition-all duration-300">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 210px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text & Icon Block */}
              <div className="flex-1 flex flex-col justify-between py-1 sm:py-1.5 min-h-[160px] sm:min-h-[175px]">
                {/* Header Row: Step Eyebrow + Title and Aquatic Brand Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#079BC5] bg-[#EBFBFA] px-2.5 py-0.5 rounded-full border border-[#35D4DB]/30 w-fit mb-1.5">
                      Step {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-[23px] font-bold text-[#172638] tracking-tight leading-snug group-hover:text-[#079BC5] transition-colors duration-200">
                      {step.title}
                    </h3>
                  </div>

                  {/* Aquatic Teal Icon Container */}
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#E8F7FA] border border-[#35D4DB]/30 flex items-center justify-center text-[#079BC5] shrink-0 group-hover:bg-[#079BC5] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md">
                    {step.icon}
                  </div>
                </div>

                {/* Description Text */}
                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#647785] leading-relaxed mt-3 sm:mt-auto font-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
