import type { Project } from '../types.ts';

export const inHonorOfOurWomen: Project = {
  slug: 'in-honor-of-our-women',
  title: 'In Honor of Our Women',
  titleAr: 'تكريماً لنسائنا',
  category: 'selected-works',
  tagline: 'A textile monument to the women who shaped us.',
  summary:
    'A multi-media textile installation that is both a monument and an intimate dialogue with the many identities of Egyptian women. It treats Egyptian women as a collective identity while honouring their differences, celebrating who they are as individuals and the impact they have on our past, present and future.',
  facts: [
    { label: 'Brief', value: 'Carte Blanche' },
    { label: 'Materials', value: 'Off-white dakka cloth, hot-pink gabardine' },
    { label: 'Techniques', value: 'Machine embroidery, photography' },
  ],
  theme: {
    palette: ['#F4EFE6', '#E0157A', '#1A1A1A', '#FFFFFF'],
    motif: 'Hanging fabric banners, single-line embroidered portraits, and strips of black-and-white archive photographs.',
    interaction:
      'The installation hangs as a 3D fabric banner that sways. Hover a portrait and its embroidery stitches itself in line by line, then the Arabic tribute fades in.',
  },
  cover: { kind: 'page', doc: 'booklet', n: 64, alt: 'Embroidered banner panel: a pink line portrait beside a handwritten Arabic tribute on off-white cloth with hot-pink borders' },
  hero: { kind: 'page', doc: 'booklet', n: 68, alt: 'The installation: a central embroidered banner flanked by strips of black-and-white photographs' },
  sections: [
    {
      kind: 'concept',
      title: 'Concept',
      body: [
        'In Honor of Our Women is a multi-media textile installation that serves as both a monument and an intimate dialogue with the various identities of Egyptian women. We see that they are not all the same.',
        'It takes a moment to shed light on Egyptian women as a collective identity, and to honour their differences: who they are as individuals, and the beautiful impact they have on our past, present and future.',
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 50, alt: 'Title: In honor of our women, تكريماً لنسائنا' },
        { kind: 'page', doc: 'booklet', n: 52, alt: 'References: textile installations and hanging banners' },
      ],
    },
    {
      kind: 'research',
      title: 'Four women',
      body: [
        'Doria Shafik, intellectual and pioneer feminist.',
        'Hekmat Ashour, my great-grandmother.',
        'Mennatallah Mahmoud, our beloved teacher.',
        "Hala Kassem, Carina's CEO.",
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 56, alt: 'Single-line portraits of Doria Shafik, Hekmat Ashour, Mennatallah Mahmoud and Hala Kassem' },
        { kind: 'page', doc: 'booklet', n: 58, alt: 'Portrait with a handwritten Arabic tribute' },
        { kind: 'page', doc: 'booklet', n: 59, alt: 'Portrait with a handwritten Arabic tribute' },
        { kind: 'page', doc: 'booklet', n: 60, alt: 'Portrait with a handwritten Arabic tribute' },
        { kind: 'page', doc: 'booklet', n: 61, alt: 'Portrait with a handwritten Arabic tribute' },
      ],
    },
    {
      kind: 'construction',
      title: 'Making',
      media: [
        { kind: 'page', doc: 'booklet', n: 54, alt: 'Measurements of the banner panels' },
        { kind: 'page', doc: 'booklet', n: 55, alt: 'Fabrics (off-white dakka, hot-pink gabardine) and techniques (machine embroidery, photography)' },
        { kind: 'page', doc: 'booklet', n: 57, alt: 'Process: embroidery hoop, pink and red thread cones and fabric samples' },
      ],
    },
    {
      kind: 'final',
      title: 'The installation',
      media: [
        { kind: 'page', doc: 'booklet', n: 62, alt: 'Installation layout: the central banner between photo strips' },
        { kind: 'page', doc: 'booklet', n: 63, alt: 'The central banner in detail' },
        { kind: 'page', doc: 'booklet', n: 64, alt: 'Embroidered panel: portrait and tribute' },
        { kind: 'page', doc: 'booklet', n: 65, alt: 'Embroidered panel: portrait and tribute' },
        { kind: 'page', doc: 'booklet', n: 66, alt: 'Embroidered panel: portrait and tribute' },
        { kind: 'page', doc: 'booklet', n: 67, alt: 'Embroidered panel: portrait and tribute' },
        { kind: 'page', doc: 'booklet', n: 68, alt: 'The full installation with archive photo strips' },
        { kind: 'page', doc: 'booklet', n: 69, alt: 'Hanging archive photographs with embroidered Arabic names' },
      ],
    },
  ],
  booklet: { doc: 'booklet', title: 'Project pages' },
  credits: [{ role: 'Design', name: 'Aya Hafez' }],
  status: 'draft',
  questions: [
    'Should this be its own project, or part of Carina Arabesque? The site currently treats it as standalone.',
    'Which course or brief was the Carte Blanche for, and when?',
    'Is there a photo of the installation actually hung, rather than the mock-ups?',
    'Translations of the four Arabic tributes, if she wants them shown in English.',
  ],
};
