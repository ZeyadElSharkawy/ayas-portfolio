'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

type RevealStyle = 'door' | 'curtains';

export function ProjectReveal({ style }: { style: RevealStyle }) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    const start = window.setTimeout(() => setOpening(true), 120);
    const finish = window.setTimeout(() => setRevealed(true), style === 'door' ? 2000 : 1500);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(finish);
    };
  }, [reduced, style]);

  if (reduced || revealed) return null;

  const curtainBackground =
    'repeating-linear-gradient(90deg, #4a0610 0, #9e1328 2.2%, #c0223a 3.1%, #7d0c1d 4.6%, #4a0610 6.4%)';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] grid place-items-center overflow-hidden transition-[opacity,transform] ${
        style === 'door' ? 'bg-[#d8bd93]' : 'bg-[#1a0a0d]'
      } ${opening ? 'opacity-0' : 'opacity-100'} ${
        style === 'door'
          ? opening
            ? 'duration-[1800ms] ease-[cubic-bezier(.65,0,.35,1)]'
            : 'duration-0'
          : opening
            ? 'duration-[1300ms] ease-[cubic-bezier(.55,0,.25,1)]'
            : 'duration-0'
      }`}
      style={
        style === 'door'
          ? {
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0 54px, rgb(120 88 52 / 0.22) 54px 56px), radial-gradient(ellipse at 50% 40%, rgb(255 240 210 / 0.55), transparent 70%)',
              transform: opening ? 'scale(7)' : 'scale(1)',
            }
          : undefined
      }
    >
      {style === 'door' ? (
        <div className="relative grid h-[min(68vh,42rem)] w-[min(72vw,32rem)] grid-cols-2 overflow-hidden rounded-t-[50%] border-[1.2rem] border-[#c4a273] shadow-2xl" style={{ perspective: '1200px' }}>
          {(['left', 'right'] as const).map((side) => (
            <div
              key={side}
              className="h-full border-2 border-[#0f4b52] transition-transform duration-[1100ms] ease-[cubic-bezier(.65,0,.35,1)]"
              style={{
                transformOrigin: side === 'left' ? 'left center' : 'right center',
                transform: opening ? `rotateY(${side === 'left' ? -108 : 108}deg)` : 'rotateY(0deg)',
                backgroundColor: '#1d8a96',
                backgroundImage:
                  'radial-gradient(circle, #d1aa55 0 2.2px, transparent 2.8px), linear-gradient(to right, rgb(0 0 0 / 0.12), transparent 18%, transparent 82%, rgb(0 0 0 / 0.18))',
                backgroundSize: '26px 32px, 100% 100%',
                backgroundPosition: '13px 16px, 0 0',
                backfaceVisibility: 'hidden',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
          <div
            className="absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(.55,0,.25,1)]"
            style={{ transform: opening ? 'scaleX(0.08)' : 'scaleX(1)', background: curtainBackground, boxShadow: 'inset -12px 0 28px rgb(0 0 0 / 0.55)' }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-[1200ms] ease-[cubic-bezier(.55,0,.25,1)]"
            style={{ transform: opening ? 'scaleX(0.08)' : 'scaleX(1)', background: curtainBackground, boxShadow: 'inset 12px 0 28px rgb(0 0 0 / 0.55)' }}
          />
          <div className="absolute inset-x-0 top-0 h-[9vh] border-b-2 border-[#c9a04a] bg-[#6b0a18]" />
          <p className="absolute inset-0 grid place-items-center font-display text-3xl text-[#f7a8c4]">Identity Breakdown</p>
        </div>
      )}
    </div>
  );
}
