// Content model for the portfolio. Project files in content/projects/ are plain data;
// media is referenced by id and resolved against content/media.generated.json (see lib/media.ts).

export type CategoryId = 'selected-works' | 'digital-fashion' | 'fashion-styling';

/** A pointer to a processed asset. `id`/`doc` match keys in media.generated.json for the project. */
export type MediaRef =
  | { kind: 'image'; id: string; alt: string; caption?: string }
  | { kind: 'page'; doc: string; n: number; alt: string; caption?: string }
  | { kind: 'video'; id: string; title: string; caption?: string };

/** Mirrors the structure Aya uses in her booklets. */
export type SectionKind =
  | 'concept'
  | 'research'
  | 'sketches'
  | 'materials'
  | 'construction'
  | 'range'
  | 'digital'
  | 'final'
  | 'film'
  | 'context';

/** The five chapters every project page is told in (see lib/chapters.ts for the default mapping). */
export type Chapter = 'outcome' | 'why' | 'research' | 'development' | 'reflection';

export interface Section {
  kind: SectionKind;
  /** Overrides the chapter the section kind maps to by default. */
  chapter?: Chapter;
  title: string;
  body?: string[];
  /** Aya's own Arabic text, where her booklet has it. */
  bodyAr?: string[];
  quote?: { text: string; by: string };
  media: MediaRef[];
}

export interface Project {
  slug: string;
  title: string;
  titleAr?: string;
  category: CategoryId;
  /** Short line under the title. */
  tagline: string;
  /** One paragraph for the index, project intro and meta descriptions. */
  summary: string;
  year?: number;
  client?: string;
  facts: { label: string; value: string }[];
  /** Shown first in the index's outcome view. */
  cover: MediaRef;
  /** First thing seen on the project page. */
  hero: MediaRef;
  sections: Section[];
  /** Full booklet or deck, for the "every page" view. */
  booklet?: { doc: string; title: string };
  /** What worked and what she'd change. Aya writes this; the chapter is hidden until she does. */
  reflection?: string[];
  credits: { role: string; name: string }[];
  /** Copy is drafted from Aya's booklets until she has reviewed it. */
  status: 'draft' | 'approved';
  /** Open questions to resolve with Aya before launch. */
  questions?: string[];
}

export interface Category {
  id: CategoryId;
  title: string;
  /** Short label shown next to each project in the index. */
  label: string;
}
