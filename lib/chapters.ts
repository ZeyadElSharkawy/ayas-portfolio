// Groups a project's sections into the five chapters the site tells every project in.
// Outcome comes first on the page; the other four are "the process", in research-to-outcome order.

import type { Chapter, Project, Section, SectionKind } from '../content/types.ts';

const byKind: Record<SectionKind, Chapter> = {
  concept: 'why',
  research: 'research',
  sketches: 'development',
  materials: 'development',
  construction: 'development',
  range: 'development',
  digital: 'development',
  final: 'outcome',
  film: 'outcome',
  context: 'outcome',
};

export const chapterTitles: Record<Chapter, string> = {
  outcome: 'Outcome',
  why: 'Why',
  research: 'Research',
  development: 'Development',
  reflection: 'Reflection',
};

export const processChapters = ['why', 'research', 'development'] as const satisfies Chapter[];

export const chapterOf = (s: Section): Chapter => s.chapter ?? byKind[s.kind];

/** Sections in a chapter, in the order the project file lists them. */
export const sectionsIn = (p: Project, c: Chapter) => p.sections.filter((s) => chapterOf(s) === c);
