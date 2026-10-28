import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/content/projects/index.ts';
import { categories } from '@/content/categories.ts';
import { resolveMedia, type ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { Seam } from '@/components/motif/Seam';
import { UnstitchReveal } from '@/components/motif/UnstitchReveal';

// A working page for the design system, not part of the portfolio.
export const metadata: Metadata = { title: 'Style tile', robots: { index: false, follow: false } };

const core = [
  { name: 'Warm Beige', token: 'beige', hex: '#F4E2CC', role: 'Background and base: pages, the atelier walls' },
  { name: 'Forest Green', token: 'forest', hex: '#2F5643', role: 'Primary accent: buttons, labels, focus' },
  { name: 'Warm Orange', token: 'orange', hex: '#E69E52', role: 'Highlights and hover fills (not for text)' },
  { name: 'Rust Brown', token: 'rust', hex: '#9E4F2E', role: 'Earthy details: the thread, stitches, cursor trail' },
  { name: 'Deep Burgundy', token: 'burgundy', hex: '#572530', role: 'Dark accent and contrast: viewers, overlays' },
  { name: 'Cream', token: 'cream', hex: '#FBF4EA', role: 'Raised surfaces: cards, panels' },
  { name: 'Ink', token: 'ink', hex: '#2B1A1D', role: 'Text: near-black burgundy' },
  { name: 'Clay', token: 'clay', hex: '#D9BE9C', role: 'Grey-box 3D and dress forms' },
];

const cover = (slug: string) => {
  const p = projects.find((x) => x.slug === slug)!;
  return resolveMedia(slug, p.cover) as ResolvedImage;
};

export default function StyleTile() {
  const featured = projects.filter((p) => ['cultural-echoes', 'glacier', 'clue-styling'].includes(p.slug));
  const glacier = projects.find((p) => p.slug === 'glacier')!;
  const echoes = projects.find((p) => p.slug === 'cultural-echoes')!;
  const arabia = projects.find((p) => p.slug === 'arabia')!;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 pb-32 sm:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="label text-ink-soft">Style tile · v1 · Phase 1</p>
        <Link href="/" className="stitch-link label">
          Back to the atelier
        </Link>
      </header>

      {/* Wordmark */}
      <section className="mt-16 sm:mt-24">
        <h1 className="font-display text-display font-light tracking-[-0.03em]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}>
          Aya Hafez
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p lang="ar" dir="rtl" className="text-3xl font-light sm:text-4xl">
            آية حافظ
          </p>
          <Seam className="w-24" ends />
          <p className="label text-ink-soft">Fashion designer · Cairo</p>
        </div>
      </section>

      <Seam className="mt-20" ends />

      {/* Palette */}
      <section className="mt-12">
        <h2 className="label text-ink-soft">01 · Core palette</h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          The atelier stays quiet and warm so each project&rsquo;s own colours can take over the room when you enter it.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {core.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-sm bg-cream">
              <div className="h-24" style={{ background: c.hex }} />
              <div className="p-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-ink-soft tabular-nums">{c.hex}</p>
                <p className="mt-1 text-xs text-ink-soft">{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="label mt-14 text-ink-soft">Project worlds</h3>
        <div className="mt-6 space-y-2">
          {projects.map((p) => (
            <div key={p.slug} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-sm bg-cream p-3 sm:grid-cols-[14rem_1fr_auto]">
              <p className="font-display text-lg">{p.title}</p>
              <p className="hidden text-sm text-ink-soft sm:block">{p.theme.motif}</p>
              <div className="flex">
                {p.theme.palette.map((hex) => (
                  <span key={hex} title={hex} className="-ml-1.5 h-8 w-8 rounded-full ring-2 ring-cream first:ml-0" style={{ background: hex }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Seam className="mt-20" ends />

      {/* Type */}
      <section className="mt-12">
        <h2 className="label text-ink-soft">02 · Typography</h2>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
            <p className="label text-forest">The Atelier Floor · 01</p>
            <p className="mt-3 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
              {echoes.title}
            </p>
            <p lang="ar" dir="rtl" className="mt-1 text-right text-2xl font-light text-ink-soft sm:text-left">
              {echoes.titleAr}
            </p>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">{echoes.summary}</p>

            <blockquote className="mt-12 border-l-[1.5px] border-dashed border-thread pl-6">
              <p className="font-display text-3xl leading-tight font-light italic" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 100' }}>
                &ldquo;{glacier.sections[0].quote!.text}&rdquo;
              </p>
              <footer className="label mt-4 text-ink-soft">{glacier.sections[0].quote!.by} · Glacier</footer>
            </blockquote>

            <div className="mt-12 max-w-[62ch] rounded-sm bg-cream p-6" lang="ar" dir="rtl">
              <p className="label text-ink-soft" lang="en" dir="ltr">
                Arabic body · Alexandria · from the Arabia deck
              </p>
              <p className="mt-3 text-lg leading-loose">{arabia.sections[0].bodyAr![0]}</p>
            </div>
          </div>

          <dl className="space-y-5 text-sm">
            {[
              ['Display', 'Fraunces Light, opsz 144, soft 50. Names and project titles.'],
              ['Headline', 'Fraunces Light, opsz 96. Section and project headings.'],
              ['Quote', 'Fraunces Light Italic, soft 100. Pull quotes, statements.'],
              ['Body', 'Instrument Sans 16–18 px, line-height 1.6, max 62ch.'],
              ['Label', 'Instrument Sans Semibold, 11.5 px caps, tracking 0.16em. Rooms, kinds, credits.'],
              ['Arabic', 'Alexandria (designed in Egypt). Light for titles, Regular for body.'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-1 text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Seam className="mt-20" ends />

      {/* Motif */}
      <section className="mt-12">
        <h2 className="label text-ink-soft">03 · Thread & seam motif</h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          One idea, used everywhere: a running stitch in rust-brown thread. It marks dividers, underlines links and follows the
          cursor. Move your mouse anywhere on this page: the needle sews as it goes.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="label mb-3">Seam divider</p>
              <Seam ends />
            </div>
            <div>
              <p className="label mb-3">Stitched in on reveal</p>
              <Seam animate />
            </div>
            <div>
              <p className="label mb-3">Links</p>
              <p className="text-lg">
                Read the <a href="#" className="stitch-link">documentation booklet</a> or watch the{' '}
                <a href="#" className="stitch-link">full film</a>.
              </p>
            </div>
            <div>
              <p className="label mb-3">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" data-cursor="Enter" className="label rounded-full bg-forest px-5 py-3 text-cream transition-colors hover:bg-burgundy">
                  Enter the atelier
                </button>
                <button
                  type="button"
                  className="label rounded-full border-[1.5px] border-dashed border-ink/40 px-5 py-3 transition-colors hover:border-forest hover:text-forest"
                >
                  Index
                </button>
              </div>
            </div>
            <div>
              <p className="label mb-3">Cursor labels</p>
              <p className="text-ink-soft">Hover these with a mouse:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Open', 'Play film', 'Spin', 'Read booklet'].map((l) => (
                  <span key={l} data-cursor={l} className="rounded-sm bg-cream px-3 py-2 text-sm">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="label mb-3">Unstitch transition (click)</p>
            <UnstitchReveal label="Unstitch Glacier">
              <Picture image={cover('glacier')} sizes="(min-width: 768px) 50vw, 100vw" className="h-full" />
            </UnstitchReveal>
          </div>
        </div>
      </section>

      <Seam className="mt-20" ends />

      {/* Components */}
      <section className="mt-12">
        <h2 className="label text-ink-soft">04 · Project cards</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {featured.map((p) => {
            const room = categories.find((c) => c.id === p.category)!.room;
            return (
              <article key={p.slug} data-cursor="Open" className="group">
                <div className="relative overflow-hidden rounded-sm">
                  <Picture
                    image={cover(p.slug)}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="aspect-[3/4] transition-transform duration-700 ease-[var(--ease-thread)] group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-2 rounded-[1px] border-[1.5px] border-dashed border-cream/0 transition-colors duration-500 group-hover:border-cream/80" />
                </div>
                <p className="label mt-4 text-ink-soft">{room}</p>
                <h3 className="mt-1 font-display text-2xl font-light">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>
                <div className="mt-3 flex gap-1">
                  {p.theme.palette.slice(0, 4).map((hex) => (
                    <span key={hex} className="h-1.5 w-6 rounded-full" style={{ background: hex }} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <h3 className="label mt-16 text-ink-soft">Index row</h3>
        <ul className="mt-4">
          {projects.map((p, i) => (
            <li key={p.slug} data-cursor="Open" className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-b border-dashed border-seam py-4">
              <span className="text-sm text-ink-soft tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-xl font-light transition-colors group-hover:text-forest sm:text-2xl">{p.title}</span>
              <span className="label hidden text-ink-soft sm:block">{categories.find((c) => c.id === p.category)!.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
