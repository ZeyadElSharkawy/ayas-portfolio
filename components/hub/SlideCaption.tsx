'use client';

// Caption for the Atelier Floor slideshow: one selected work per slide, each in its own set.

import Link from 'next/link';
import { Seam } from '@/components/motif/Seam';
import { STITCH } from '@/components/motif/StitchPage';
import { ProjectTeasers } from './ProjectTeasers';
import type { HubProject } from './types';

export function SlideCaption({
  projects,
  index,
  onSelect,
  onBack,
  onHover,
}: {
  /** The selected works, in slide order. */
  projects: HubProject[];
  index: number;
  onSelect: (index: number) => void;
  onBack: () => void;
  onHover: (slug: string | null) => void;
}) {
  const p = projects[index];
  const total = projects.length;
  const go = (d: number) => onSelect((index + d + total) % total);

  return (
    <aside
      aria-label="Selected works"
      aria-roledescription="carousel"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <button type="button" onClick={onBack} className="label stitch-link pointer-events-auto absolute top-20 left-4 text-ink-soft sm:left-6">
        ← Back to the atelier
      </button>

      <div
        key={p.slug}
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${total}: ${p.title}`}
        className="pointer-events-none absolute inset-x-3 top-1/2 grid -translate-y-1/2 gap-3 sm:inset-x-6 sm:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:gap-6"
      >
        <div className="pointer-events-auto order-2 max-h-[38vh] overflow-y-auto rounded-lg bg-cream/95 p-4 shadow-lg backdrop-blur sm:order-1 sm:max-h-[68vh] sm:p-6">
          <p className="label text-forest">
            The Atelier Floor · {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-[0.95] font-light sm:text-5xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}>
            {p.title}
          </h2>
          {p.titleAr && (
            <p lang="ar" dir="rtl" className="mt-1 text-left text-xl font-light text-ink-soft">
              {p.titleAr}
            </p>
          )}
          <Seam animate className="my-5 w-24" />
          <p className="font-display text-lg leading-snug font-light italic" style={{ fontVariationSettings: '"SOFT" 100' }}>
            {p.tagline}
          </p>
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {p.palette.map((hex) => (
              <span key={hex} className="h-2 w-7 rounded-full" style={{ background: hex }} />
            ))}
          </div>

          <Link
            href={`/work/${p.slug}`}
            transitionTypes={STITCH}
            onPointerEnter={() => onHover(p.slug)}
            onPointerLeave={() => onHover(null)}
            data-cursor="Open project"
            className="label mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-cream transition-colors hover:bg-burgundy"
          >
            Explore this work <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="pointer-events-auto order-1 drop-shadow-xl sm:order-2">
          <ProjectTeasers label={p.title} media={p.previews} featured />
        </div>
      </div>

      <div className="pointer-events-auto absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6">
        <button type="button" onClick={() => go(-1)} aria-label="Previous work" data-cursor="Previous" className="label rounded-full border-[1.5px] border-dashed border-ink/30 px-3 py-2 hover:border-forest hover:text-forest">
          ←
        </button>
        <ol className="flex gap-2" aria-label="Works">
          {projects.map((x, i) => (
            <li key={x.slug}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={x.title}
                aria-current={i === index ? 'true' : undefined}
                data-cursor={x.title}
                className="block p-1"
              >
                <span className={`block h-2 rounded-full transition-all ${i === index ? 'w-6 bg-forest' : 'w-2 bg-ink/25 hover:bg-orange'}`} />
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => go(1)} aria-label="Next work" data-cursor="Next" className="label rounded-full border-[1.5px] border-dashed border-ink/30 px-3 py-2 hover:border-forest hover:text-forest">
          →
        </button>
      </div>
    </aside>
  );
}
