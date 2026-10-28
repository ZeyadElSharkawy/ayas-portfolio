import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProject } from '@/content/projects/index.ts';
import { categories } from '@/content/categories.ts';
import type { SectionKind } from '@/content/types';
import { documentPages, largest, resolveMedia, type ResolvedImage } from '@/lib/media';
import { jsonLdHtml, openGraphBase, projectJsonLd } from '@/lib/site';
import { stations } from '@/lib/hub/stations';
import { projectTheme } from '@/lib/theme';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Picture } from '@/components/media/Picture';
import { Seam } from '@/components/motif/Seam';
import { LightboxProvider } from '@/components/project/Lightbox';
import { MediaGrid, type GridItem } from '@/components/project/MediaGrid';
import { SectionNav } from '@/components/project/SectionNav';
import { BookletViewer } from '@/components/project/BookletViewer';
import { Video } from '@/components/project/Video';
import { StitchPage, STITCH } from '@/components/motif/StitchPage';
import { Spool } from '@/components/motif/Spool';
import { Signature } from '@/components/signature/Signature';
import { ProjectReveal } from '@/components/signature/ProjectReveal';
import { contact } from '@/content/cv';

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
  // The share image comes from opengraph-image.tsx alongside this page.
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { ...openGraphBase, type: 'article', title: `${project.title} · Aya Hafez`, description: project.tagline, url: `/work/${project.slug}` },
  };
}

// The header is the static shell; everything that depends on the slug sits behind Suspense, so
// client navigations into a project can show the shell instantly (cache components' instant nav).
export default function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  return (
    <StitchPage>
      <SiteHeader />
      <Suspense fallback={<Threading />}>
        <Project params={params} />
      </Suspense>
    </StitchPage>
  );
}

function Threading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <Spool />
    </div>
  );
}

async function Project({ params }: { params: PageProps<'/work/[slug]'>['params'] }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const { slug } = project;
  const theme = projectTheme(project.theme.palette);
  const category = categories.find((c) => c.id === project.category)!;
  const station = stations.find((s) => s.category === project.category);
  const hero = resolveMedia(slug, project.hero);

  // Every still in reading order feeds one lightbox; each grid item remembers its position in it.
  const lightbox: ResolvedImage[] = [];
  const sections = project.sections.map((section, i) => {
    const items: GridItem[] = section.media.map((ref) => {
      const media = resolveMedia(slug, ref);
      if (media.kind === 'video') return { media };
      lightbox.push(media);
      return { media, lightboxIndex: lightbox.length - 1 };
    });
    return { ...section, id: `s${i + 1}-${section.kind}`, items };
  });

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
      {project.slug === 'cultural-echoes' && <ProjectReveal style="door" />}
      {project.slug === 'identity-breakdown' && <ProjectReveal style="curtains" />}
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />
        {/* Hero */}
        <section style={{ background: theme.wash }}>
          <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 pb-12 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-12 lg:pt-16">
            <div className="lg:pb-6">
              <p className="label" style={{ color: theme.accent }}>
                {station?.room ?? category.room} · {category.title}
              </p>
              <h1
                tabIndex={-1}
                className="mt-4 font-display text-[clamp(2.75rem,1.5rem+5vw,6rem)] leading-[0.95] font-light tracking-[-0.02em]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
              >
                {project.title}
              </h1>
              {project.titleAr && (
                <p lang="ar" dir="rtl" className="mt-3 text-right text-2xl font-light text-ink-soft lg:text-left">
                  {project.titleAr}
                </p>
              )}
              <p className="mt-6 max-w-[38ch] font-display text-xl leading-snug font-light italic sm:text-2xl" style={{ fontVariationSettings: '"SOFT" 100' }}>
                {project.tagline}
              </p>
              <div className="mt-8 flex gap-1.5" aria-hidden>
                {project.theme.palette.map((hex) => (
                  <span key={hex} className="h-2 w-8 rounded-full" style={{ background: hex }} />
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-sm">
              {hero.kind === 'video' ? (
                <Video video={hero} />
              ) : (
                <Picture image={hero} sizes="(min-width: 1024px) 58vw, 100vw" priority className="max-h-[78vh] [&_img]:max-h-[78vh]" />
              )}
            </div>
          </div>
        </section>

        <Signature project={project} />

        {/* Summary + facts */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:py-20">
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
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="label mb-4 text-ink-soft">On this page</p>
                <SectionNav sections={sections.map((s) => ({ id: s.id, title: s.title }))} />
              </div>
            </aside>

            <div className="space-y-20 lg:space-y-28">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                  <Seam ends className="mb-8" />
                  <p className="label" style={{ color: theme.accent }}>
                    {String(i + 1).padStart(2, '0')} · {KIND_LABEL[s.kind]}
                  </p>
                  <h2
                    id={`${s.id}-title`}
                    className="mt-2 font-display text-headline font-light"
                    style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}
                  >
                    {s.title}
                  </h2>

                  {(s.body || s.quote || s.bodyAr) && (
                    <div className="mt-6 grid gap-8 lg:grid-cols-2">
                      {s.body && (
                        <div className="max-w-[62ch] space-y-4 text-lg leading-relaxed">
                          {s.body.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                        </div>
                      )}
                      {s.quote && (
                        <blockquote className="border-l-[1.5px] border-dashed border-thread pl-6 lg:self-start">
                          <p className="font-display text-2xl leading-snug font-light italic sm:text-3xl" style={{ fontVariationSettings: '"SOFT" 100' }}>
                            &ldquo;{s.quote.text}&rdquo;
                          </p>
                          <footer className="label mt-4 text-ink-soft">{s.quote.by}</footer>
                        </blockquote>
                      )}
                      {s.bodyAr && (
                        <div lang="ar" dir="rtl" className="max-w-[62ch] space-y-4 rounded-sm bg-cream p-6 text-lg leading-loose">
                          {s.bodyAr.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {s.items.length > 0 && (
                    <div className="mt-10">
                      <MediaGrid items={s.items} horizontal={slug === 'cultural-echoes' && s.kind === 'sketches'} />
                    </div>
                  )}
                </section>
              ))}

              {booklet && (
                <section aria-labelledby="booklet-title">
                  <Seam ends className="mb-8" />
                  <h2 id="booklet-title" className="label text-ink-soft">
                    The full booklet
                  </h2>
                  <div className="mt-4 max-w-xl">
                    <BookletViewer title={booklet.title} pages={booklet.pages} />
                  </div>
                </section>
              )}

              <section aria-labelledby="credits-title">
                <Seam ends className="mb-8" />
                <h2 id="credits-title" className="label text-ink-soft">
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

        {/* Onwards */}
        <nav aria-label="More projects" className="mt-16 border-t border-dashed border-seam">
          <div className="mx-auto grid max-w-7xl gap-px px-4 sm:grid-cols-2 sm:px-8">
            {[
              { p: prev, dir: 'Previous' },
              { p: next, dir: 'Next' },
            ].map(({ p, dir }) => (
              <Link
                key={dir}
                href={`/work/${p.slug}`}
                transitionTypes={STITCH}
                data-cursor={dir}
                className={`group flex items-center gap-5 py-8 ${dir === 'Next' ? 'sm:flex-row-reverse sm:text-right' : ''}`}
              >
                <Picture image={resolveMedia(p.slug, p.cover) as ResolvedImage} sizes="96px" className="aspect-[3/4] w-20 shrink-0 rounded-sm sm:w-24" />
                <span>
                  <span className="label block text-ink-soft">{dir}</span>
                  <span className="mt-1 block font-display text-2xl font-light transition-colors group-hover:text-forest sm:text-3xl">{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
          {station && (
            <div className="border-t border-dashed border-seam py-8 text-center">
              <Link
                transitionTypes={STITCH}
                href={station.ui === 'slides' ? `/?room=${station.id}&slide=${slug}` : `/?room=${station.id}`}
                className="label stitch-link"
              >
                Back to {station.room}
              </Link>
            </div>
          )}
        </nav>

        <footer className="bg-ink text-cream">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
            <section aria-labelledby="contact-title">
              <p className="label text-cream/60">Let&apos;s make something</p>
              <h2 id="contact-title" className="mt-2 font-display text-4xl font-light sm:text-5xl">
                Get in touch
              </h2>
              <address className="mt-6 grid justify-items-start gap-3 text-cream/85 not-italic">
                <a className="stitch-link" href={`mailto:${contact.email}`}>{contact.email}</a>
                <a className="stitch-link" href={contact.phone.href}>{contact.phone.display}</a>
                <a className="stitch-link" href={contact.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp · {contact.whatsapp.display}</a>
              </address>
            </section>

            <nav aria-label="All of Aya’s work">
              <p className="label text-cream/60">Explore more</p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      transitionTypes={STITCH}
                      aria-current={p.slug === slug ? 'page' : undefined}
                      className="stitch-link inline-block py-1 text-lg font-light"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/about" transitionTypes={STITCH} className="stitch-link mt-6 inline-block">
                About Aya
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-dashed border-seam pb-3">
      <dt className="label text-ink-soft">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
