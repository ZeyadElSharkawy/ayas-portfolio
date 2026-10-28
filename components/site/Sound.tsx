'use client';

// The site-wide sound switch (in both headers) and the one global cue: a thread pull when a link
// takes you to another room. Everything else plays from the interaction that makes it.

import { useEffect } from 'react';
import { cue, setSoundEnabled, useSoundEnabled } from '@/lib/sound';

/** `className` replaces the default stitched-link look (the atelier header uses its pill buttons). */
export function SoundToggle({ className = 'stitch-link' }: { className?: string }) {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => {
        setSoundEnabled(!on);
        if (!on) cue('thread');
      }}
      aria-pressed={on}
      aria-label="Sound"
      title={on ? 'Sound on' : 'Sound off'}
      className={`label inline-flex items-center gap-1.5 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      <span className="hidden sm:inline">Sound</span>
    </button>
  );
}

/** Plays the thread cue for same-site link clicks (a plain click, not a new tab). */
export function SoundLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.origin !== location.origin) return;
      if (a.pathname === location.pathname && a.search === location.search) return;
      cue('thread');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
