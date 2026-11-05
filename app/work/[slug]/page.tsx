import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProject } from '@/content/projects';
import { categoryOf } from '@/content/categories';
import type { Chapter, Project, Section } from '@/content/types';
import { chapterTitles, processChapters, sectionsIn } from '@/lib/chapters';
import { resolveMedia } from '@/lib/media';
import { largest } from '@/lib/media-urls';
import { Picture } from '@/components/media/Picture';
import { MediaGrid } from '@/components/project/Media';
import { ChapterNav } from '@/components/project/ChapterNav';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const hero = resolveMedia(p.slug, p.hero);
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${p.title} · Aya Hafez`,
      description: p.summary,
      url: `/work/${p.slug}`,
      images: hero.kind === 'video' ? undefined : [{ url: largest(hero), width: hero.width, height: hero.height, alt: hero.alt }],
    },
  };
}

function SectionBlock({ p, s }: { p: Project; s: Section }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 lg:grid-cols-12">
        <h3 className="font-serif text-[clamp(26px,2.6vw,36px)] leading-tight tracking-tight lg:col-span-4">{s.title}</h3>
        {(s.body || s.quote || s.bodyAr) && (
          <div className="grid max-w-prose gap-3 text-[15px] leading-relaxed text-ink-2 lg:col-span-8">
            {s.quote && (
              <blockquote className="font-serif text-[22px] italic leading-snug text-ink">
                “{s.quote.text}”
                <footer className="mt-1 font-sans text-[12px] not-italic text-ink-3">{s.quote.by}</footer>
              </blockquote>
            )}
            {s.body?.map((para) => <p key={para}>{para}</p>)}
            {s.bodyAr?.map((para) => (
              <p key={para} lang="ar" dir="rtl" className="font-arabic text-[17px]">{para}</p>
            ))}
          </div>
        )}
      </div>
      <MediaGrid media={s.media.map((m) => resolveMedia(p.slug, m))} />
    </div>
  );
}

function ChapterBlock({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="grid gap-12 border-t border-line pt-8">
      <h2 id={`${id}-h`} className="text-[12px] uppercase tracking-[0.14em] text-ink-2">{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];
  const hero = resolveMedia(p.slug, p.hero);

  const chapters: { id: Chapter; sections: Section[] }[] = (['outcome', ...processChapters] as Chapter[])
    .map((c) => ({ id: c, sections: sectionsIn(p, c) }))
    .filter((c) => c.sections.length > 0);
  const nav = [
    ...chapters.map((c) => ({ id: c.id, title: chapterTitles[c.id] })),
    ...(p.reflection ? [{ id: 'reflection', title: chapterTitles.reflection }] : []),
  ];
  const firstProcess = chapters.find((c) => c.id !== 'outcome')?.id;

  return (
    <article>
      <header className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-8 md:pt-16">
        <p className="text-[12px] text-ink-2">
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span> · {categoryOf(p.category).label}
          {p.client && <> · {p.client}</>}
          {p.year && <> · {p.year}</>}
        </p>
        <h1 className="mt-2 font-serif text-[clamp(52px,9vw,148px)] leading-[0.92] tracking-tight">{p.title}</h1>
        {p.titleAr && (
          <p lang="ar" dir="rtl" className="mt-2 text-right font-arabic text-[clamp(22px,2.4vw,32px)] text-ink-2 md:text-left">
            {p.titleAr}
          </p>
        )}
      </header>

      {hero.kind !== 'video' && (
        <div className="mx-auto mt-8 max-w-[1440px] sm:px-8">
          {/* Full width; tall images are cropped to 85% of the viewport height. */}
          <div className="w-full overflow-hidden bg-tint" style={{ height: `min(85svh, ${((hero.height / hero.width) * 100).toFixed(2)}vw)` }}>
            <Picture img={hero} sizes="(min-width: 1440px) 1376px, 100vw" fill priority />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-10 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-serif text-[clamp(24px,2.4vw,34px)] leading-snug tracking-tight">{p.tagline}</p>
          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-2">{p.summary}</p>
        </div>
        <dl className="grid content-start gap-x-6 gap-y-4 text-[14px] sm:grid-cols-2 lg:col-span-5">
          {p.facts.map((f) => (
            <div key={f.label} className="border-t border-line pt-2">
              <dt className="text-[12px] text-ink-3">{f.label}</dt>
              <dd className="mt-1">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1440px] gap-10 px-4 sm:px-8 lg:grid-cols-[160px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <ChapterNav chapters={nav} />
        </aside>
        <div className="grid gap-20">
          {chapters.map((c) => (
            <div key={c.id} className="grid gap-20">
              {c.id === firstProcess && (
                <div id="process" className="-mb-12">
                  <p className="font-serif text-[clamp(36px,4.4vw,64px)] leading-none tracking-tight">The process</p>
                </div>
              )}
              <ChapterBlock id={c.id} title={chapterTitles[c.id]}>
                {c.sections.map((s) => (
                  <SectionBlock key={s.title} p={p} s={s} />
                ))}
              </ChapterBlock>
            </div>
          ))}
          {p.reflection && (
            <ChapterBlock id="reflection" title={chapterTitles.reflection}>
              <div className="grid max-w-prose gap-3 text-[15px] leading-relaxed text-ink-2">
                {p.reflection.map((para) => <p key={para}>{para}</p>)}
              </div>
            </ChapterBlock>
          )}
          {p.credits.length > 0 && (
            <section aria-label="Credits" className="border-t border-line pt-8">
              <dl className="grid gap-x-6 gap-y-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
                {p.credits.map((c) => (
                  <div key={c.role + c.name}>
                    <dt className="text-[12px] text-ink-3">{c.role}</dt>
                    <dd>{c.name}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </div>

      <nav aria-label="Next project" className="mx-auto mt-24 max-w-[1440px] px-4 sm:px-8">
        <Link href={`/work/${next.slug}`} className="group flex items-baseline justify-between gap-6 border-t border-ink pt-5">
          <span className="text-[12px] text-ink-2">Next project</span>
          <span className="font-serif text-[clamp(32px,5vw,72px)] leading-none tracking-tight transition-transform motion-safe:group-hover:-translate-x-2">
            {next.title} <span aria-hidden>→</span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
