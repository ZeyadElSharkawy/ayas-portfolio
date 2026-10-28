// Resolves MediaRefs from content/ against the pipeline manifest (content/media.generated.json).
// Lookups throw on unknown ids so a typo in content fails the build instead of rendering a broken image.

import manifest from '../content/media.generated.json' with { type: 'json' };
import type { MediaRef } from '../content/types.ts';

export interface ResolvedImage {
  kind: 'image' | 'page';
  /** Base path; real files are `${src}-${width}.${format}`. */
  src: string;
  widths: number[];
  formats: string[];
  width: number;
  height: number;
  blur: string;
  color: string;
  alt: string;
  caption?: string;
}

export interface ResolvedVideo {
  kind: 'video';
  src: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
  hasAudio: boolean;
  blur: string;
  title: string;
  caption?: string;
}

export type ResolvedMedia = ResolvedImage | ResolvedVideo;

interface ImageEntry { src: string; widths: number[]; formats: string[]; width: number; height: number; blur: string; color: string; group?: string }
interface PageEntry extends Omit<ImageEntry, 'formats' | 'group'> { n: number }
interface VideoEntry { src: string; poster: string; width: number; height: number; duration: number; hasAudio: boolean; blur: string }
interface ProjectMedia {
  images?: Record<string, ImageEntry>;
  documents?: Record<string, { pageCount: number; pages: PageEntry[] }>;
  videos?: Record<string, VideoEntry>;
}

const media = manifest as unknown as Record<string, ProjectMedia>;

export function projectMedia(slug: string): ProjectMedia {
  const entry = media[slug];
  if (!entry) throw new Error(`No media for project "${slug}". Run \`npm run media\`.`);
  return entry;
}

export function resolveMedia(slug: string, ref: MediaRef): ResolvedMedia {
  const m = projectMedia(slug);
  switch (ref.kind) {
    case 'image': {
      const img = m.images?.[ref.id];
      if (!img) throw new Error(`Unknown image "${ref.id}" in ${slug}`);
      return { kind: 'image', ...img, alt: ref.alt, caption: ref.caption };
    }
    case 'page': {
      const page = m.documents?.[ref.doc]?.pages.find((p) => p.n === ref.n);
      if (!page) throw new Error(`Unknown page ${ref.doc} p${ref.n} in ${slug}`);
      return { kind: 'page', ...page, formats: ['webp'], alt: ref.alt, caption: ref.caption };
    }
    case 'video': {
      const video = m.videos?.[ref.id];
      if (!video) throw new Error(`Unknown video "${ref.id}" in ${slug}`);
      return { kind: 'video', ...video, title: ref.title, caption: ref.caption };
    }
  }
}

/** All rendered pages of a document, in order, for the flip-book. */
export function documentPages(slug: string, doc: string) {
  const d = projectMedia(slug).documents?.[doc];
  if (!d) throw new Error(`Unknown document "${doc}" in ${slug}`);
  return d.pages;
}

export { srcSet, largest } from './media-urls.ts';
