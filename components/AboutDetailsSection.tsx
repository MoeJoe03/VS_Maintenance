'use client';
import ServiceAreas from './ServiceAreas';

import { ArrowUpRight, ChevronDown, MapPin } from 'lucide-react';

const faqs = [
  { question: 'What does your team work on?', answer: 'We build new swimming pools and work on existing ones through repair, maintenance and equipment installation. Tell us about your pool and we will help identify the relevant service.' },
  { question: 'Who do you work with?', answer: 'We work with homeowners and property owners planning a new pool or looking after an existing one. The recommended scope depends on the property, pool condition and your goals.' },
  { question: 'Where do you provide pool services?', answer: 'Sandton is our primary service area. We also serve the surrounding locations listed above. Share your address so we can confirm availability for your project.' },
  { question: 'Can you help after a pool has been built?', answer: 'Yes. Our services include repairs, regular pool maintenance and equipment installation as well as new pool construction.' },
  { question: 'How do I get started?', answer: 'Contact us with your location and a brief description of what you need. We can discuss the pool, arrange an assessment if needed and outline the next step.' },
];

export default function AboutDetailsSection({ location, onOpenQuote }: { location: string; onOpenQuote: () => void }) {
  return <>
    <section id="service-area" className="mx-auto grid max-w-[1360px] gap-10 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
      <div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Service area</p><h2 className="max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">Local pool work, planned around your location.</h2><p className="mt-6 max-w-xl text-base leading-relaxed text-[#647785]">Our listed base is {location}. Sandton is our primary service area, with service across the locations listed here. Send us your suburb or address and we will confirm whether we can visit your property.</p><button onClick={onOpenQuote} className="cms-button mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold">Check your area <ArrowUpRight size={16} /></button></div>
      <div className="rounded-[30px] border border-[#35D4DB]/20 bg-[#EBFBFA] p-7 shadow-soft sm:p-10"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#079BC5]"><MapPin size={28} /></div><p className="text-xs font-extrabold uppercase tracking-widest text-[#079BC5]">Based in</p><h3 className="mt-2 text-2xl font-extrabold text-[#172638]">{location}</h3><div className="my-6 border-t border-[#35D4DB]/30" /><p className="text-xs font-extrabold uppercase tracking-widest text-[#079BC5]">Areas we serve</p><ServiceAreas /><p className="mt-4 text-sm leading-relaxed text-[#647785]">Sandton is our primary service area. Contact us to confirm availability for your address.</p></div>
    </section>
    <section id="faq" className="mx-auto grid max-w-[1360px] gap-12 px-6 pb-20 sm:px-10 sm:pb-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">Good to know</p><h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently asked <span className="text-[#079BC5]">questions.</span></h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-[#647785]">Need an answer about your particular pool? We are happy to discuss the details with you.</p><button onClick={onOpenQuote} className="cms-button mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Ask our team <ArrowUpRight size={16} /></button></div><div className="divide-y divide-[#B8F4F5] border-y border-[#B8F4F5]">{faqs.map((faq) => <details key={faq.question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-bold text-[#172638] marker:content-none sm:text-lg">{faq.question}<ChevronDown size={21} className="shrink-0 text-[#079BC5] transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-[#647785]">{faq.answer}</p></details>)}</div></section>
  </>;
}
