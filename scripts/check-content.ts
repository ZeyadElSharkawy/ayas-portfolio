// Validates content/ against the media manifest.
//
//   npm run check:content
//
// Fails on: unknown media ids, duplicate slugs, booklets/categories that don't exist.
// Reports: processed images no project uses, and the open questions for Aya.

import { projects } from '../content/projects/index.ts';
import { categories } from '../content/categories.ts';
import { projectMedia, resolveMedia, documentPages } from '../lib/media.ts';
import type { MediaRef } from '../content/types.ts';

const errors: string[] = [];
const seen = new Set<string>();

for (const p of projects) {
  if (seen.has(p.slug)) errors.push(`duplicate slug "${p.slug}"`);
  seen.add(p.slug);
  if (!categories.some((c) => c.id === p.category)) errors.push(`${p.slug}: unknown category "${p.category}"`);

  const refs: MediaRef[] = [p.cover, p.hero, ...p.sections.flatMap((s) => s.media)];
  for (const ref of refs) {
    try {
      resolveMedia(p.slug, ref);
    } catch (err) {
      errors.push((err as Error).message);
    }
  }
  if (p.booklet) {
    try {
      documentPages(p.slug, p.booklet.doc);
    } catch (err) {
      errors.push((err as Error).message);
    }
  }

  const used = new Set(refs.filter((r) => r.kind === 'image').map((r) => r.id));
  const unused = Object.keys(projectMedia(p.slug).images ?? {}).filter((id) => !used.has(id));
  const videos = Object.keys(projectMedia(p.slug).videos ?? {});
  const unusedVideos = videos.filter((id) => !refs.some((r) => r.kind === 'video' && r.id === id));

  console.log(`${p.status === 'draft' ? '✎' : '✓'} ${p.slug.padEnd(22)} ${String(refs.length).padStart(3)} refs`
    + (unused.length ? `  · unused images: ${unused.join(', ')}` : '')
    + (unusedVideos.length ? `  · unused videos: ${unusedVideos.join(', ')}` : ''));
}

const questions = projects.flatMap((p) => (p.questions ?? []).map((q) => `  [${p.slug}] ${q}`));
if (questions.length) console.log(`\nOpen questions for Aya (${questions.length}):\n${questions.join('\n')}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('\ncontent OK');
