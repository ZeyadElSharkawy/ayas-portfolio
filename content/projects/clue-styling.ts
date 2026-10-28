import type { Project } from '../types.ts';

export const clueStyling: Project = {
  slug: 'clue-styling',
  title: 'Clue',
  category: 'fashion-styling',
  client: 'Clue Wear (clue.eg)',
  year: 2026,
  tagline: 'Styling for an Egyptian fashion label, from the shoot to the storefront.',
  summary:
    "Styling and content for Clue Wear, an Egyptian womenswear label, during a summer 2026 internship: beachwear, loungewear and new-in edits shot in sunlit, sand-toned interiors. The images run across the brand's online store, from the homepage hero to the weekly \"New this week\" product grid.",
  facts: [
    { label: 'Role', value: 'Fashion Stylist & Content Creator (internship)' },
    { label: 'Dates', value: 'Aug – Sep 2026' },
    { label: 'Edits', value: 'Beachwear, loungewear, new this week' },
  ],
  theme: {
    palette: ['#E9DCC9', '#C9B79C', '#2B2B2B', '#F7F3EE', '#8A6A4F'],
    motif: 'Sunlit sand-coloured walls, hard shadows, a clean editorial grid.',
    interaction:
      'An editorial lightbox with a loupe that magnifies styling details, plus a 3D phone that scrolls through her shots live on clue.eg.',
  },
  cover: { kind: 'image', id: 'img-9039', alt: 'Model in a black off-shoulder top with a statement belt against a sand-coloured wall' },
  hero: { kind: 'image', id: 'img-9118', alt: 'Model in sunglasses and a sage shirt tied with a printed scarf, leaning into sunlight' },
  sections: [
    {
      kind: 'final',
      title: 'Editorial',
      media: [
        { kind: 'image', id: 'img-9039', alt: 'Black off-shoulder top and wide trousers with a crystal buckle belt' },
        { kind: 'image', id: 'img-9042', alt: 'Back view of the black off-shoulder look with gold cuffs' },
        { kind: 'image', id: 'img-8972', alt: 'Neon floral bandeau under a pale yellow shirt, with tinted sunglasses' },
        { kind: 'image', id: 'img-9076', alt: 'White draped jumpsuit with red heels, one leg raised' },
        { kind: 'image', id: 'img-9118', alt: 'Sage shirt with a brown paisley scarf tied at the waist, in sunlight' },
        { kind: 'image', id: 'img-9133', alt: 'Sage shirt and scarf, leaning on a white wall' },
        { kind: 'image', id: 'img-9135', alt: 'Two models in white shirts and dark wide trousers' },
        { kind: 'image', id: 'img-9200', alt: 'Brown blazer over a paisley scarf top with white jeans' },
        { kind: 'image', id: 'img-9282', alt: 'Open-back brown maxi dress with a long pendant' },
        { kind: 'image', id: 'img-9315', alt: 'Black cropped top and wide-leg jeans in a bright hallway' },
        { kind: 'image', id: 'img-9414', alt: 'Pale pink pyjama set, seated with a cup by a window' },
      ],
    },
    {
      kind: 'context',
      title: 'In the store',
      body: ['The shoot as published on clue.eg: the homepage hero, the collection banners and the weekly product grid.'],
      media: [
        { kind: 'image', id: 'img-8234', alt: 'clue.eg homepage: Beachwear hero image' },
        { kind: 'image', id: 'img-8235', alt: 'clue.eg collection banners: Beachwear and Loungewear' },
        { kind: 'image', id: 'img-8236', alt: 'clue.eg Loungewear banner and New this week' },
        { kind: 'image', id: 'img-8237', alt: 'clue.eg New this week: balloon-waist pants and hooded long cardigan' },
        { kind: 'image', id: 'img-8238', alt: 'clue.eg New this week: fluid lounge pants and wrap lounge vest' },
        { kind: 'image', id: 'img-8239', alt: 'clue.eg New this week: boxy resort shirt and embellished wide jeans' },
        { kind: 'image', id: 'img-8240', alt: 'clue.eg New this week: relaxed poplin shirt and draped long cardigan' },
        { kind: 'image', id: 'img-8241', alt: 'clue.eg New this week: halter maxi dress and long-sleeve crew-neck midi dress' },
        { kind: 'image', id: 'img-8242', alt: 'clue.eg homepage: Beachwear hero, alternate' },
      ],
    },
    {
      kind: 'film',
      title: 'Reels',
      media: [
        { kind: 'video', id: 'reel-1', title: 'Reel: beachwear' },
        { kind: 'video', id: 'reel-2', title: 'Reel: halter maxi dress' },
      ],
    },
  ],
  credits: [
    { role: 'Styling & content', name: 'Aya Hafez' },
    { role: 'Brand', name: 'Clue' },
  ],
  status: 'draft',
  questions: [
    'Photographer and model credits.',
    "Does Clue approve showing the shoot and screenshots of its store?",
  ],
};
