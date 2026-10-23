'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteParallax() {
  const pathname = usePathname();
  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-image]'));
    const positions = images.map(() => 0);
    let frame = 0;
    let lastTime = 0;
    const reset = () => images.forEach(image => image.style.removeProperty('--parallax-y'));
    const render = (time: number) => {
      frame = 0;
      const delta = lastTime ? Math.min(time - lastTime, 64) : 16.67;
      lastTime = time;
      const ease = 1 - Math.exp(-delta / 100);
      let moving = false;
      images.forEach((image, index) => {
        const bounds = image.parentElement?.getBoundingClientRect();
        if (!bounds) return;
        const limit = bounds.height * 0.045;
        const target = Math.max(-limit, Math.min(limit, -bounds.top * 0.12));
        positions[index] += (target - positions[index]) * ease;
        image.style.setProperty('--parallax-y', `${positions[index].toFixed(2)}px`);
        if (Math.abs(target - positions[index]) > 0.1) moving = true;
      });
      if (moving) frame = requestAnimationFrame(render);
      else lastTime = 0;
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reset();
    };
  }, [pathname]);
  return null;
}
