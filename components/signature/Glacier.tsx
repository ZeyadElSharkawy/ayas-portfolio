'use client';

import { useEffect, useState } from 'react';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { useInView } from '@/lib/use-scroll-progress';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cue } from '@/lib/sound';

export function GlacierSignature({ statement, images }: { statement: string; images: ResolvedImage[] }) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [inViewRef, seen] = useInView<HTMLElement>(0.35);
  const typed = useTypewriter(statement, seen && !reduced);

  useEffect(() => {
    if (reduced || !seen) return;
    const timer = window.setTimeout(() => {
      cue('shatter');
      setRevealed(true);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [reduced, seen]);

  const opened = revealed || reduced;

  return (
    <section ref={inViewRef} aria-labelledby="glacier-sig-title" className="bg-[#0f2a5c] py-16 text-[#e8eef8] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label text-[#7fd3e6]">Glacier · Behind perfection</p>
        <h2 id="glacier-sig-title" className="mt-2 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
          Beneath the ice
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-[#e8eef8]/80">
          The ice breaks away to reveal the complete lookbook.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-sm">
          <div className="grid grid-cols-1 gap-1 bg-[#0f2a5c] sm:grid-cols-3">
            {images.map((img) => (
              <Picture key={img.src} image={img} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/5] sm:aspect-[3/4]" />
            ))}
          </div>

          <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }, (_, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const x = col - 1.5;
              const y = row - 1.5;
              const angle = ((i * 17) % 25) - 12;
              return (
                <span
                  key={i}
                  className={`border border-white/35 transition-[opacity,transform] ease-[cubic-bezier(.65,0,.35,1)] ${
                    reduced ? 'duration-0' : 'duration-[950ms]'
                  }`}
                  style={{
                    background:
                      'linear-gradient(135deg, rgb(238 248 255 / 0.94), rgb(184 214 235 / 0.93)), radial-gradient(circle at 30% 20%, white, transparent 70%)',
                    boxShadow: 'inset 0 0 18px rgb(255 255 255 / 0.45)',
                    opacity: opened ? 0 : 1,
                    transform: opened ? `translate(${x * 42}px, ${y * 48}px) rotate(${angle}deg) scale(0.82)` : 'translate(0, 0) rotate(0) scale(1)',
                    transitionDelay: `${i * 18}ms`,
                  }}
                />
              );
            })}
            <p
              className="absolute inset-x-6 top-[12%] mx-auto max-w-2xl text-center font-display text-2xl leading-snug font-light text-[#0f2a5c] italic transition-opacity duration-500 sm:text-4xl"
              style={{ fontVariationSettings: '"SOFT" 100', opacity: opened ? 0 : 1 }}
            >
              {reduced ? statement : typed}
            </p>
          </div>
          {!reduced && <Snow />}
        </div>
        <p className="sr-only" aria-live="polite">
          {opened ? 'The ice has broken away; all three looks are revealed.' : 'The ice is breaking away.'}
        </p>
      </div>
    </section>
  );
}

function useTypewriter(text: string, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const id = window.setInterval(() => setCount((current) => (current >= text.length ? (window.clearInterval(id), current) : current + 1)), 38);
    return () => window.clearInterval(id);
  }, [start, text]);
  return text.slice(0, count);
}

function Snow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          className="absolute -top-2 block rounded-full bg-white/80"
          style={{
            left: `${(i * 37) % 100}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            animation: `snow-fall ${6 + (i % 5)}s linear ${-(i * 0.7)}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
