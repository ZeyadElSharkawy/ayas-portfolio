'use client';

// Full-screen viewer for a project's images and booklet pages. One provider per page holds every
// item in reading order, so the arrows walk through the whole project, not just one section.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';

const LightboxContext = createContext<(index: number) => void>(() => {});

export function LightboxProvider({ items, children }: { items: ResolvedImage[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }, []);
  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, close, step]);

  const item = index === null ? null : items[index];

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {item && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-50 flex flex-col bg-night/95 text-chalk">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <p className="label tabular-nums text-chalk/70">
              {index! + 1} / {items.length}
            </p>
            <button ref={closeRef} type="button" onClick={close} className="label link-line text-chalk">
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20 sm:pb-6">
            <Picture key={item.src} image={item} sizes="100vw" fit="contain" placeholder={false} className="h-full w-full" priority />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"              className="absolute inset-y-0 left-0 w-1/4 sm:w-20"
            >
              <span className="label hidden sm:inline">←</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"              className="absolute inset-y-0 right-0 w-1/4 sm:w-20"
            >
              <span className="label hidden sm:inline">→</span>
            </button>
          </div>

        </div>
      )}
    </LightboxContext.Provider>
  );
}

/** Wraps a thumbnail so clicking it opens the lightbox at `index`. */
export function LightboxButton({ index, label, children, className = '' }: { index: number; label: string; children: ReactNode; className?: string }) {
  const open = useContext(LightboxContext);
  return (
    <button type="button" onClick={() => open(index)} aria-label={`View larger: ${label}`} className={`block w-full text-left ${className}`}>
      {children}
    </button>
  );
}
