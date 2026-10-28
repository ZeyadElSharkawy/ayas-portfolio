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
  theme: {
    palette: ['#0F2A5C', '#2E5BA8', '#7FD3E6', '#E8EEF8', '#FFFFFF'],
    motif: 'Ice cracks and snowflakes on a frozen, pale-blue surface.',
    interaction: 'A short ice-breaking animation reveals the looks automatically; snowflakes drift as the statement appears.',
  },
  cover: { kind: 'image', id: 'img-4437', alt: 'A young skater in the white look gliding on the ice with one leg extended' },
  hero: { kind: 'image', id: 'img-4572', alt: 'The skater in the dark-blue look, arm raised gracefully on the ice rink' },
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
      media: [
        { kind: 'page', doc: 'booklet', n: 5, alt: 'Statement page: the quiet struggles of children under high expectations' },
        { kind: 'page', doc: 'booklet', n: 6, alt: 'Symbolism: ice cracks' },
        { kind: 'page', doc: 'booklet', n: 7, alt: 'Symbolism: snowflakes' },
      ],
    },
    {
      kind: 'research',
      title: 'Research',
      body: [
        'Cairo has three ice rinks. Sun City Mall was chosen because the Figure Skating Egypt team trains there, and so does the young skater who modelled the garment.',
        'Designing kidswear meant starting from the basics, including tracking down a child-sized draping mannequin in a warehouse in Faisal.',
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 8, alt: 'Colour palette with snowflake motifs' },
        { kind: 'page', doc: 'booklet', n: 10, alt: 'Inspiration moodboard of figure-skating costumes' },
        { kind: 'page', doc: 'booklet', n: 11, alt: 'Element moodboard of ice, frost and snow textures' },
        { kind: 'page', doc: 'booklet', n: 25, alt: 'Research into Cairo ice rinks' },
        { kind: 'page', doc: 'booklet', n: 26, alt: 'Sourcing a child-sized draping mannequin' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Design development',
      body: [
        'Look 1 is all white, for elegance, topped with blue shimmering snowflake embroidery and gemstones. Elastic, clipped sleeves come off during the performance to reveal Look 2.',
        'Look 2 is all dark blue and conveys the harm perfectionism does to mental health, with ice cracks embroidered across the skirt.',
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 12, alt: 'Design 1 sketch' },
        { kind: 'page', doc: 'booklet', n: 13, alt: 'Design 2 and 3 sketches' },
        { kind: 'page', doc: 'booklet', n: 14, alt: 'First draft: the dark-blue look with slashed ice cracks' },
        { kind: 'page', doc: 'booklet', n: 15, alt: 'First draft: the white look with snowflake embroidery' },
        { kind: 'page', doc: 'booklet', n: 16, alt: 'Final design: the dark-blue look' },
        { kind: 'page', doc: 'booklet', n: 17, alt: 'Final design: the white look with removable sleeves' },
      ],
    },
    {
      kind: 'materials',
      title: 'Cotton, slashing & embroidery',
      body: [
        'Pure cotton was hard to find in the Egyptian market. After a long search in Al-Azhar, she chose a thicker Oxford cotton and a light, flowing voile.',
        'Slashing three layers of voile into the shape of ice cracks was tested and set aside, because in contrasting colours it read more like a wound than ice.',
        'The snowflakes and cracks were drawn in Adobe Illustrator, digitised in Wilcom and stitched on an embroidery machine.',
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 18, alt: 'Cotton as a material: history and sourcing' },
        { kind: 'page', doc: 'booklet', n: 19, alt: 'Comparing Oxford and voile cotton' },
        { kind: 'page', doc: 'booklet', n: 20, alt: 'Fabric manipulation: slashing trials' },
        { kind: 'page', doc: 'booklet', n: 21, alt: 'Machine embroidery trials of snowflake shapes' },
        { kind: 'page', doc: 'booklet', n: 22, alt: 'Digital embroidery in Wilcom' },
        { kind: 'image', id: 'img-4869', alt: 'A snowflake being stitched on the embroidery machine' },
        { kind: 'image', id: 'img-4829', alt: 'Embroidered blue snowflakes on white cotton' },
      ],
    },
    {
      kind: 'construction',
      title: 'Patterns, prototypes & jewellery',
      body: [
        'The hardest part was making the garment interchangeable while it still worked as an ice-skating dress. The skirt and top were sewn so they could switch smoothly mid-performance.',
        'The headpiece was cast in wax, set with rhinestones, soldered and silver-plated, with ice cracks engraved into it.',
      ],
      media: [
        { kind: 'page', doc: 'booklet', n: 30, alt: 'Kidswear pattern pieces' },
        { kind: 'page', doc: 'booklet', n: 28, alt: 'Prototypes on the mannequin and in fittings' },
        { kind: 'image', id: 'img-4862', alt: 'Cut dark-blue pattern pieces with embroidered crack lines, and a curious cat' },
        { kind: 'image', id: 'img-4626', alt: 'The white look on a child mannequin' },
        { kind: 'image', id: 'eeb04d3a', alt: 'The dark-blue look on a child mannequin' },
        { kind: 'image', id: 'img-4770', alt: 'Fitting the dark-blue look' },
        { kind: 'image', id: 'img-4773', alt: 'Fitting the white look' },
        { kind: 'page', doc: 'booklet', n: 32, alt: 'The jewellery: an engraved silver headpiece' },
        { kind: 'image', id: '846bbfa8', alt: 'Jewellery process: sketching, wax, casting, soldering, cleaning and silver plating' },
        { kind: 'image', id: '1362d509', alt: 'The silver ice-crack headpiece on the skater, with the white look' },
      ],
    },
    {
      kind: 'final',
      title: 'Lookbook',
      media: [
        { kind: 'image', id: 'img-4437', alt: 'Gliding on the ice in the white look, one leg extended' },
        { kind: 'image', id: 'img-4444', alt: 'A spiral on the ice in the white look' },
        { kind: 'image', id: 'img-0825', alt: 'Posing at the rink barrier in the white look' },
        { kind: 'image', id: 'img-4447', alt: 'Portrait in the white look with snowflake embroidery' },
        { kind: 'image', id: 'img-4450', alt: 'Smiling in the white look, hand on hip' },
        { kind: 'image', id: 'img-4483', alt: 'Leaning on the colourful rink barrier' },
        { kind: 'image', id: 'img-4572', alt: 'Arm raised on the ice in the dark-blue look' },
        { kind: 'image', id: 'img-4592', alt: 'Side view of the dark-blue look' },
        { kind: 'image', id: 'img-4593', alt: 'The dark-blue skirt in motion' },
        { kind: 'image', id: 'img-4594', alt: 'Close-up of the ice-crack embroidery on the dark-blue skirt' },
        { kind: 'image', id: 'img-4460', alt: 'Aya adjusting the headpiece on set' },
      ],
    },
    {
      kind: 'context',
      title: 'Exhibition',
      media: [
        { kind: 'image', id: 'e59c9ac9', alt: 'Glacier exhibition poster with the statement and jewellery close-ups' },
        { kind: 'image', id: 'f46503f9', alt: '"Spinning out ice" exhibition board: element, fashion, jewellery and palette' },
        { kind: 'image', id: 'img-5473', alt: 'Exhibition stand with both looks on mannequins' },
      ],
    },
    {
      kind: 'film',
      title: 'Film',
      media: [
        { kind: 'video', id: 'film', title: 'Glacier, final film' },
        { kind: 'page', doc: 'booklet', n: 34, alt: 'Hand-drawn video storyboard' },
        { kind: 'page', doc: 'booklet', n: 35, alt: 'Video storyboard, continued' },
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
