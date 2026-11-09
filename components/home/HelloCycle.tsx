'use client';

// "Hello" in each language she speaks, one after another. All the words share one grid cell, so the
// line keeps the width of the longest and nothing below it moves. Screen readers get the first word
// only; under reduced motion it stays on that word.

import { useEffect, useState } from 'react';

export function HelloCycle({ words, every = 2400 }: { words: readonly { text: string; lang: string }[]; every?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), every);
    return () => window.clearInterval(id);
  }, [words.length, every]);

  return (
    <span className="inline-grid">
      <span className="sr-only">{words[0].text}</span>
      {words.map((w, n) => (
        <span
          key={w.lang}
          aria-hidden
          lang={w.lang}
          dir={w.lang === 'ar' ? 'rtl' : undefined}
          className={`[grid-area:1/1] justify-self-start transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none ${
            w.lang === 'ar' ? 'font-arabic text-[0.92em] leading-[1.2]' : ''
          } ${n === i ? 'opacity-100' : 'translate-y-[0.25em] opacity-0 blur-[6px]'}`}
        >
          {w.text}
        </span>
      ))}
    </span>
  );
}
