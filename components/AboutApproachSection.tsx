'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles, Waves, Wrench, HeartHandshake } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

const principles = [
  { number: '01', title: 'One team across the pool lifecycle', copy: 'From new builds to repairs, maintenance and equipment, we can help at the stage your pool is in today.', icon: Waves },
  { number: '02', title: 'The scope starts with your pool', copy: 'We begin with your goals and the condition of the site or existing pool, then recommend work suited to the project.', icon: Wrench },
  { number: '03', title: 'Care that continues after the build', copy: 'A beautiful pool also needs dependable water and equipment care. Ongoing maintenance is part of what we do.', icon: HeartHandshake },
];

export default function AboutApproachSection({ cmsData, onOpenQuote }: { cmsData: CMSData; onOpenQuote: () => void }) {
  return <section className="bg-white px-6 py-20 sm:px-10 sm:py-28 lg:px-16" id="approach">
    <div className="mx-auto max-w-[1360px]">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
        <div className="flex flex-col items-start lg:sticky lg:top-24 lg:col-span-5 lg:pr-4">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#35D4DB]/40 bg-[#EBFBFA] px-3.5 py-1.5"><span className="h-2 w-2 rounded-full bg-[#079BC5]" /><span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#079BC5]">Our approach <Sparkles size={14} /></span></div>
          <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[#172638] sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px]">What makes working <span className="text-[#079BC5]">with us different.</span></h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#647785] sm:text-base">Every pool and property is different. These principles shape how we plan, carry out and care for the work.</p>
          <button type="button" onClick={onOpenQuote} className="cms-button group mt-8 inline-flex items-center gap-3 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-[0_10px_25px_-5px_rgba(7,155,197,0.4)] transition-all hover:-translate-y-0.5 sm:px-8 sm:py-4 sm:text-base">Discuss your pool <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
        </div>
        <div className="approach-stack relative isolate flex flex-col gap-6 pb-16 sm:gap-8 lg:col-span-7">
          {principles.map((item, index) => {
            const Icon = item.icon;
            const image = cmsData.processSection?.steps?.[index]?.image || `/assets/process-step-${index + 1}.png`;
            return <article key={item.number} style={{ top: `${4 + index * 1.5}rem`, zIndex: index + 1 }} className="approach-stack-card group sticky flex shrink-0 flex-col items-stretch gap-4 rounded-2xl border border-[#35D4DB]/30 bg-white p-3 shadow-[0_18px_50px_-14px_rgba(16,40,63,0.24)] transition-shadow hover:border-[#35D4DB]/60 hover:shadow-[0_22px_55px_-12px_rgba(7,155,197,0.2)] sm:flex-row sm:items-center sm:gap-5 sm:p-4">
              <div className="relative h-[190px] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5 sm:h-[180px] sm:w-[195px] sm:rounded-2xl lg:h-[190px] lg:w-[210px]"><Image src={image} alt="Pool service work" fill sizes="(max-width: 640px) 100vw, 210px" className="object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" /></div>
              <div className="flex min-h-[160px] flex-1 flex-col justify-between py-1 sm:min-h-[175px]"><div className="flex items-start justify-between gap-3"><div><span className="mb-1.5 inline-block rounded-full border border-[#35D4DB]/30 bg-[#EBFBFA] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#079BC5]">Principle {item.number}</span><h3 className="text-xl font-bold leading-snug tracking-tight text-[#172638] transition-colors group-hover:text-[#079BC5] sm:text-2xl">{item.title}</h3></div><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#35D4DB]/30 bg-[#E8F7FA] text-[#079BC5] transition-all group-hover:bg-[#079BC5] group-hover:text-white"><Icon size={25} strokeWidth={1.8} /></div></div><p className="mt-3 text-sm leading-relaxed text-[#647785] sm:mt-auto">{item.copy}</p></div>
            </article>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
