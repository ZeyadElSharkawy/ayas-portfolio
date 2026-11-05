// Server-side: turns projects into the lean, serialisable entries the home-page index needs,
// so the client component never imports the media manifest.

import { projects } from '../content/projects/index.ts';
import type { MediaRef, Project } from '../content/types.ts';
import { resolveMedia } from './media.ts';
import { chapterTitles, processChapters, sectionsIn } from './chapters.ts';
import type { PictureData } from '../components/media/Picture.tsx';

export interface FolioEntry {
  slug: string;
  title: string;
  titleAr?: string;
  /** Cover first, then two more finished-work images. */
  outcome: PictureData[];
  process: { title: string; images: PictureData[] }[];
}

const stillsOnly = (refs: MediaRef[]) => refs.filter((r) => r.kind !== 'video');

function picture(p: Project, ref: MediaRef): PictureData {
  const m = resolveMedia(p.slug, ref);
  if (m.kind === 'video') throw new Error('videos are filtered out before this');
  return { src: m.src, widths: m.widths, formats: m.formats, width: m.width, height: m.height, color: m.color, alt: m.alt };
}

const sameMedia = (a: MediaRef, b: MediaRef) =>
  a.kind === b.kind && (a.kind === 'page' ? b.kind === 'page' && a.doc === b.doc && a.n === b.n : 'id' in b && a.id === b.id);

function entry(p: Project): FolioEntry {
  const finished = stillsOnly(sectionsIn(p, 'outcome').flatMap((s) => s.media)).filter((r) => !sameMedia(r, p.cover));
  return {
    slug: p.slug,
    title: p.title,
    titleAr: p.titleAr,
    outcome: [p.cover, ...finished.slice(0, 2)].map((r) => picture(p, r)),
    process: processChapters
      .map((c) => ({
        title: chapterTitles[c],
        images: stillsOnly(sectionsIn(p, c).flatMap((s) => s.media)).slice(0, 4).map((r) => picture(p, r)),
      }))
      .filter((c) => c.images.length > 0),
  };
}

export const folioEntries = (): FolioEntry[] => projects.map(entry);
