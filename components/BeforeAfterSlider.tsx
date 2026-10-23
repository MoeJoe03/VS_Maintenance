'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function BeforeAfterSlider({ before, after }: { before: string; after?: string }) {
  const [position, setPosition] = useState(50);
  return <div className="relative aspect-[1.45] min-h-[230px] overflow-hidden rounded-[26px] bg-[#E0FAFA] shadow-card sm:aspect-[1.6]">
    <Image src={before} alt="Pool before green pool treatment" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
    {after && <><div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}><Image src={after} alt="Pool after green pool treatment" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${position}%` }}><span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#079BC5] text-white shadow-lg">↔</span></div><input type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-label="Compare pool before and after treatment" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-100" /></>}
    <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#172638]">Before</span>{after && <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-[#079BC5] px-4 py-2 text-xs font-bold text-white">After</span>}
  </div>;
}
