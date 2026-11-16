'use client';

// Concept C, "index and folio": every project title on the left, the work beside it,
// and one switch between the finished outcome and the process behind it.
// Desktop: hover or focus a title to show it. Mobile: one stacked card per project, same switch.
// Below the hero the selected project colours the whole page, the first on arrival. While the hero
// (`heroId`) still fills most of the screen, the page keeps the hero's own colours instead.

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Picture } from '@/components/media/Picture';
import { PageFinish } from '@/components/site/PageFinish';
import type { FolioEntry } from '@/lib/folio';
import { projectColors } from '@/lib/project-colors';

type View = 'outcome' | 'process';

/** Where the visitor was in the list when they opened a project. Kept on the home page's history entry, so Back returns there instead of to the hero. */
type Place = { y: number; active: number; view: View };

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
          className={`touch-manipulation rounded-full px-3.5 py-1 transition-colors pointer-coarse:px-5 pointer-coarse:py-2.5 pointer-coarse:text-[13px] ${
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
  /** The title a finger or pen has just pressed, if it wasn't the one showing (see the list below). */
  const picking = useRef<number | null>(null);

  // Opening a project notes the place in the list on this history entry (Next keeps extra fields on it).
  const leave = (i: number) => () => {
    const place: Place = { y: window.scrollY, active: i, view };
    window.history.replaceState({ ...window.history.state, folio: place }, '');
  };

  // Back from a project: straight to that place, before the first paint, and again once the browser has had its say.
  useLayoutEffect(() => {
    const place = (window.history.state as { folio?: Place } | null)?.folio;
    if (!place || !entries[place.active]) return;
    const go = () => window.scrollTo({ top: place.y, behavior: 'instant' });
    /* eslint-disable react-hooks/set-state-in-effect -- read once from the history entry, which the server render can't see */
    setActive(place.active);
    setView(place.view);
    setInWork(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    go();
    const raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, [entries]);

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
      {/* Where the header's Work link lands: the list, clear of the sticky header. */}
      <div id="work" className="scroll-mt-[4.5rem]">
      {/*
        Tablet and desktop: index and folio side by side, a list and its detail.
        A mouse shows a project by pointing at its title and opens it with a click. A finger can't point
        without pressing, so a tap on a title shows it and never opens it by surprise; the one showing
        then opens with one tap on its title (now marked with an arrow), on its pictures or on the button
        under them. Decided per press from the pointer's type, so laptops with touch screens and tablets
        with trackpads get both. The keyboard is unchanged: focus shows, Enter opens.
      */}
      <div className="hidden grid-cols-12 gap-8 md:grid">
        <nav aria-label="Projects" className="col-span-5 self-start md:sticky md:top-24">
          <ol className="grid gap-1">
            {entries.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onPointerDown={(ev) => {
                    picking.current = ev.pointerType !== 'mouse' && i !== active ? i : null;
                  }}
                  onPointerCancel={() => {
                    picking.current = null;
                  }}
                  onPointerEnter={(ev) => {
                    if (ev.pointerType === 'mouse') setActive(i);
                  }}
                  onFocus={() => setActive(i)}
                  onClick={(ev) => {
                    // `detail` is 0 when the keyboard or a screen reader activates the link.
                    if (ev.detail > 0 && picking.current === i) {
                      ev.preventDefault();
                      setActive(i);
                    } else {
                      leave(i)();
                    }
                    picking.current = null;
                  }}
                  aria-current={i === active ? 'true' : undefined}
                  className={`group grid touch-manipulation grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline py-2.5 transition-colors [-webkit-tap-highlight-color:transparent] ${
                    i === active ? 'text-ink' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  <span className="text-[12px] tabular-nums">{pad(i)}</span>
                  <span className="font-display text-[clamp(30px,3.3vw,52px)] leading-[1.06]">{p.title}</span>
                  {/* Always there, so a title never rewraps when it is picked. */}
                  <span
                    aria-hidden
                    className={`ml-3 grid h-9 w-9 place-items-center self-center rounded-full border border-current text-[15px] transition-opacity duration-300 ${
                      i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <section aria-label={`${e.title}, ${view}`} className="col-span-7">
          <div className="mb-3 flex justify-end">
            <ViewSwitch view={view} onChange={setView} />
          </div>
          {/* The button's link is stretched over the pictures too (its ::after), so the whole preview opens the project. */}
          <div className="relative">
            <div key={`${e.slug}-${view}`} className="motion-safe:animate-fade">
              {view === 'outcome' ? <Outcome e={e} sizes={['(min-width: 768px) 55vw, 100vw', '(min-width: 768px) 27vw, 50vw']} /> : <Process e={e} />}
            </div>
            <Link
              href={`/work/${e.slug}${view === 'process' ? '#process' : ''}`}
              onClick={leave(active)}
              className="mt-4 inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full border border-ink px-5 text-[14px] font-medium transition-colors after:absolute after:inset-0 hover:bg-ink hover:text-paper"
            >
              {view === 'process' ? `Open the ${e.title} process` : `View ${e.title}`} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Phones: one card per project; the switch applies to all of them. The whole card opens its project in one tap. */}
      <div className="md:hidden">
        <div className="sticky top-14 z-30 -mx-4 mb-2 flex justify-end border-b border-line bg-paper/90 px-4 py-2 backdrop-blur-sm">
          <ViewSwitch view={view} onChange={setView} />
        </div>
        <ol ref={cards} className="grid gap-12">
          {entries.map((p, i) => (
            <li key={p.slug} className="relative transition-opacity has-[a:active]:opacity-80">
              <Link
                href={`/work/${p.slug}${view === 'process' ? '#process' : ''}`}
                onClick={leave(i)}
                className="block touch-manipulation [-webkit-tap-highlight-color:transparent] after:absolute after:inset-0"
              >
                <span className="font-display text-[34px] leading-[1.05]">
                  <span className="mr-2 align-[0.55em] font-sans text-[11px] tabular-nums text-ink-3">{pad(i)}</span>
                  {p.title}
                </span>
              </Link>
              <div className="mt-3">
                {view === 'outcome' ? <Outcome e={p} sizes={['100vw', '50vw']} /> : <Process e={p} />}
              </div>
              <p aria-hidden className="mt-3 text-[14px] underline decoration-line underline-offset-4">
                {view === 'process' ? 'Open the process' : 'View project'} →
              </p>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </>
  );
}
