'use client';

// A magazine spread: the label's name set huge on her sand wall. From large screens up the hero pins
// while the shoot rises over the name, each photo at its own pace, until all three are in full view;
// then the page moves on. Phones and reduced motion get the same spread without the pin.

import type { CSSProperties } from 'react';
import type { Project } from '@/content/types';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { useScrollProgress } from '@/lib/use-scroll-progress';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const PHOTOS = [
  { from: '52svh', top: '11svh', size: 'lg:h-[min(70svh,36vw)]', grid: '' },
  { from: '44svh', top: '4svh', size: 'lg:h-[min(84svh,44vw)]', grid: 'col-span-2 row-start-1' },
  { from: '60svh', top: '15svh', size: 'lg:h-[min(70svh,36vw)]', grid: '' },
];

export function ClueHero({ project, images }: { project: Project; images: ResolvedImage[] }) {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const reduced = useReducedMotion();
  const p = reduced ? 1 : progress;

  return (
    <header ref={ref} className="relative lg:h-[210svh] motion-reduce:lg:h-auto">
      <div className="lg:sticky lg:top-14 lg:h-[calc(100svh-3.5rem)] lg:overflow-hidden motion-reduce:lg:static">
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:h-full">
          <h1 className="pt-4 text-center font-display text-[44vw] leading-[0.86] tracking-[-0.02em] lg:text-[min(34vw,32rem)]">{project.title}</h1>
          <div
            className="relative z-10 -mt-[6vw] grid grid-cols-2 gap-3 lg:absolute lg:inset-x-8 lg:top-0 lg:mt-0 lg:flex lg:items-start lg:justify-between"
            style={{ '--p': p } as CSSProperties}
          >
            {images.map((img, i) => {
              const { from, top, size, grid } = PHOTOS[i];
              return (
                <div
                  key={img.src}
                  className={`aspect-[2/3] lg:w-auto lg:[margin-top:var(--top)] lg:[transform:translateY(calc((1-var(--p))*var(--from)))] ${size} ${grid}`}
                  style={{ '--from': from, '--top': top } as CSSProperties}
                >
                  <Picture image={img} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw" priority={i === 1} className="h-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
