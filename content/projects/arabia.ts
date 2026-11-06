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
  palette: ['#7A1020', '#EFE6D2', '#5B3A1E', '#C9A66B', '#2B1A12'],
  cover: { kind: 'clean', id: 'look1-front', alt: 'Look 1 on a calligraphy-lit runway' },
  hero: { kind: 'clean', id: 'look1-front', alt: 'Runway render of Look 1: cream calligraphy shirt over brown trousers' },
  heroSet: [
    { kind: 'clean', id: 'niche-1', alt: 'Look 1: cream calligraphy shirt over brown trousers' },
    { kind: 'clean', id: 'niche-2', alt: 'Look 2: maroon abaya with calligraphy-printed panels and cream hijab' },
    { kind: 'clean', id: 'niche-3', alt: 'Look 3: sand-coloured cape dress with maroon accents' },
  ],
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
      media: [],
    },
    {
      kind: 'digital',
      title: 'Avatar & fabrics',
      body: [
        'To support the idea of chic modesty, the avatar uses a realistic skin setting instead of the default matte, with customised facial features, hairstyle and hair colour. It reads as a real, relatable woman rather than a digital mannequin.',
        'Each fabric was built with its own normal, ambient, displacement and specular maps, with the calligraphy worked into the texture itself.',
      ],
      media: [
        { kind: 'clean', id: 'avatar-front', alt: "The customised avatar, front" },
        { kind: 'clean', id: 'avatar-back', alt: "The customised avatar, back" },
        { kind: 'clean', id: 'fabric-linen', alt: "Virtual linen draped over a form", caption: "Linen" },
        { kind: 'clean', id: 'fabric-chiffon', alt: "Virtual embroidered chiffon draped over a form", caption: "Chiffon" },
        { kind: 'clean', id: 'fabric-gabardine', alt: "Virtual gabardine draped over a form", caption: "Gabardine" },
        { kind: 'clean', id: 'fabric-poplin', alt: "Virtual cotton poplin draped over a form", caption: "Cotton poplin" },
        { kind: 'clean', id: 'map-normal', alt: "Calligraphy fabric normal map", caption: "Normal map" },
        { kind: 'clean', id: 'map-ambient', alt: "Calligraphy fabric ambient map", caption: "Ambient map" },
        { kind: 'clean', id: 'map-displacement', alt: "Calligraphy fabric displacement map", caption: "Displacement map" },
        { kind: 'clean', id: 'map-specular', alt: "Calligraphy fabric specular map", caption: "Specular map" },
      ],
    },
    {
      kind: 'final',
      title: 'Look 1: the shirt',
      media: [
        { kind: 'clean', id: 'look1-front', alt: "Look 1 on a calligraphy-lit runway, front" },
        { kind: 'clean', id: 'look1-side', alt: "Look 1 on the runway, side" },
        { kind: 'clean', id: 'look1-detail-1', alt: "Look 1 detail: maroon trims on the cream shirt" },
        { kind: 'clean', id: 'look1-detail-2', alt: "Look 1 detail: the calligraphy print panel" },
        { kind: 'clean', id: 'look1-detail-3', alt: "Look 1 detail: the front panels" },
        { kind: 'clean', id: 'look1-detail-4', alt: "Look 1 detail: the back panel" },
        { kind: 'clean', id: 'look1-before', alt: "The base shirt on the avatar", caption: "Before" },
        { kind: 'clean', id: 'look1-after', alt: "The finished Look 1", caption: "After" },
      ],
    },
    {
      kind: 'final',
      title: 'Look 2: the abaya',
      media: [
        { kind: 'clean', id: 'look2-2', alt: "Look 2, side" },
        { kind: 'clean', id: 'look2-3', alt: "Look 2, other side" },
        { kind: 'clean', id: 'look2-4', alt: "Look 2, back" },
        { kind: 'clean', id: 'look2-detail-1', alt: "Look 2 detail: the calligraphy panel" },
        { kind: 'clean', id: 'look2-detail-2', alt: "Look 2 detail: sleeve and hem" },
      ],
    },
    {
      kind: 'final',
      title: 'Look 3: the cape',
      media: [
        { kind: 'clean', id: 'look3-2', alt: "Look 3, side" },
        { kind: 'clean', id: 'look3-3', alt: "Look 3, front at an angle" },
        { kind: 'clean', id: 'look3-4', alt: "Look 3, other side" },
      ],
    },
    {
      kind: 'construction',
      title: 'Technical drawings',
      media: [
        { kind: 'clean', id: 'draw1-1', alt: "Look 1 technical drawing, front", caption: "Look 1" },
        { kind: 'clean', id: 'draw1-2', alt: "Look 1 technical drawing, side" },
        { kind: 'clean', id: 'draw1-3', alt: "Look 1 technical drawing, back" },
        { kind: 'clean', id: 'draw2-1', alt: "Look 2 technical drawing, front", caption: "Look 2" },
        { kind: 'clean', id: 'draw2-2', alt: "Look 2 technical drawing, side" },
        { kind: 'clean', id: 'draw2-3', alt: "Look 2 technical drawing, back" },
        { kind: 'clean', id: 'draw3-1', alt: "Look 3 technical drawing, front", caption: "Look 3" },
        { kind: 'clean', id: 'draw3-2', alt: "Look 3 technical drawing, side" },
        { kind: 'clean', id: 'draw3-3', alt: "Look 3 technical drawing, back" },
      ],
    },
    {
      kind: 'construction',
      title: '2D patterns',
      media: [
        { kind: 'clean', id: 'pattern1-1', alt: "Look 1 2D pattern pieces", caption: "Look 1" },
        { kind: 'clean', id: 'pattern1-2', alt: "Look 1 2D pattern pieces, shirt" },
        { kind: 'clean', id: 'pattern2-1', alt: "Look 2 2D pattern pieces", caption: "Look 2" },
        { kind: 'clean', id: 'pattern2-2', alt: "Look 2 2D pattern pieces, abaya" },
        { kind: 'clean', id: 'pattern3-1', alt: "Look 3 2D pattern pieces", caption: "Look 3" },
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
    'Higher-resolution renders than the deck pages, if she has them.',
    'The rendered runway videos are only 480×720. Are there larger exports?',
  ],
};
