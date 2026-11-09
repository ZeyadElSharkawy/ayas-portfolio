'use client';

// The way from the hero into the work: a line of running stitches sews itself outward from the middle as it
// scrolls in, and what follows rises at its own pace (the statement faster than the line under it).
// One variable, --p, goes 0 → 1 while the seam travels from the bottom of the screen to 30% from the
// top; children read it through `rise` (rise.ts). Under reduced motion --p stays 1: sewn, still.

import { useEffect, useRef, type ReactNode } from 'react';

export function SeamParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = el.getBoundingClientRect().top;
      const p = (window.innerHeight - top) / (window.innerHeight * 0.7);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div ref={ref}>
      {/* The seam: stitches drawn out from the middle to both edges over a faint fold line. */}
      <div aria-hidden className="relative h-4" style={{ clipPath: 'inset(0 calc((1 - var(--p, 1)) * 50%))' }}>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_14px,transparent_14px_24px)]" />
      </div>
      {children}
    </div>
  );
}
