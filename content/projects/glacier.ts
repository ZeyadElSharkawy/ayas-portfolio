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
      label: 'Colour palette',
      media: [
        { kind: 'clean', id: 'palette', alt: 'Colour palette: five snowflake motifs in navy, ice blue, lavender, white and grey' },
      ],
    },
    {
      kind: 'research',
      label: 'Moodboard',
      media: [
        { kind: 'clean', id: 'moodboard-inspiration', alt: 'Inspiration moodboard of figure-skating costumes' },
        { kind: 'clean', id: 'moodboard-element', alt: 'Element moodboard of ice, frost and snow textures' },
      ],
    },
    {
      kind: 'construction',
      chapter: 'development',
      label: 'Jewellery',
      // Her own words, from the Glacier jewellery poster below.
      body: [
        'This silver-plated brass headpiece features intricate ice crack motifs, symbolizing the fragile and fractured mental state of children under the immense pressure to be perfect. Just as ice cracks under stress, these delicate patterns represent the negative impact that unrealistic expectations and the relentless pursuit of flawlessness have on young minds.',
        'The piece serves as an important reminder of the vulnerability beneath the surface, highlighting how the burden of perfection can fracture a child’s well-being and creativity, urging us to recognize these hidden struggles.',
      ],
      // Her three jewellery posters, shown whole: here the poster is the work.
      media: [
        { kind: 'clean', id: 'jewel-poster-mood', alt: 'Jewellery moodboard poster, “Spinning Out Ice”: figure skaters, skate charms and gold headpieces around notes on element, fashion, jewellery and a blue and teal colour palette' },
        { kind: 'clean', id: 'jewel-poster-process', alt: 'Jewellery process poster in six steps: sketching and technical drawing, wax, casting, soldering, cleaning and galvanization, silver plating, ending with the headpiece worn' },
        { kind: 'clean', id: 'jewel-poster-final', alt: 'Glacier jewellery poster: the silver-plated headpiece with ice-crack engraving and blue stones, shown alone and worn, with her text about it' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Sketches',
      media: [
        { kind: 'clean', id: 'final-blue', alt: 'The dark-blue look, with ice cracks across the bodice and skirt' },
        { kind: 'clean', id: 'final-white', alt: 'The white look, with snowflake embroidery and removable sleeves' },
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
