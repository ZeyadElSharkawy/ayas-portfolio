'use client';

// Reads a project's booklet or deck page by page. Portrait booklets open as two-page spreads on wide
// screens (cover on its own, like print); landscape decks and phones show one page at a time.
// A stand-in for the 3D flip-book planned for Phase 5.

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';

const WIDE = '(min-width: 1024px)';
const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(WIDE);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

export function BookletViewer({ title, pages }: { title: string; pages: (ResolvedImage & { n: number })[] }) {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);
  const opener = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => false);

  const portrait = pages.filter((p) => p.height > p.width).length > pages.length / 2;
  const spreads = useMemo(() => {
    if (!wide || !portrait) return pages.map((p) => [p]);
    const out = [[pages[0]]];
    for (let i = 1; i < pages.length; i += 2) out.push(pages.slice(i, i + 2));
    return out;
  }, [pages, wide, portrait]);

  const current = Math.min(spread, spreads.length - 1);
  const go = useCallback((d: number) => setSpread((s) => Math.max(0, Math.min(spreads.length - 1, s + d))), [spreads.length]);
  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close, go]);

  const shown = spreads[current] ?? [];
  const pageLabel = shown.length > 1 ? `Pages ${shown[0].n}–${shown[1].n}` : `Page ${shown[0]?.n}`;

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Read booklet"
        className="group flex w-full items-center gap-5 rounded-sm bg-cream p-3 text-left transition-colors hover:bg-sand/50"
      >
        <Picture image={pages[0]} sizes="96px" className="w-20 shrink-0 rounded-[2px] shadow-sm sm:w-24" />
        <span>
          <span className="label block text-ink-soft">{pages.length} pages</span>
          <span className="mt-1 block font-display text-2xl font-light">{title}</span>
          <span className="stitch-link label mt-2 inline-block">Read it</span>
        </span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex flex-col bg-burgundy text-cream">
          <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
            <p className="label truncate text-cream/70">{title}</p>
            <button ref={closeRef} type="button" onClick={close} className="label stitch-link shrink-0 text-cream" data-cursor="Close">
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-1 px-4 sm:px-20">
            {shown.map((p) => (
              <Picture
                key={p.n}
                image={p}
                sizes={shown.length > 1 ? '45vw' : '90vw'}
                fit="contain"
                placeholder={false}
                priority
                className={`h-full ${shown.length > 1 ? (p === shown[0] ? 'flex-1 [&_img]:object-right' : 'flex-1 [&_img]:object-left') : 'w-full'}`}
              />
            ))}
            <button type="button" onClick={() => go(-1)} disabled={current === 0} aria-label="Previous page" data-cursor="Previous" className="absolute inset-y-0 left-0 w-1/4 disabled:opacity-0 sm:w-20" />
            <button type="button" onClick={() => go(1)} disabled={current === spreads.length - 1} aria-label="Next page" data-cursor="Next" className="absolute inset-y-0 right-0 w-1/4 disabled:opacity-0 sm:w-20" />
          </div>

          <div className="flex items-center gap-4 p-4 sm:p-6">
            <p className="label w-28 shrink-0 tabular-nums text-cream/70" aria-live="polite">
              {pageLabel}
            </p>
            <input
              type="range"
              min={0}
              max={spreads.length - 1}
              value={current}
              onChange={(e) => setSpread(Number(e.target.value))}
              aria-label="Jump to page"
              className="w-full accent-orange"
            />
          </div>
        </div>
      )}
    </>
  );
}
