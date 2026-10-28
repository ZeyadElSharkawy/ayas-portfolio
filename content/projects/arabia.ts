import type { Project } from '../types.ts';

export const arabia: Project = {
  slug: 'arabia',
  title: 'Arabia Collection',
  category: 'digital-fashion',
  year: 2026,
  tagline: 'Chic modesty, rebuilt from the shirt pattern up.',
  summary:
    'A three-look digital collection built in CLO3D. It deconstructs the classic shirt pattern into a structural hero piece and infuses it with Arabic calligraphy and an earthy palette. Rooted in "chic modesty", it speaks to hijabi and non-hijabi women alike, and argues that modesty is a powerful fashion statement.',
  facts: [
    { label: 'Software', value: 'CLO3D' },
    { label: 'Course', value: 'CAD Pattern II (FASD505)' },
    { label: 'Virtual fabrics', value: 'Linen, chiffon, gabardine, cotton poplin' },
    { label: 'Outputs', value: 'Renders, technical drawings, 2D patterns, turntables, runway animation' },
  ],
  theme: {
    palette: ['#7A1020', '#EFE6D2', '#5B3A1E', '#C9A66B', '#2B1A12'],
    motif: 'Arabic calligraphy as print and fabric map; maroon and cream.',
    interaction:
      'Real 3D garments (GLB exported from CLO3D) you can orbit. Swatch buttons swap fabrics live, a before/after slider compares the avatar, and a toggle flips between the 2D pattern and the 3D garment.',
  },
  cover: { kind: 'page', doc: 'deck', n: 26, alt: 'The three digital looks side by side on a maroon background' },
  hero: { kind: 'page', doc: 'deck', n: 9, alt: 'Runway renders of Look 1: cream calligraphy shirt over brown trousers' },
  sections: [
    {
      kind: 'concept',
      title: 'Concept',
      body: [
        'This collection reimagines the fundamental architecture of the classic shirt, deconstructing its traditional pattern to transform it into a structural hero piece that defines the entire silhouette.',
        'Rooted in the philosophy of chic modesty, the design transcends cultural and religious boundaries, offering a sophisticated aesthetic for hijabi and non-hijabi women alike. High-end tailoring meets the regal geometry of Arabic calligraphy and a rich, earthy palette, making the garment a canvas for cultural expression: modesty as a fashion statement that honours heritage through a modern, high-fashion lens.',
      ],
      bodyAr: [
        "المجموعة دي بتعيد تشكيل الفكرة التقليدية للقميص، وبتحول الباترون الأساسي لقطعة هي بطلة الطقم كله وليها كيانها الخاص. الفكرة كلها بتتمحور حول 'الشياكة المحتشمة'، اللي بتجمع المحجبات وغير المحجبات في ستايل واحد راقي بيعبر عن هويتنا. ومن خلال دمج الخياطة الراقية مع جمال الخط العربي والألوان الدافئة، قدرت اخلي اللبس مش مجرد قطعة قماش، لكنه رسالة بتأكد إن الاحتشام قمة في الأناقة، وإن تراثنا العربي يقدر يكون عصري جدًا وفي منتهى الشياكة",
      ],
      media: [
        { kind: 'page', doc: 'deck', n: 1, alt: 'Title page with red Arabic calligraphy' },
        { kind: 'page', doc: 'deck', n: 2, alt: 'Concept page in English and Arabic' },
      ],
    },
    {
      kind: 'digital',
      title: 'Avatar & fabrics',
      body: [
        'To support the idea of chic modesty, the avatar uses a realistic skin setting instead of the default matte, with customised facial features, hairstyle and hair colour. It reads as a real, relatable woman rather than a digital mannequin.',
        'Each fabric was built with its own normal, ambient, displacement and specular maps, with the calligraphy worked into the texture itself.',
      ],
      media: [
        { kind: 'page', doc: 'deck', n: 3, alt: 'Avatar customisation: realistic skin, face and hair' },
        { kind: 'page', doc: 'deck', n: 4, alt: 'Virtual fabric tests: linen and chiffon draped over forms' },
        { kind: 'page', doc: 'deck', n: 5, alt: 'Virtual fabric tests: gabardine and cotton poplin' },
        { kind: 'page', doc: 'deck', n: 6, alt: 'Fabric maps: normal and ambient' },
        { kind: 'page', doc: 'deck', n: 7, alt: 'Fabric maps: displacement and specular' },
      ],
    },
    {
      kind: 'final',
      title: 'Look 1: the shirt',
      media: [
        { kind: 'page', doc: 'deck', n: 8, alt: 'Look 1 renders on a calligraphy-lit runway' },
        { kind: 'page', doc: 'deck', n: 10, alt: 'Look 1 details: calligraphy print panels and maroon trims' },
        { kind: 'page', doc: 'deck', n: 11, alt: 'Look 1 details, back' },
        { kind: 'page', doc: 'deck', n: 15, alt: 'Before and after: the base shirt and the finished Look 1' },
      ],
    },
    {
      kind: 'final',
      title: 'Look 2: the abaya',
      media: [
        { kind: 'page', doc: 'deck', n: 16, alt: 'Look 2: maroon abaya with calligraphy-printed panels and cream hijab' },
        { kind: 'page', doc: 'deck', n: 17, alt: 'Look 2, side and back' },
        { kind: 'page', doc: 'deck', n: 18, alt: 'Look 2 details: the calligraphy panel' },
        { kind: 'page', doc: 'deck', n: 19, alt: 'Look 2 details: sleeve and hem' },
      ],
    },
    {
      kind: 'final',
      title: 'Look 3: the cape',
      media: [
        { kind: 'page', doc: 'deck', n: 22, alt: 'Look 3: sand-coloured cape dress with maroon accents' },
        { kind: 'page', doc: 'deck', n: 23, alt: 'Look 3, alternate angles' },
      ],
    },
    {
      kind: 'construction',
      title: 'Technical drawings & 2D patterns',
      media: [
        { kind: 'page', doc: 'deck', n: 12, alt: 'Look 1 technical drawing' },
        { kind: 'page', doc: 'deck', n: 13, alt: 'Look 1 2D pattern' },
        { kind: 'page', doc: 'deck', n: 21, alt: 'Look 2 technical drawing' },
        { kind: 'page', doc: 'deck', n: 20, alt: 'Look 2 2D pattern' },
        { kind: 'page', doc: 'deck', n: 25, alt: 'Look 3 technical drawing' },
        { kind: 'page', doc: 'deck', n: 24, alt: 'Look 3 2D pattern' },
      ],
    },
    {
      kind: 'film',
      title: 'Animation',
      media: [
        { kind: 'video', id: 'turntable-shirt', title: 'Turntable: Look 1' },
        { kind: 'video', id: 'turntable-abaya', title: 'Turntable: Look 2' },
        { kind: 'video', id: 'abaya-render', title: 'Runway: Look 2, rendered' },
        { kind: 'video', id: 'walk-unrendered', title: 'Runway: Look 3, walk preview' },
      ],
    },
  ],
  booklet: { doc: 'deck', title: 'Arabia Collection deck' },
  credits: [
    { role: 'Design', name: 'Aya Hafez' },
    { role: 'Supervisor', name: 'Professor Soha Afifi' },
    { role: 'Teaching Assistants', name: 'Khadega Khalil, Nadine Basmy' },
  ],
  status: 'draft',
  questions: [
    'Can she export the three garments from CLO3D as GLB (or OBJ + textures)? This unlocks the 3D viewer.',
    'Higher-resolution renders than the deck pages, if she has them.',
    'The rendered runway videos are only 480×720. Are there larger exports?',
  ],
};
