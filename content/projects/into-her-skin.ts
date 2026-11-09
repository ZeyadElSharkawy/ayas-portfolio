import type { Project } from '../types.ts';

export const intoHerSkin: Project = {
  slug: 'into-her-skin',
  title: 'Into Her Skin',
  category: 'selected-works',
  tagline: 'An aerial-hoop costume that puts the inside out.',
  summary:
    'A performance costume for aerial-hoop artist Shahenda Bahgat, designed from an analysis of who she is: graceful, introverted, kind-hearted, and fierce on the hoop. The proposal, "In my skin / Feel my skin", shows the world how she feels in her own skin. A printed bodysuit traces the light of a spinning hoop, and lime mesh is draped and pleated to move with her in the air.',
  facts: [
    { label: 'For', value: 'Shahenda Bahgat, aerial-hoop performer' },
    { label: 'Fabrics', value: 'White Lycra and glitter mesh, custom printed' },
    { label: 'Process', value: 'Illustrator + CLO3D digital prototype, three fittings' },
    { label: 'Techniques', value: 'Print design, draping, pleating' },
  ],
  palette: ['#9C97D6', '#3E5BC4', '#F5E15A', '#D7E84B', '#D4A63A'],
  home: {
    contain: true,
    more: [
      { kind: 'clean', id: 'hoop-2', alt: 'Sitting in the hoop, one arm raised' },
      { kind: 'clean', id: 'hoop-5', alt: 'Shahenda seated in the hoop, the lime mesh draped across her body' },
    ],
  },
  cover: { kind: 'clean', id: 'hoop-1', alt: 'Shahenda inside the aerial hoop in the printed blue bodysuit with lime mesh drapes' },
  hero: { kind: 'clean', id: 'hoop-5', alt: 'Shahenda seated in the hoop, the lime mesh draped across her body' },
  sections: [
    {
      kind: 'concept',
      title: 'Identity',
      quote: {
        text: 'That sense of flying that you get, because you do fly on the hoop. None of the other sports can give me this feeling.',
        by: 'Shahenda Bahgat',
      },
      body: [
        'The project began with an identity analysis of Shahenda: grace, rhythm, musicals, self-development books, a goofy Disney character, kind-hearted and sometimes misunderstood.',
        'The proposal: an aerial-hoop performance garment that shows how she feels in her skin, putting the insides out, with attachable, interchangeable pieces.',
      ],
      media: [],
    },
    {
      kind: 'research',
      label: 'Moodboards and colour palette',
      media: [
        { kind: 'clean', id: 'palette', alt: 'Colour palette: lavender, blues and gold, with aerial figures' },
        { kind: 'clean', id: 'moodboard-concept', alt: 'Concept moodboard' },
        { kind: 'clean', id: 'moodboard-identity', alt: 'Identity moodboard' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Sketches',
      media: [
        { kind: 'clean', id: 'sketch-1', alt: "Gesture sketches of aerial poses" },
        { kind: 'clean', id: 'sketch-2', alt: "Line sketches of the costume" },
        { kind: 'clean', id: 'sketch-3', alt: "Coloured design sketches" },
        { kind: 'clean', id: 'sketch-4', alt: "Aerial figures in the costume" },
        { kind: 'clean', id: 'sketch-5', alt: "Coloured sketches on yellow" },
        { kind: 'clean', id: 'sketch-6', alt: "The chosen design" },
      ],
    },
    {
      kind: 'digital',
      title: 'Print & digital prototype',
      body: [
        'The print is drawn from the flow of flying on the hoop: hold a light while spinning and it draws these unapologetic curves and circles.',
        'The garment was drafted in Adobe Illustrator and imported into CLO3D to visualise it on the body before cutting. It took real effort to make the pattern accurate, but it meant seeing the garment before making it.',
      ],
      media: [
        { kind: 'clean', id: 'technical', alt: "Technical drawing of the bodysuit" },
        { kind: 'clean', id: 'digital', alt: "Digital prototype of the printed bodysuit" },
      ],
    },
    {
      kind: 'construction',
      title: 'Prototypes & fittings',
      body: [
        'The first prototype needed more flow than the print alone could give, so she experimented with mesh. Adding side seams then broke the print, which had to be reworked.',
        'In the first fitting the suit was too tight to move her arms, the mesh didn\'t drape from the sides, and the printed fabric arrived with flaws. The fixes included a wider neckline and triangular "princess-cut" inserts at the ankles.',
        'The mesh top is pleated halfway so it drapes over her chest from the hip, complements the skirt, and knots at the neck to flatter her back.',
      ],
      media: [
        { kind: 'clean', id: 'prototype-pattern', alt: "Pattern pieces with the print placed on them" },
        { kind: 'clean', id: 'prototype', alt: "First prototype of the printed bodysuit" },
        { kind: 'clean', id: 'skirt', alt: "Skirt prototype" },
        { kind: 'clean', id: 'fitting-2', alt: "Fitting 2 on the aerial hoop" },
        { kind: 'clean', id: 'fitting-3', alt: "Fitting 3 with the draped mesh top" },
        { kind: 'clean', id: 'fitting-3b', alt: "Fitting 3 details" },
        { kind: 'clean', id: 'draping', alt: "Draping and pleats" },
        { kind: 'clean', id: 'details', alt: "Print and mesh details" },
      ],
    },
    {
      kind: 'final',
      title: 'On the hoop',
      media: [
        { kind: 'clean', id: 'hoop-1', alt: "Shahenda inside the aerial hoop in the printed blue bodysuit with lime mesh drapes" },
        { kind: 'clean', id: 'hoop-2', alt: "Sitting in the hoop, one arm raised" },
        { kind: 'clean', id: 'hoop-3', alt: "Close view of the bodysuit and drapes on the hoop" },
        { kind: 'clean', id: 'hoop-4', alt: "On the pole in low light" },
        { kind: 'clean', id: 'hoop-5', alt: "Shahenda seated in the hoop, the lime mesh draped across her body" },
        { kind: 'clean', id: 'hoop-6', alt: "Hanging from the hoop, stretched out" },
        { kind: 'clean', id: 'hoop-7', alt: "Arms raised over the hoop, mesh billowing" },
        { kind: 'clean', id: 'hoop-8', alt: "Standing in front of the hoop" },
      ],
    },
    {
      kind: 'film',
      title: 'Film',
      media: [
        { kind: 'video', id: 'film', title: 'Into Her Skin, the film' },
        { kind: 'video', id: 'interview', title: 'Interview with Shahenda Bahgat' },
      ],
    },
  ],
  booklet: { doc: 'booklet', title: 'Into Her Skin booklet' },
  credits: [
    { role: 'Design', name: 'Aya Hafez' },
    { role: 'Performer', name: 'Shahenda Bahgat' },
  ],
  status: 'draft',
  questions: [
    'Course name, year and supervisors.',
    'Photographer credit, and are there higher-resolution originals of the hoop photos? We only have them as booklet pages.',
    'Is the Final Video on Drive the teaser the booklet links by QR code, or is there another file?',
  ],
};
