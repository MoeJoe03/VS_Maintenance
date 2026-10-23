import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { CMSData } from '@/lib/cms-types';

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <div className={`relative min-h-[260px] overflow-hidden rounded-[26px] bg-[#E0FAFA] ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-cover" referrerPolicy="no-referrer" /></div>;
}

export default function AboutWhatWeDoMosaic({ cmsData }: { cmsData: CMSData }) {
  const location = cmsData.contactSection?.location || 'Sandton, South Africa';
  return <section id="what-we-do" className="mx-auto max-w-[1440px] px-3 py-20 sm:px-6 sm:py-28 lg:px-8 xl:px-12">
    <div className="mb-10 px-3 sm:px-4 lg:flex lg:items-end lg:justify-between lg:gap-12"><div><p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">What we do</p><h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-[#172638] sm:text-5xl">Built for the way you use your pool<span className="text-[#079BC5]">.</span></h2></div><p className="mt-5 max-w-md text-sm leading-relaxed text-[#647785] lg:mt-0">New pools, repairs, ongoing care and equipment work, planned around the pool and the property it belongs to.</p></div>
    <div className="rounded-[32px] bg-gradient-to-br from-[#EAFBFC] via-[#F4FCFD] to-[#E8F7FA] p-3 shadow-soft sm:p-5 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="flex flex-col gap-4 lg:gap-5">
          <article className="min-h-[230px] rounded-[26px] border border-[#35D4DB]/20 bg-white p-7 shadow-card sm:p-8 lg:min-h-[255px]"><span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#079BC5]">01 / Services</span><h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#172638] sm:text-3xl">From first plan to final detail.</h3><p className="mt-4 text-sm leading-relaxed text-[#647785]">We build new swimming pools and work on existing ones through repair, maintenance and equipment installation.</p></article>
          <Photo src={cmsData.processSection?.steps[0]?.image || '/assets/process-step-1.png'} alt="Pool project planning and consultation" className="h-[340px] lg:h-[390px]" />
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          <Photo src={cmsData.processSection?.steps[1]?.image || '/assets/process-step-2.png'} alt="Pool maintenance and care" className="h-[340px] lg:h-[390px]" />
          <article className="min-h-[230px] rounded-[26px] bg-[#10283F] p-7 text-white shadow-card sm:p-8 lg:min-h-[255px]"><span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B8F4F5]">02 / Who we serve</span><h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">For pool owners and property owners.</h3><p className="mt-4 text-sm leading-relaxed text-white/75">Whether you are creating a new space or caring for an existing pool, we help you understand the work it needs.</p></article>
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          <article className="min-h-[230px] rounded-[26px] border border-[#35D4DB]/20 bg-white p-7 shadow-card sm:p-8 lg:min-h-[255px]"><span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#079BC5]"><MapPin size={14} /> 03 / Where we work</span><h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#172638] sm:text-3xl">Based in {location}.</h3><p className="mt-4 text-sm leading-relaxed text-[#647785]">We serve surrounding communities by enquiry. Share your address and we will confirm availability for your project.</p></article>
          <Photo src={cmsData.processSection?.steps[2]?.image || '/assets/process-step-3.png'} alt="Finished swimming pool ready to enjoy" className="h-[340px] lg:h-[390px]" />
        </div>
      </div>
    </div>
    <div className="mt-8 px-3 sm:px-4"><Link href="/services" className="inline-flex items-center gap-2 font-bold text-[#079BC5] hover:underline">Explore all services <ArrowRight size={17} /></Link></div>
  </section>;
}
