'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CMSData } from '@/lib/cms-types';

interface AboutProps {
  cmsData: CMSData;
}

export default function About({ cmsData }: AboutProps) {
  const p = cmsData.about.leadParagraph;

  return (
    <section
      id="about"
      className="relative rounded-[32px] bg-gradient-to-b from-[#EBFBFA] via-[#f2fdfd] to-white p-8 sm:p-14 lg:p-20 text-center shadow-soft border border-white"
      data-purpose="about-statement"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Header and pool illustration */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172638] tracking-tight mb-3">
          {cmsData.about.heading}
        </h2>

        <div className="relative mb-8 h-20 w-36 sm:h-24 sm:w-44">
          <Image src="/assets/round_pool_vector.svg" alt="Round swimming pool illustration" fill sizes="(max-width: 640px) 144px, 176px" className="object-contain" />
        </div>

        {/* About Paragraph */}
        <p className="text-base sm:text-xl lg:text-[22px] leading-relaxed sm:leading-[2.2] text-[#172638]/90 font-medium">
          <strong>{p.part1}</strong>{' '}
          <span className="inline-flex align-middle mx-1 w-12 h-6 sm:w-16 sm:h-7 rounded-full overflow-hidden shadow-sm border border-white relative">
            <Image
              src={p.inlineImage1}
              alt="Crystal pool water"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </span>{' '}
          <strong>{p.part2}</strong>{' '}
          {p.part3}{' '}{p.part4}{' '}
          <span className="inline-flex align-middle mx-1 w-12 h-6 sm:w-16 sm:h-7 rounded-full overflow-hidden shadow-sm border border-white relative">
            <Image
              src={p.inlineImage2}
              alt="Luxury pool resort"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </span>{' '}
          {p.part11}{' '}
          <strong>{p.part5}</strong>{' '}
          <span className="inline-flex align-middle mx-1 w-12 h-6 sm:w-16 sm:h-7 rounded-full overflow-hidden shadow-sm border border-white relative">
            <Image
              src={p.inlineImage3}
              alt="Turquoise coastline"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </span>{' '}
          <strong>{p.part6}</strong>{' '}
          {p.part7}{' '}
          <span className="inline-flex align-middle mx-1 w-12 h-6 sm:w-16 sm:h-7 rounded-full overflow-hidden shadow-sm border border-white relative">
            <Image
              src={p.inlineImage4}
              alt="Resort spa pool"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </span>
          {' '}{p.part8}{' '}
          {p.part9}
          <span className="inline-flex align-middle mx-1 w-12 h-6 sm:w-16 sm:h-7 rounded-full overflow-hidden shadow-sm border border-white relative">
            <Image
              src={p.inlineImage5}
              alt="Greek seaside pool"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </span>
          {' '}{p.part10}
        </p>

        {/* Centered Discover CTA Button */}
        <div className="mt-10">
          <Link
            href="/about"
            className="cms-button inline-flex items-center justify-center px-8 py-3 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {cmsData.about.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
