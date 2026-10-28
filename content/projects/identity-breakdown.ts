import type { Project } from '../types.ts';

export const identityBreakdown: Project = {
  slug: 'identity-breakdown',
  title: 'Identity Breakdown',
  category: 'digital-fashion',
  tagline: 'Crazy enough? Never enough. Wearing formal to the movies.',
  summary:
    'A digital look designed from an identity analysis of Salma Amr: nostalgic, playful and dramatic, a fan of red lipstick and pink Crocs. The concept follows the trend of dressing formally for the cinema. It is Salma\'s outfit for a screening of Hepta, the Egyptian romance-drama about the seven stages of love, and it plays drama against laid-back comfort. Illustrated by hand, then built and styled in CLO3D.',
  facts: [
    { label: 'Subject', value: 'Salma Amr' },
    { label: 'Software', value: 'CLO3D' },
    { label: 'Process', value: 'Identity analysis → moodboard → illustration → 3D' },
  ],
  theme: {
    palette: ['#8C0F1E', '#E0115F', '#F7A8C4', '#1A0A0D', '#F2E6E8'],
    motif: 'A red-velvet curtain opening onto a vivid, personal digital fashion story.',
    interaction: 'A brief curtain reveal opens directly onto the project and its design process.',
  },
  cover: { kind: 'page', doc: 'deck', n: 10, alt: 'CLO3D avatar in a black jacket and long maroon skirt' },
  hero: { kind: 'page', doc: 'deck', n: 14, alt: "Final choice: Salma's movie outfit rendered in a red cinema setting" },
  sections: [
    {
      kind: 'concept',
      title: 'About her',
      body: [
        'The look starts with Salma: comfort, romance, nostalgia, CrossFit, red lipstick, pink Crocs, molten cake. For her, drama is a genre and life is a series of immersive experiences.',
        'The concept: "Crazy enough? Never enough!" Only the boldest dare to take part in the trend of wearing formal to the movies.',
      ],
      media: [
        { kind: 'page', doc: 'deck', n: 1, alt: 'Title page: Salma Amr, identity analysis' },
        { kind: 'page', doc: 'deck', n: 2, alt: 'About her: words describing Salma on a crimson background' },
        { kind: 'page', doc: 'deck', n: 3, alt: 'Concept: wearing formal to the movies' },
        { kind: 'page', doc: 'deck', n: 6, alt: 'Concept reference: a red dress among cinema seats' },
      ],
    },
    {
      kind: 'research',
      title: 'Moodboard',
      media: [
        { kind: 'page', doc: 'moodboard', n: 1, alt: 'Moodboard: red lipstick, pink Crocs, cinema seats, candy and red textures' },
        { kind: 'page', doc: 'deck', n: 7, alt: 'Moodboard page in the deck' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Fashion illustration',
      media: [
        { kind: 'page', doc: 'deck', n: 8, alt: 'Fashion illustrations of evening gowns' },
        { kind: 'page', doc: 'deck', n: 9, alt: 'Fashion illustration of a casual look with pink Crocs' },
      ],
    },
    {
      kind: 'digital',
      title: 'Built in CLO3D',
      media: [
        { kind: 'page', doc: 'deck', n: 10, alt: 'CLO3D renders of two evening options' },
        { kind: 'page', doc: 'deck', n: 11, alt: 'CLO3D renders in the cinema scene' },
        { kind: 'page', doc: 'deck', n: 12, alt: 'CLO3D close-up of the pink sequinned top' },
      ],
    },
    {
      kind: 'final',
      title: 'Final choice',
      body: [
        "Salma's choice at the cinema is Hepta, the romance-drama adapted from Mohamed Sadek's best-selling novel. It is framed as a psychologist's lecture on the seven stages of love, told through four interwoven stories.",
        "The outfit, styling and theme all fit the concept and the film's genre. It contrasts drama with laid-back comfort in colour, texture and feeling.",
      ],
      media: [
        { kind: 'page', doc: 'deck', n: 13, alt: 'Movie concept: the Hepta poster' },
        { kind: 'page', doc: 'deck', n: 14, alt: 'Final choice: the outfit in the cinema' },
      ],
    },
  ],
  booklet: { doc: 'deck', title: 'Identity Breakdown deck' },
  credits: [
    { role: 'Design', name: 'Aya Hafez' },
    { role: 'Subject', name: 'Salma Amr' },
  ],
  status: 'draft',
  questions: [
    'Course name, year and supervisors.',
    'Is Salma happy to be named and pictured (the deck has her photo)?',
    'A GLB export of the final look, for the cinema-screen scene.',
    'Any CLO runway or turntable video for this look?',
  ],
};
