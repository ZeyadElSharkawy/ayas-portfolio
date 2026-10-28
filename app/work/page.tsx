import type { Metadata } from 'next';
import { projects } from '@/content/projects/index.ts';
import { resolveMedia, type ResolvedImage } from '@/lib/media';
import { projectPreviews } from '@/lib/project-previews';
import { SiteHeader } from '@/components/site/SiteHeader';
import { StitchPage } from '@/components/motif/StitchPage';
import { WorkGrid, type WorkCard } from '@/components/project/WorkGrid';
import { openGraphBase } from '@/lib/site';

const WORK_DESCRIPTION = 'Explore Aya Hafez’s fashion design, digital fashion and styling projects.';

export const metadata: Metadata = {
  title: "Aya's work",
  description: WORK_DESCRIPTION,
  alternates: { canonical: '/work' },
  openGraph: { ...openGraphBase, title: "Aya's work · Aya Hafez", description: WORK_DESCRIPTION, url: '/work' },
};

export default function WorkPage() {
  const cards: WorkCard[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    titleAr: project.titleAr,
    tagline: project.tagline,
    summary: project.summary,
    palette: project.theme.palette,
    cover: resolveMedia(project.slug, project.cover) as ResolvedImage,
    previews: projectPreviews(project),
  }));

  return (
    <StitchPage>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-8 lg:pt-20">
        <p className="label text-ink-soft">Portfolio</p>
        <h1 className="mt-3 font-display text-display font-light tracking-[-0.03em]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}>
          Aya&apos;s work
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Fashion design, digital worlds and styling. Hover over a project to see more, or open it to explore the process.
        </p>
        <div className="mt-12">
          <WorkGrid projects={cards} />
        </div>
      </main>
    </StitchPage>
  );
}
