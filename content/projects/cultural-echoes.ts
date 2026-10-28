import type { Project } from '../types.ts';

export const culturalEchoes: Project = {
  slug: 'cultural-echoes',
  title: 'Cultural Echoes',
  titleAr: 'من أعماق المجتمع',
  category: 'selected-works',
  tagline: 'Experience the fusion of culture and style, where each piece tells a story of community and identity.',
  summary:
    "An executed look inspired by the songs of Egypt's alternative pop and hip-hop scene, and how their lyrics describe our customs and traditions. Symbols taken from Cairo street life are rendered in khayamiya, the tent-makers' hand-stitched appliqué, to portray the layers of Egyptian society and the diversity of its culture.",
  facts: [
    { label: 'Course', value: 'Conceptual Design Basics II · Echoes of Egypt' },
    { label: 'Inspiration', value: 'Alternative Egyptian pop and hip-hop' },
    { label: 'Technique', value: 'Khayamiya appliqué' },
    { label: 'Shot in', value: 'Historic Cairo' },
  ],
  theme: {
    palette: ['#1F5B45', '#E89A2C', '#C2531F', '#5A1F33', '#F6E3CF'],
    motif: 'Turquoise arched doorways of old Cairo, khayamiya appliqué panels, and the oud, tabla and qanun icons from her poster border.',
    interaction:
      'Open a turquoise arched door to reveal the whole project. Khayamiya panels stitch themselves together as you scroll, and the instrument icons play a short phrase on hover (sound is opt-in).',
  },
  cover: { kind: 'image', id: 'front', alt: 'Saffron vest over a teal top and wide teal trousers, standing in a stone archway in historic Cairo' },
  hero: { kind: 'image', id: 'side-2', alt: 'Profile on a Cairo rooftop at golden hour, wearing an oversized red and cream fabric headwrap' },
  sections: [
    {
      kind: 'concept',
      title: 'From the depths of society',
      body: [
        "The project explores the world of Egyptian hip-hop and alternative pop, and how its lyrics reflect our traditions and customs. Through the songs, we see how music inspires the way we dress: we are a contemplative people who express ourselves through clothing shaped by our surroundings.",
        'The look presents those traditions in a contemporary way. It uses khayamiya, the hand-stitched appliqué of Cairo\'s tent-makers, to draw symbols taken from street life, representing the layers of society and the diversity of Egyptian culture.',
      ],
      bodyAr: [
        'مستوحى من الأغاني التي توصف عاداتنا و تقاليدنا و ترجمت في التصميم بشغل الخيامية اليدوي',
      ],
      media: [
        { kind: 'page', doc: 'poster', n: 1, alt: 'Project poster: Cultural Echoes, من أعماق المجتمع, collaged Cairo street figures on an orange ground framed by instrument icons' },
        { kind: 'page', doc: 'booklet', n: 3, alt: 'Mind map: alternative Egyptian pop, rhythms (oud, tabla, qanun), lyrics, graphics, bands and social commentary' },
      ],
    },
    {
      kind: 'research',
      title: 'Moodboards & palette',
      media: [
        { kind: 'page', doc: 'booklet', n: 4, alt: 'Moodboard of Egyptian album covers, band photos and street imagery' },
        { kind: 'page', doc: 'booklet', n: 5, alt: 'Moodboard of tent-maker textiles, instruments and colour studies' },
        { kind: 'page', doc: 'booklet', n: 2, alt: 'Colour palette: bottle green, saffron, burnt orange and plum' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Sketches',
      media: [
        { kind: 'page', doc: 'booklet', n: 6, alt: 'Fashion sketches of the look in green, orange and saffron' },
        { kind: 'page', doc: 'booklet', n: 7, alt: 'Sketches of skirt and vest variations with a khayamiya curtain reference' },
      ],
    },
    {
      kind: 'final',
      title: 'The look',
      media: [
        { kind: 'image', id: 'front', alt: 'Front view in a stone archway: saffron vest, teal top and wide teal trousers' },
        { kind: 'image', id: 'details2', alt: 'Close-up of the appliquéd saffron vest and an oversized red and cream fabric headwrap' },
        { kind: 'image', id: 'details', alt: 'Back of the teal top showing khayamiya appliqué motifs, with a saffron head scarf' },
        { kind: 'image', id: 'back-2', alt: 'Standing in an archway wearing the stacked fabric headwrap, saffron vest and teal trousers' },
        { kind: 'image', id: 'side', alt: 'Beside turquoise arched doors: saffron vest, teal top and a panelled orange and cream skirt' },
        { kind: 'image', id: 'back', alt: 'Walking away down a narrow Cairo alley in the panelled orange and cream skirt' },
        { kind: 'image', id: 'side-2', alt: 'Profile on a Cairo rooftop at golden hour' },
      ],
    },
    {
      kind: 'film',
      title: 'Film',
      media: [
        { kind: 'video', id: 'film', title: 'Cultural Echoes, full film' },
        { kind: 'video', id: 'trailer', title: 'Trailer' },
        { kind: 'video', id: 'outfit-details', title: 'Outfit details' },
      ],
    },
  ],
  credits: [
    { role: 'Design', name: 'Aya Hafez' },
    { role: 'Associate Lecturer', name: 'Marie Akoury' },
    { role: 'Associate Professor', name: 'Dipl.-Ing. Thomas Hill' },
    { role: 'Teaching Assistants', name: 'Farah Gamal, Mayar Abdelkader' },
  ],
  status: 'draft',
  questions: [
    'The booklet is named "do not use these pics". Why? Its Cairo shoot (pp. 8–63) is some of her strongest work.',
    'Photographer and model credits.',
    'Year: the poster says "Winter 25/24". Is it Winter 2024/25?',
    'The booklet says "alternative Egyptian pop" and the poster says "Egyptian hip-hop". Which framing does she prefer?',
  ],
};
