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
  palette: ['#8C0F1E', '#E0115F', '#F7A8C4', '#1A0A0D', '#F2E6E8'],
  cover: { kind: 'clean', id: 'render-black-jacket', alt: 'CLO3D avatar in a black jacket and long maroon skirt' },
  hero: { kind: 'clean', id: 'render-final', alt: "Final choice: Salma's movie outfit rendered in a red cinema setting" },
  heroSet: [
    { kind: 'clean', id: 'render-final', alt: "Final choice: Salma's movie outfit rendered in a red cinema setting" },
  ],
  sections: [
    {
      kind: 'concept',
      title: 'About her',
      body: [
        'The look starts with Salma: comfort, romance, nostalgia, CrossFit, red lipstick, pink Crocs, molten cake. For her, drama is a genre and life is a series of immersive experiences.',
        'The concept: "Crazy enough? Never enough!" Only the boldest dare to take part in the trend of wearing formal to the movies.',
      ],
      media: [],
    },
    {
      kind: 'research',
      title: 'Moodboard',
      media: [
        { kind: 'page', doc: 'moodboard', n: 1, alt: 'Moodboard: red lipstick, pink Crocs, cinema seats, candy and red textures' },
      ],
    },
    {
      kind: 'sketches',
      title: 'Fashion illustration',
      media: [
        { kind: 'clean', id: 'illustration-pink', alt: "Fashion illustration of a hot-pink evening gown with a black off-shoulder neckline" },
        { kind: 'clean', id: 'illustration-black', alt: "Pencil fashion illustration of a black evening gown with a sweeping train" },
        { kind: 'clean', id: 'illustration-casual', alt: "Fashion illustration of a casual look with a red shirt, grey joggers and pink Crocs" },
      ],
    },
    {
      kind: 'digital',
      title: 'Built in CLO3D',
      media: [
        { kind: 'clean', id: 'render-black-jacket', alt: "CLO3D render of the black jacket over a long velvet skirt" },
        { kind: 'clean', id: 'render-pink-jacket', alt: "CLO3D render of a hot-pink fur jacket over the velvet skirt" },
        { kind: 'clean', id: 'render-cinema', alt: "CLO3D render of the outfit in the cinema scene" },
        { kind: 'clean', id: 'render-closeup', alt: "CLO3D close-up of the pink leopard sequinned top" },
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
        { kind: 'clean', id: 'render-final', alt: "Final choice: Salma's movie outfit rendered in a red cinema setting" },
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
    'Any CLO runway or turntable video for this look?',
  ],
};
