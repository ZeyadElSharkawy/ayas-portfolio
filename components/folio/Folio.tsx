'use client';

// Concept C, "index and folio": every project title on the left, the work beside it,
// and one switch between the finished outcome and the process behind it.
// Desktop: hover or focus a title to show it. Mobile: one stacked card per project, same switch.
// Below the hero the selected project colours the whole page, the first on arrival. While the hero
// (`heroId`) still fills most of the screen, the page keeps the hero's own colours instead.

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/media/Picture';
import { PageFinish } from '@/components/site/PageFinish';
import type { FolioEntry } from '@/lib/folio';
import { projectColors } from '@/lib/project-colors';

type View = 'outcome' | 'process';

const pad = (i: number) => String(i + 1).padStart(2, '0');

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div role="group" aria-label="Show" className="inline-flex rounded-full border border-line p-0.5 text-[12px]">
      {(['outcome', 'process'] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => onChange(v)}
          className={`rounded-full px-3.5 py-1 transition-colors ${
            view === v ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {v === 'outcome' ? 'Outcome' : 'Process'}
        </button>
      ))}
    </div>
  );
}

function Outcome({ e, sizes }: { e: FolioEntry; sizes: [string, string] }) {
  const [lead, ...rest] = e.outcome;
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={`col-span-2 aspect-[4/5] overflow-hidden md:aspect-[5/4] ${e.contain ? '' : 'bg-tint'}`}>
        <Picture image={lead} sizes={sizes[0]} fit={e.contain ? 'contain' : 'cover'} placeholder={!e.contain} className="h-full" />
      </div>
      {rest.map((img) => (
        <div key={img.src} className={`aspect-[3/4] overflow-hidden ${e.contain ? '' : 'bg-tint'}`}>
          <Picture image={img} sizes={sizes[1]} fit={e.contain ? 'contain' : 'cover'} placeholder={!e.contain} className="h-full" />
        </div>
      ))}
    </div>
  );
}

function Process({ e }: { e: FolioEntry }) {
  if (!e.process.length) {
    return <p className="py-10 text-[14px] text-ink-2">This project is shown through its finished work.</p>;
  }
  return (
    <div className="grid gap-4">
      {e.process.map((c) => (
        <div key={c.title} className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
          <span className="pt-1 text-[12px] text-ink-2">{c.title}</span>
          <div className="grid grid-cols-4 gap-1.5">
            {c.images.map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden bg-tint">
                <Picture image={img} sizes="(min-width: 768px) 10vw, 20vw" className="h-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Folio({ entries, heroId }: { entries: FolioEntry[]; heroId?: string }) {
  const [active, setActive] = useState(0);
  const [inWork, setInWork] = useState(!heroId);
  const [view, setView] = useState<View>('outcome');
  const e = entries[active];
  const cards = useRef<HTMLOListElement>(null);

  // In the work once the hero's bottom edge has risen above the middle of the screen.
  useEffect(() => {
    const hero = heroId ? document.getElementById(heroId) : null;
    if (!hero) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      setInWork(hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [heroId]);

  // The page colours fade between the hero's and the project's (they're registered with @property).
  useEffect(() => {
    const root = document.documentElement.style;
    const colors = Object.entries(projectColors(inWork ? entries[active].slug : 'home'));
    colors.forEach(([k, v]) => root.setProperty(k, v));
    return () => colors.forEach(([k]) => root.removeProperty(k));
  }, [active, entries, inWork]);

  // The header is see-through over the hero and solid in the work. It flips in the same frame as the
  // colours above, so its fill fades with the page instead of trailing it (globals.css, data-in-work).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-in-work', inWork);
    return () => document.documentElement.removeAttribute('data-in-work');
  }, [inWork]);

  // Phones have no hover: the card crossing the middle of the screen is the selected one.
  useEffect(() => {
    const items = Array.from(cards.current?.children ?? []);
    const io = new IntersectionObserver(
      (seen) => seen.forEach((s) => s.isIntersecting && setActive(items.indexOf(s.target))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {inWork && <PageFinish slug={e.slug} />}
      {/* Desktop: index and folio side by side */}
      <div className="hidden grid-cols-12 gap-8 md:grid">
        <nav aria-label="Projects" className="col-span-5 self-start md:sticky md:top-24">
          <ol className="grid gap-1">
            {entries.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={i === active ? 'true' : undefined}
                  className={`group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline py-2.5 transition-colors ${
                    i === active ? 'text-ink' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  <span className="text-[12px] tabular-nums">{pad(i)}</span>
                  <span className="font-display text-[clamp(30px,3.3vw,52px)] leading-[1.06]">{p.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <section aria-label={`${e.title}, ${view}`} className="col-span-7">
          <div className="mb-3 flex justify-end">
            <ViewSwitch view={view} onChange={setView} />
          </div>
          <div key={`${e.slug}-${view}`} className="motion-safe:animate-fade">
            {view === 'outcome' ? <Outcome e={e} sizes={['(min-width: 768px) 55vw, 100vw', '(min-width: 768px) 27vw, 50vw']} /> : <Process e={e} />}
          </div>
          <Link
            href={`/work/${e.slug}${view === 'process' ? '#process' : ''}`}
            className="mt-4 inline-block text-[14px] underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            {view === 'process' ? `Open the ${e.title} process` : `View ${e.title}`} <span aria-hidden>→</span>
          </Link>
        </section>
      </div>

      {/* Mobile: one card per project; the switch applies to all of them */}
      <div className="md:hidden">
        <div className="sticky top-14 z-30 -mx-4 mb-2 flex justify-end border-b border-line bg-paper/90 px-4 py-2 backdrop-blur-sm">
          <ViewSwitch view={view} onChange={setView} />
        </div>
        <ol ref={cards} className="grid gap-12">
          {entries.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}${view === 'process' ? '#process' : ''}`} className="block">
                <span className="font-display text-[34px] leading-[1.05]">
                  <span className="mr-2 align-[0.55em] font-sans text-[11px] tabular-nums text-ink-3">{pad(i)}</span>
                  {p.title}
                </span>
              </Link>
              <div className="mt-3">
                {view === 'outcome' ? <Outcome e={p} sizes={['100vw', '50vw']} /> : <Process e={p} />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
