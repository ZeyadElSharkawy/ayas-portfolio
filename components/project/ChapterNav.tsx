'use client';

// Sticky list of the project's chapters; marks the one in view.

import { useEffect, useState } from 'react';

export function ChapterNav({ chapters }: { chapters: { id: string; title: string }[] }) {
  const [current, setCurrent] = useState(chapters[0]?.id);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="Chapters" className="sticky top-24">
      <ol className="grid gap-1.5 text-[13px]">
        {chapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={c.id === current ? 'location' : undefined}
              className={`flex items-center gap-2 transition-colors ${c.id === current ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
            >
              <span aria-hidden className={`h-px transition-all ${c.id === current ? 'w-5 bg-ink' : 'w-2.5 bg-line'}`} />
              {c.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
