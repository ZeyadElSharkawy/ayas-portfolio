'use client';

// Prototype of the "unstitch" page transition: the seam's stitches are unpicked top to bottom,
// then the two fabric panels part to reveal what's behind. Click again to sew it back up.

import { useState, type ReactNode } from 'react';

export function UnstitchReveal({ children, label = 'Unstitch' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const panel = 'absolute inset-y-0 w-1/2 bg-sand transition-transform duration-700 ease-[var(--ease-thread)]';
  const weave = {
    backgroundImage:
      'repeating-linear-gradient(0deg, rgb(91 70 54 / 0.06) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgb(91 70 54 / 0.05) 0 1px, transparent 1px 4px)',
  };

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      data-cursor={open ? 'Sew up' : label}
      aria-pressed={open}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-cream text-left"
    >
      <div className="absolute inset-0">{children}</div>

      <div
        className={`${panel} left-0`}
        style={{ ...weave, transform: open ? 'translateX(-101%)' : 'none', transitionDelay: open ? '0.45s' : '0s' }}
      />
      <div
        className={`${panel} right-0`}
        style={{ ...weave, transform: open ? 'translateX(101%)' : 'none', transitionDelay: open ? '0.45s' : '0s' }}
      />

      {/* The seam: unpicked top-to-bottom before the panels move, re-sewn after they close. */}
      <div
        className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 text-thread transition-[clip-path] duration-500 ease-[var(--ease-thread)]"
        style={{
          backgroundImage: 'linear-gradient(to bottom, currentColor 55%, transparent 55%)',
          backgroundSize: '1.5px 12px',
          clipPath: open ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)',
          transitionDelay: open ? '0s' : '0.6s',
        }}
      />

      <span
        className={`label absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 text-cream transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
      >
        {label}
      </span>
    </button>
  );
}
