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
  theme: {
    palette: ['#9C97D6', '#3E5BC4', '#F5E15A', '#D7E84B', '#D4A63A'],
    motif: 'Golden aerial hoops: every page of her booklet is framed inside one.',
    interaction:
      'Content lives inside 3D aerial hoops you drag to spin. A fitting timeline runs from Fitting 1 to Fitting 3, and the interview plays inside a hoop.',
  },
  cover: { kind: 'page', doc: 'booklet', n: 38, alt: 'Shahenda inside the aerial hoop in the printed blue bodysuit with lime mesh drapes' },
  hero: { kind: 'page', doc: 'booklet', n: 44, alt: 'Shahenda seated in the hoop, the lime mesh draped across her body' },
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
      media: [
        { kind: 'page', doc: 'booklet', n: 4, alt: 'Identity words: two feet, grace, introvert, kind-hearted, musicals, rhythm' },
        { kind: 'page', doc: 'booklet', n: 5, alt: 'Concept words: feeling flowy, embodied, authentic, bold, radiant, fierce' },
        { kind: 'page', doc: 'booklet', n: 6, alt: "Shahenda's quotes about the aerial hoop" },
        { kind: 'page', doc: 'booklet', n: 10, alt: 'My proposal: aerial-hoop performative garment, "In my skin / Feel my skin"' },
      ],
    },
    {
      kind: 'research',
      title: 'Moodboards & palette',
      media: [
        { kind: 'page', doc: 'booklet', n: 7, alt: 'Colour palette of blues and yellow, with aerial silhouettes' },
        { kind: 'page', doc: 'booklet', n: 8, alt: 'Concept moodboard' },
        { kind: 'page', doc: 'booklet', n: 9, alt: 'Identity moodboard' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Sketches',
      media: [
        { kind: 'page', doc: 'booklet', n: 11, alt: 'Gesture sketches of aerial poses' },
        { kind: 'page', doc: 'booklet', n: 12, alt: 'Line sketches of bodysuit ideas' },
        { kind: 'page', doc: 'booklet', n: 13, alt: 'Coloured design sketches' },
        { kind: 'page', doc: 'booklet', n: 14, alt: 'Designs drawn in the hoop' },
        { kind: 'page', doc: 'booklet', n: 15, alt: 'Final illustrations' },
        { kind: 'page', doc: 'booklet', n: 16, alt: 'Final illustration, single figure' },
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
        { kind: 'page', doc: 'booklet', n: 18, alt: 'Print pattern inspired by light trails of a spinning hoop' },
        { kind: 'page', doc: 'booklet', n: 20, alt: 'Technical drawing of the bodysuit, front and back' },
        { kind: 'page', doc: 'booklet', n: 21, alt: 'Digital prototype in CLO3D' },
        { kind: 'page', doc: 'booklet', n: 22, alt: 'Digital prototype with notes' },
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
        { kind: 'page', doc: 'booklet', n: 19, alt: 'Prototype pattern pieces' },
        { kind: 'page', doc: 'booklet', n: 23, alt: 'First prototype' },
        { kind: 'page', doc: 'booklet', n: 25, alt: 'Skirt prototype' },
        { kind: 'page', doc: 'booklet', n: 27, alt: 'Fabric and prints: printed Lycra and lime mesh' },
        { kind: 'page', doc: 'booklet', n: 28, alt: 'Challenges from the first fitting' },
        { kind: 'page', doc: 'booklet', n: 30, alt: 'Fitting 2' },
        { kind: 'page', doc: 'booklet', n: 31, alt: 'Fitting 3' },
        { kind: 'page', doc: 'booklet', n: 33, alt: 'Fitting 3 challenges' },
        { kind: 'page', doc: 'booklet', n: 35, alt: 'Draping and pleats on the mesh top' },
        { kind: 'page', doc: 'booklet', n: 34, alt: 'Details of print, mesh and trims' },
      ],
    },
    {
      kind: 'final',
      title: 'On the hoop',
      media: [
        { kind: 'page', doc: 'booklet', n: 38, alt: 'Inside the hoop, arms open' },
        { kind: 'page', doc: 'booklet', n: 39, alt: 'Holding the hoop with the mesh swept around her' },
        { kind: 'page', doc: 'booklet', n: 40, alt: 'Close-up of the mesh drape against the print' },
        { kind: 'page', doc: 'booklet', n: 42, alt: 'Climbing into the hoop' },
        { kind: 'page', doc: 'booklet', n: 44, alt: 'Seated in the hoop' },
        { kind: 'page', doc: 'booklet', n: 46, alt: 'Reclining across the hoop' },
        { kind: 'page', doc: 'booklet', n: 47, alt: 'Twisting through the hoop with the mesh flowing' },
        { kind: 'page', doc: 'booklet', n: 52, alt: 'Standing pose wrapped in the mesh' },
      ],
    },
    {
      kind: 'film',
      title: 'Film',
      media: [
        { kind: 'video', id: 'interview', title: 'Interview with Shahenda Bahgat' },
        { kind: 'page', doc: 'booklet', n: 55, alt: 'Storyboard' },
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
    'The booklet links a teaser video by QR code. Can we get that file?',
  ],
};
