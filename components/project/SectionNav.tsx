'use client';

// Sticky contents for a project page; the section in view gets a stitched marker.

import { useEffect, useState } from 'react';

export function SectionNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band near the top of the viewport: whichever section crosses it is "current".
      { rootMargin: '-20% 0px -70% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page">
      <ol className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className={`group flex items-center gap-3 py-1 text-sm transition-colors ${active === s.id ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
            >
              <span
                aria-hidden
                className={`stitch w-5 shrink-0 text-thread transition-opacity ${active === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
              />
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
