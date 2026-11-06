import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProject } from '@/content/projects';
import type { MediaRef, SectionKind } from '@/content/types';
import { chapterOf } from '@/lib/chapters';
import { documentPages, largest, resolveMedia, type ResolvedImage } from '@/lib/media';
import { projectColorsCss } from '@/lib/project-colors';
import { jsonLdHtml, openGraphBase, projectJsonLd } from '@/lib/site';
import { Picture } from '@/components/media/Picture';
import { PageFinish } from '@/components/site/PageFinish';
import { LightboxProvider } from '@/components/project/Lightbox';
import { MediaGrid, type GridItem } from '@/components/project/MediaGrid';
import { SectionNav } from '@/components/project/SectionNav';
import { BookletViewer } from '@/components/project/BookletViewer';
import { Video } from '@/components/project/Video';
import { heroes } from '@/components/project/Heroes';
import { Signature } from '@/components/signature/Signature';
import { ProjectReveal } from '@/components/signature/ProjectReveal';

export const dynamicParams = false;

const KIND_LABEL: Record<SectionKind, string> = {
  concept: 'Concept',
  research: 'Research',
  sketches: 'Sketches',
  materials: 'Materials & technique',
  construction: 'Construction',
  range: 'Range',
  digital: 'Digital',
  final: 'Final',
  film: 'Film',
  context: 'Context',
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const cover = resolveMedia(project.slug, project.cover) as ResolvedImage;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      ...openGraphBase,
      type: 'article',
      title: `${project.title} · Aya Hafez`,
      description: project.tagline,
      url: `/work/${project.slug}`,
      images: [{ url: largest(cover), width: cover.width, height: cover.height, alt: cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const { slug } = project;
  const hero = resolveMedia(slug, project.hero);
  const heroSet = project.heroSet?.map((ref) => resolveMedia(slug, ref) as ResolvedImage);
  const CustomHero = heroes[slug];
  const hoop =
    slug === 'into-her-skin' && hero.kind !== 'video'
      ? { src: '/media/into-her-skin/cutout/hoop', widths: [800, 1400], formats: ['webp'], width: 1400, height: 1988, color: 'transparent', alt: hero.alt }
      : null;

  // Every still in reading order feeds one lightbox; each grid item remembers its position in it.
  const lightbox: ResolvedImage[] = [];
  const inHero = (ref: MediaRef) => project.heroSet?.some((h) => h.kind === ref.kind && 'id' in h && 'id' in ref && h.id === ref.id);
  const sections = project.sections.filter((s) => !s.hidden).map((section, i) => {
    const items: GridItem[] = section.media.filter((ref) => !inHero(ref)).map((ref) => {
      const media = resolveMedia(slug, ref);
      if (media.kind === 'video') return { media };
      lightbox.push(media);
      return { media, lightboxIndex: lightbox.length - 1 };
    });
    return { ...section, id: `s${i + 1}-${section.kind}`, items };
  });
  // Where the home page's "Open the process" link lands.
  const firstProcess = sections.find((s) => chapterOf(s) !== 'outcome')?.id;

  const booklet = project.booklet && {
    title: project.booklet.title,
    pages: documentPages(slug, project.booklet.doc).map((p) => ({
      ...p,
      kind: 'page' as const,
      formats: ['webp'],
      alt: `${project.booklet!.title}, page ${p.n}`,
    })),
  };

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const jsonLd = projectJsonLd(project, largest(resolveMedia(slug, project.cover) as ResolvedImage));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: projectColorsCss(slug) }} />
      <PageFinish slug={slug} />
      {slug === 'cultural-echoes' && <ProjectReveal style="door" />}
      {slug === 'identity-breakdown' && <ProjectReveal style="curtains" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />

      <article className="overflow-x-clip">
        {CustomHero && heroSet ? (
          <CustomHero project={project} images={heroSet} />
        ) : heroSet ? (
          // Whole portraits, side by side: one tall photo alone sits small, and cropping it cuts heads off.
          <header className="mx-auto max-w-[1440px] px-4 pb-12 pt-10 sm:px-8 lg:pt-14">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
              <div>
                <h1 className="font-display text-[clamp(2.75rem,1.5rem+5vw,6.5rem)] leading-[0.98] tracking-[-0.01em]">{project.title}</h1>
                {project.titleAr && (
                  <p lang="ar" dir="rtl" className="mt-3 text-right text-2xl text-ink-2 lg:text-left">
                    {project.titleAr}
                  </p>
                )}
              </div>
              <div className="lg:pb-3">
                <p className="max-w-[38ch] text-lg font-medium leading-snug sm:text-xl">{project.tagline}</p>
                <div className="mt-5 flex gap-1.5" aria-hidden>
                  {project.palette.map((hex) => (
                    <span key={hex} className="h-2 w-8 rounded-full border border-line" style={{ background: hex }} />
                  ))}
                </div>
              </div>
            </div>
            <div role="group" aria-label="Looks" tabIndex={0} className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible">
              {heroSet.map((img, i) => (
                <div key={img.src} className="w-[78vw] shrink-0 snap-center md:mx-auto md:w-[min(100%,calc(80svh*0.667))]" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
                  <Picture image={img} sizes="(min-width: 768px) 33vw, 78vw" priority={i === 0} className="h-full" />
                </div>
              ))}
            </div>
          </header>
        ) : (
        <header className={`mx-auto grid max-w-[1440px] gap-8 px-4 pb-12 pt-10 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pt-16 ${hoop ? 'lg:items-center' : 'lg:items-end'}`}>
          <div className="lg:pb-6">
            <h1 className="font-display text-[clamp(2.75rem,1.5rem+5vw,6.5rem)] leading-[0.98]">{project.title}</h1>
            {project.titleAr && (
              <p lang="ar" dir="rtl" className="mt-3 text-right text-3xl text-ink-2 lg:text-left">
                {project.titleAr}
              </p>
            )}
            <p className="mt-6 max-w-[38ch] text-lg font-medium leading-snug sm:text-xl">{project.tagline}</p>
            <div className="mt-8 flex gap-1.5" aria-hidden>
              {project.palette.map((hex) => (
                <span key={hex} className="h-2 w-8 rounded-full border border-line" style={{ background: hex }} />
              ))}
            </div>
          </div>
          {hoop ? (
            // The page is cut away, so the hoop hangs on its cord from the header, as in her booklet.
            <div className="order-first -mt-10 flex justify-center lg:order-none lg:-mt-16">
              <div className="aspect-[1400/1988] w-[min(100%,calc(88svh*0.704))] origin-top motion-safe:animate-[hoop-sway_11s_ease-in-out_infinite]">
                <Picture image={hoop} sizes="(min-width: 1024px) 50vw, 100vw" priority fit="contain" placeholder={false} className="h-full" />
              </div>
            </div>
          ) : (
          <div className="flex justify-center lg:justify-end">
            {hero.kind === 'video' ? (
              <Video video={hero} />
            ) : (
              // Sized from the image's own proportions, so the whole picture always shows.
              <div style={{ aspectRatio: `${hero.width} / ${hero.height}`, width: `min(100%, calc(78svh * ${(hero.width / hero.height).toFixed(4)}))` }}>
                <Picture image={hero} sizes="(min-width: 1024px) 58vw, 100vw" priority className="h-full" />
              </div>
            )}
          </div>
          )}
        </header>
        )}

        <Signature project={project} />

        <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <p className="text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">{project.summary}</p>
            <dl className="grid content-start gap-y-4">
              {project.client && <Fact label="Client" value={project.client} />}
              {project.year && <Fact label="Year" value={String(project.year)} />}
              {project.facts.map((f) => (
                <Fact key={f.label} {...f} />
              ))}
            </dl>
          </div>
        </section>

        <LightboxProvider items={lightbox}>
          <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="label mb-4 text-ink-2">On this page</p>
                <SectionNav sections={sections.map((s) => ({ id: s.id, title: s.title ?? KIND_LABEL[s.kind] }))} />
              </div>
            </aside>

            <div className="space-y-20 lg:space-y-28">
              {sections.map((s, i) => {
                // One picture doesn't need a gallery: it shares the row with the words instead of sitting under them.
                const solo = s.items.length === 1 && s.items[0].media.kind !== 'video' ? (s.items[0].media as ResolvedImage) : null;
                const heading = (
                  <>
                    {s.id === firstProcess && <span id="process" />}
                    <p className="label text-accent">
                      {String(i + 1).padStart(2, '0')} · {KIND_LABEL[s.kind]}
                    </p>
                    {s.title && <h2 className="mt-2 font-display text-headline">{s.title}</h2>}
                  </>
                );
                return (
                  <section key={s.id} id={s.id} aria-label={s.title ?? KIND_LABEL[s.kind]} className="border-t border-line pt-8">
                    {solo && s.body && s.bodyAr ? (
                      <>
                        {heading}
                        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-12">
                          <Body paragraphs={s.body} />
                          <div className="lg:w-[var(--solo)]" style={{ '--solo': `min(30vw, calc(72svh * ${(solo.width / solo.height).toFixed(4)}))` } as CSSProperties}>
                            <MediaGrid items={s.items} />
                          </div>
                          <BodyAr paragraphs={s.bodyAr} />
                        </div>
                      </>
                    ) : solo ? (
                      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-5">
                          {heading}
                          {s.quote && <div className="mt-6"><Quote quote={s.quote} /></div>}
                          {s.body && <div className="mt-6"><Body paragraphs={s.body} /></div>}
                          {s.bodyAr && <div className="mt-6"><BodyAr paragraphs={s.bodyAr} /></div>}
                        </div>
                        <div className="lg:col-span-7">
                          <MediaGrid items={s.items} />
                        </div>
                      </div>
                    ) : (
                      <>
                        {heading}
                        {(s.body || s.quote || s.bodyAr) && (
                          <div className="mt-6 grid gap-8 lg:grid-cols-2">
                            {s.body && <Body paragraphs={s.body} />}
                            {s.quote && <Quote quote={s.quote} />}
                            {s.bodyAr && <BodyAr paragraphs={s.bodyAr} card />}
                          </div>
                        )}
                        {s.items.length > 0 && (
                          <div className="mt-10">
                            <MediaGrid items={s.items} />
                          </div>
                        )}
                      </>
                    )}
                  </section>
                );
              })}

              {project.reflection && (
                <section aria-labelledby="reflection-title" className="border-t border-line pt-8">
                  <h2 id="reflection-title" className="font-display text-headline">Reflection</h2>
                  <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed">
                    {project.reflection.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </section>
              )}

              {booklet && (
                <section aria-labelledby="booklet-title" className="border-t border-line pt-8">
                  <h2 id="booklet-title" className="label text-ink-2">
                    The full booklet
                  </h2>
                  <div className="mt-4 max-w-xl">
                    <BookletViewer title={booklet.title} pages={booklet.pages} />
                  </div>
                </section>
              )}

              <section aria-labelledby="credits-title" className="border-t border-line pt-8">
                <h2 id="credits-title" className="label text-ink-2">
                  Credits
                </h2>
                <dl className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {project.credits.map((c) => (
                    <Fact key={c.role + c.name} label={c.role} value={c.name} />
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </LightboxProvider>

        <nav aria-label="More projects" className="mt-16 border-t border-line">
          <div className="mx-auto grid max-w-[1440px] gap-px px-4 sm:grid-cols-2 sm:px-8">
            {[
              { p: prev, dir: 'Previous' },
              { p: next, dir: 'Next' },
            ].map(({ p, dir }) => (
              <Link key={dir} href={`/work/${p.slug}`} className={`group flex items-center gap-5 py-8 ${dir === 'Next' ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                <Picture image={resolveMedia(p.slug, p.cover) as ResolvedImage} sizes="96px" className="aspect-[3/4] w-20 shrink-0 sm:w-24" />
                <span>
                  <span className="label block text-ink-2">{dir}</span>
                  <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </article>
    </>
  );
}

function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-[62ch] space-y-4 text-lg leading-relaxed">
      {paragraphs.map((para) => (
        <p key={para}>{para}</p>
      ))}
    </div>
  );
}

function BodyAr({ paragraphs, card = false }: { paragraphs: string[]; card?: boolean }) {
  return (
    <div lang="ar" dir="rtl" className={`max-w-[62ch] space-y-4 text-xl leading-loose ${card ? 'bg-tint p-6' : ''}`}>
      {paragraphs.map((para) => (
        <p key={para}>{para}</p>
      ))}
    </div>
  );
}

function Quote({ quote }: { quote: { text: string; by: string } }) {
  return (
    <blockquote className="border-l border-accent pl-6 lg:self-start">
      <p className="text-xl font-medium leading-snug sm:text-2xl">&ldquo;{quote.text}&rdquo;</p>
      <footer className="label mt-4 text-ink-2">{quote.by}</footer>
    </blockquote>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line pb-3">
      <dt className="label text-ink-2">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
