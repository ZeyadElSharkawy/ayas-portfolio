'use client';

// Concept C, "index and folio": every project title on the left, the work beside it,
// and one switch between the finished outcome and the process behind it.
// Desktop: hover or focus a title to show it. Mobile: one stacked card per project, same switch.

import Link from 'next/link';
import { useState } from 'react';
import { Picture } from '@/components/media/Picture';
import type { FolioEntry } from '@/lib/folio';

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
      <div className="col-span-2 aspect-[4/5] overflow-hidden bg-tint md:aspect-[5/4]">
        <Picture img={lead} sizes={sizes[0]} fill />
      </div>
      {rest.map((img) => (
        <div key={img.src} className="aspect-[3/4] overflow-hidden bg-tint">
          <Picture img={img} sizes={sizes[1]} fill />
        </div>
      ))}
    </div>
  );
}

function Process({ e }: { e: FolioEntry }) {
  if (!e.process.length) {
    return <p className="py-10 text-[14px] text-ink-2">The process for this project is documented on its page.</p>;
  }
  return (
    <div className="grid gap-4">
      {e.process.map((c) => (
        <div key={c.title} className="grid grid-cols-[84px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
          <span className="pt-1 text-[12px] text-ink-2">{c.title}</span>
          <div className="grid grid-cols-4 gap-1.5">
            {c.images.map((img) => (
              <div key={img.src} className="aspect-square overflow-hidden bg-tint">
                <Picture img={img} sizes="(min-width: 768px) 10vw, 20vw" fill />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Folio({ entries }: { entries: FolioEntry[] }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>('outcome');
  const e = entries[active];

  return (
    <>
      {/* Desktop: index and folio side by side */}
      <div className="hidden grid-cols-12 gap-8 md:grid">
        <nav aria-label="Projects" className="col-span-5 self-start md:sticky md:top-24">
          <ol>
            {entries.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={i === active ? 'true' : undefined}
                  className={`group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline py-1 transition-colors ${
                    i === active ? 'text-ink' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  <span className="text-[12px] tabular-nums">{pad(i)}</span>
                  <span className="font-serif text-[clamp(30px,3.3vw,52px)] leading-[1.06] tracking-tight">{p.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <section aria-label={`${e.title}, ${view}`} className="col-span-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="truncate text-[13px] text-ink-2">
              <span className="text-ink">{e.label}</span> · {e.tagline}
            </p>
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
        <ol className="grid gap-12">
          {entries.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}${view === 'process' ? '#process' : ''}`} className="block">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-[34px] leading-[1.05] tracking-tight">
                    <span className="mr-2 align-[0.55em] font-sans text-[11px] tabular-nums text-ink-3">{pad(i)}</span>
                    {p.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-2">{p.label}</span>
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
