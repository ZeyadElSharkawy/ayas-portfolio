import type { Project } from '@/content/types';
import { resolveMedia, type ResolvedMedia } from '@/lib/media';

export function projectPreviews(project: Project): ResolvedMedia[] {
  const showcase = project.sections
    .filter((section) => section.kind === 'final' || section.kind === 'film')
    .flatMap((section) => section.media);
  const remaining = project.sections
    .filter((section) => section.kind !== 'final' && section.kind !== 'film')
    .flatMap((section) => section.media);
  const media = [...showcase, ...remaining].map((ref) => resolveMedia(project.slug, ref));
  const stills = media.filter((item) => item.kind !== 'video');
  const videos = media.filter((item) => item.kind === 'video');
  return [...stills.slice(0, 2), ...videos.slice(0, 1)];
}
