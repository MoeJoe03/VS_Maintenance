'use client';

import React from 'react';
import Image from 'next/image';

export default function WaterDesignSvg() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none -z-0"
      aria-hidden="true"
    >
      <Image
        src="/assets/aistudio/watercolor-pool-services-fixed_04227340.svg"
        alt="Watercolor pool services background"
        fill
        priority
        unoptimized
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
}
