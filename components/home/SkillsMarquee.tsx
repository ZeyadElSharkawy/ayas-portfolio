// Her skills as a slow strip of marks under the hero: her software as lettered tiles in the hero's
// lavender (not the brands' colours), her hands-on skills as line drawings of their tools. Two copies
// of the list slide left by one copy's width and loop; hovering or focusing pauses it. Under reduced
// motion the strip stands still and wraps, with one copy.

import type { ReactNode } from 'react';
import { heroSkills } from '@/content/about';

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const DRAWN: Record<string, ReactNode> = {
  // A pattern piece with its grain line and notches.
  pattern: (
    <>
      <path d="M7 3h7l5 5-2 13H6L4 9z" />
      <path d="M11 8v9M9.5 15.5 11 17l1.5-1.5" />
      <path d="M4.6 12h1.2M18 12h-1.2" />
    </>
  ),
  // A dress form on its stand.
  'dress-form': (
    <>
      <path d="M9 3h6c0 2 1.5 3 1.5 5 0 2.5-1.8 3.2-1.8 5.5 0 1.6 1.3 2.2 1.3 3.5H8c0-1.3 1.3-1.9 1.3-3.5C9.3 11.2 7.5 10.5 7.5 8 7.5 6 9 5 9 3z" />
      <path d="M12 17v4M9 21h6M8.4 7.5h7.2" />
    </>
  ),
  // A threaded needle.
  needle: (
    <>
      <path d="M19 4 6 17l-1.5 2.5L7 18 20 5z" />
      <path d="M17.2 5.8l1 1" />
      <path d="M18.4 5.6c-3 1-2.6 5-6 5.6S6 12 5 15.5" strokeDasharray="2 2" />
    </>
  ),
  // A ring with a set stone.
  ring: (
    <>
      <circle cx="12" cy="14.5" r="6" />
      <path d="M9.5 8.8 10 6h4l.5 2.8M10 6l2-2.5L14 6" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h2.5l1.5-2h6l1.5 2H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="1.5" />
      <path d="m16 10.5 5-3v9l-5-3" />
    </>
  ),
};

function Mark({ icon }: { icon: string }) {
  const drawn = DRAWN[icon];
  if (drawn)
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-9 w-9 shrink-0 text-[#D6C3EA]" {...STROKE}>
        {drawn}
      </svg>
    );
  // Software: its two-letter mark in a rounded tile.
  return (
    <span aria-hidden className="grid h-9 min-w-9 shrink-0 place-items-center rounded-[9px] border-[1.5px] border-[#D6C3EA] px-1.5 text-[13px] font-semibold tracking-tight text-[#D6C3EA]">
      {icon}
    </span>
  );
}

function List({ copy }: { copy?: boolean }) {
  return (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center gap-x-12 pr-12 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-5 motion-reduce:pr-0">
      {heroSkills.map((s) => (
        <li key={s.name} className="flex items-center gap-3 whitespace-nowrap text-[15px] text-[#CFC1DB]">
          <Mark icon={s.icon} />
          {s.name}
        </li>
      ))}
    </ul>
  );
}

export function SkillsMarquee() {
  return (
    <div className="border-y border-[#D6C3EA]/15 bg-[#200E27]/40 py-6">
      <h2 className="sr-only">Skills and software</h2>
      <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]">
        <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:px-4">
          <List />
          <div className="contents motion-reduce:hidden">
            <List copy />
          </div>
        </div>
      </div>
    </div>
  );
}
