import type { Project } from '../types.ts';

export const glacier: Project = {
  slug: 'glacier',
  title: 'Glacier',
  category: 'selected-works',
  tagline: 'The untold stories behind perfection.',
  summary:
    'An interchangeable ice-skating garment for a young figure skater, about the quiet struggles of children raised under high expectations. Ice cracks and snowflakes, both formed under pressure, become its symbols. An all-white look embroidered with snowflakes transforms, through removable sleeves, into a dark-blue look marked with cracks.',
  facts: [
    { label: 'Category', value: 'Kidswear · performance wear' },
    { label: 'Fabrics', value: 'Oxford and voile cotton' },
    { label: 'Techniques', value: 'Slashing, digital machine embroidery, cast silver-plated jewellery' },
    { label: 'Shot at', value: 'Sun City Mall ice rink, Cairo' },
  ],
  palette: ['#0F2A5C', '#2E5BA8', '#7FD3E6', '#E8EEF8', '#FFFFFF'],
  cover: { kind: 'image', id: 'img-4437', alt: 'A young skater in the white look gliding on the ice with one leg extended' },
  hero: { kind: 'image', id: 'img-4572', alt: 'The skater in the dark-blue look, arm raised gracefully on the ice rink' },
  heroSet: [
    { kind: 'image', id: 'img-4444', alt: 'A spiral on the ice in the white look' },
    { kind: 'image', id: 'img-4572', alt: 'Arm raised on the ice in the dark-blue look' },
  ],
  sections: [
    {
      kind: 'concept',
      title: 'Behind perfection',
      quote: {
        text: 'In a world where everyone chases perfection, we often miss the hidden costs that come with it.',
        by: 'Aya Hafez',
      },
      body: [
        'Ice cracks tell a story of pressure: as temperatures change, ice expands and contracts until it cracks under the stress. Children feel similar pressure from family, school and society, and it can leave cracks too, as anxiety and sadness that linger for years.',
        'Snowflakes look delicate and perfect, each one unique, but they are also shaped by pressure, freezing as they rise through the cold. They stand for the drive to be perfect that starts in childhood.',
      ],
      media: [],
    },
    {
      kind: 'research',
      label: 'Colour palette and moodboard',
      media: [
        { kind: 'clean', id: 'palette', alt: 'Colour palette with snowflake motifs' },
        { kind: 'clean', id: 'moodboard-inspiration', alt: 'Inspiration moodboard of figure-skating costumes' },
        { kind: 'clean', id: 'moodboard-element', alt: 'Element moodboard of ice, frost and snow textures' },
      ],
    },
    {
      kind: 'construction',
      chapter: 'development',
      label: 'Jewellery',
      body: [
        'The jewellery is an important addition to the garment, complementing it with engraved ice cracks and gemstones set into the piece.',
        'The headpiece was sketched and drawn technically, carved in wax, then cut, refined, sanded, textured and engraved. It was cast, set with rhinestones, soldered to its band, cleaned with ultrasound and acid, galvanised and silver-plated.',
      ],
      media: [
        { kind: 'clean', id: 'jewel-sketch', alt: 'Sketch of the headpiece: a crescent with a snowflake stone on a double band' },
        { kind: 'clean', id: 'jewel-drawing', alt: 'Technical drawing of the headpiece in perspective and from the side' },
        { kind: 'clean', id: 'jewel-wax', alt: 'The wax model: cut from the block, refined and sanded, then textured and engraved with cracks' },
        { kind: 'clean', id: 'jewel-cast', alt: 'The cast piece, before and after adding rhinestones' },
        { kind: 'clean', id: 'jewel-solder', alt: 'Soldering the piece to its double headband' },
        { kind: 'clean', id: 'jewel-final', alt: 'The silver-plated headpiece, worn' },
        { kind: 'image', id: '1362d509', alt: 'The silver ice-crack headpiece on the skater, with the white look' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Sketches',
      media: [
        { kind: 'clean', id: 'sketch-1', alt: 'First design sketches' },
        { kind: 'clean', id: 'sketch-2', alt: 'Second and third design sketches' },
      ],
    },
    {
      kind: 'sketches',
      label: 'Final design',
      body: [
        'Look 1 is all white, for elegance, topped with blue shimmering snowflake embroidery and gemstones. Elastic, clipped sleeves come off during the performance to reveal Look 2.',
        'Look 2 is all dark blue and conveys the harm perfectionism does to mental health, with ice cracks embroidered across the skirt.',
      ],
      media: [
        { kind: 'clean', id: 'draft-blue', alt: 'First draft: the dark-blue look with slashed ice cracks' },
        { kind: 'clean', id: 'draft-white', alt: 'First draft: the white look with snowflake embroidery' },
        { kind: 'clean', id: 'final-blue', alt: 'Final design: the dark-blue look' },
        { kind: 'clean', id: 'final-white', alt: 'Final design: the white look with removable sleeves' },
      ],
    },
    {
      kind: 'final',
      title: 'Lookbook',
      media: [
        { kind: 'image', id: 'img-4444', alt: 'A spiral on the ice in the white look' },
        { kind: 'image', id: 'img-0825', alt: 'Posing at the rink barrier in the white look' },
        { kind: 'image', id: 'img-4450', alt: 'Smiling in the white look, hand on hip' },
        { kind: 'image', id: 'img-4483', alt: 'Leaning on the colourful rink barrier' },
        { kind: 'image', id: 'img-4593', alt: 'The dark-blue skirt in motion' },
        { kind: 'image', id: 'img-4594', alt: 'Close-up of the ice-crack embroidery on the dark-blue skirt' },
        { kind: 'image', id: 'img-4460', alt: 'Aya adjusting the headpiece on set' },
      ],
    },
    {
      kind: 'context',
      title: 'Exhibition',
      media: [
        { kind: 'image', id: 'img-5473', alt: 'Exhibition stand with both looks on mannequins' },
      ],
    },
    {
      kind: 'film',
      title: 'Film',
      media: [
        { kind: 'video', id: 'film', title: 'Glacier, final film' },
      ],
    },
  ],
  booklet: { doc: 'booklet', title: 'Glacier booklet' },
  credits: [
    { role: 'Design', name: 'Aya Hafez' },
    { role: 'Location', name: 'Sun City Mall ice rink' },
  ],
  status: 'draft',
  questions: [
    "The skater is a child. Do we have her parents' written consent to publish her photos and film, and how should she be credited (or not)?",
    'Course name, year and supervisors.',
    'Photographer and videographer credits.',
  ],
};
