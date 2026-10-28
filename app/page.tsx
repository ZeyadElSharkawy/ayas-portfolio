import { projects } from '@/content/projects/index.ts';
import { resolveMedia, type ResolvedImage } from '@/lib/media';
import { HubExperience } from '@/components/hub/HubExperience';
import type { HubProject } from '@/components/hub/types';
import { StitchPage } from '@/components/motif/StitchPage';
import { jsonLdHtml, personJsonLd } from '@/lib/site';
import { projectPreviews } from '@/lib/project-previews';

export default function Home() {
  const hubProjects: HubProject[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    titleAr: p.titleAr,
    tagline: p.tagline,
    category: p.category,
    palette: p.theme.palette,
    cover: resolveMedia(p.slug, p.cover) as ResolvedImage,
    previews: projectPreviews(p),
  }));
  return (
    <StitchPage className="fixed inset-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(personJsonLd())} />
      <HubExperience projects={hubProjects} />
    </StitchPage>
  );
}
