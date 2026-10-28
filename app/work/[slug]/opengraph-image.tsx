import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { categories } from '@/content/categories.ts';
import { getProject } from '@/content/projects/index.ts';
import { largest, resolveMedia, type ResolvedImage } from '@/lib/media';
import { OG_SIZE, OG_TYPE, ogFonts, ogPhoto, ProjectCard } from '@/lib/og';

/** Where to crop the cover when 'attention' picks the wrong part (sharp position names). */
const FOCUS: Record<string, string> = { 'in-honor-of-our-women': 'left' };

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  return [{ id: 'card', size: OG_SIZE, contentType: OG_TYPE, alt: project ? `${project.title} by Aya Hafez: ${project.tagline}` : 'Aya Hafez' }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const cover = resolveMedia(project.slug, project.cover) as ResolvedImage;
  const category = categories.find((c) => c.id === project.category)!;
  return new ImageResponse(
    (
      <ProjectCard
        kicker={`${category.room} · ${category.title}`}
        title={project.title}
        titleAr={project.titleAr}
        tagline={project.tagline}
        palette={project.theme.palette}
        photo={await ogPhoto(largest(cover), 560, 630, FOCUS[project.slug])}
      />
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
