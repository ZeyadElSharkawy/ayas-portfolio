// "About the designer", in Aya's own words.

export const statement = 'Where creative vision meets technical precision.';

/** The home page hero, in her words. `hello` cycles through English, Arabic and German. */
export const intro = {
  name: 'Aya Hafez',
  hello: [
    { text: 'Hello', lang: 'en' },
    { text: 'مرحباً', lang: 'ar' },
    { text: 'Hallo', lang: 'de' },
  ],
  role: 'Fashion designer',
  // Her specialisms, then her own words on her goal (given by the user, 9 Nov 2026).
  text: 'I specialize in garment construction, pattern making, visual direction and 3D design. I believe every garment has its own story, and my goal is to translate cultural heritage and personal narrative into tangible collections that feel authentic, versatile, and expressive.',
};

/** The skills strip under the home hero: her software, then her hands-on skills (from her CV). */
export const heroSkills = [
  { name: 'Adobe Illustrator', icon: 'Ai' },
  { name: 'CLO 3D', icon: 'CLO' },
  { name: 'Adobe InDesign', icon: 'Id' },
  { name: 'Adobe Lightroom', icon: 'Lr' },
  { name: 'Wilcom Embroidery', icon: 'W' },
  { name: 'Pattern making', icon: 'pattern' },
  { name: 'Garment construction', icon: 'dress-form' },
  { name: 'Sewing', icon: 'needle' },
  { name: 'Jewellery making', icon: 'ring' },
  { name: 'Photography', icon: 'camera' },
  { name: 'Videography', icon: 'video' },
] as const;

/** The About page text, as given (9 Nov 2026). Her first line follows her name. */
export const aboutText = [
  'Aya Hafez is a fashion designer specializing in garment construction, pattern making, visual direction, 3D designing.',
  'I believe every garment has its own story, and my goal is to translate cultural heritage and personal narrative into tangible collections that feel authentic, versatile, and expressive. I enjoy turning abstract concepts into thoughtful designs that help wearers express identity and connect with their roots.',
  'My approach is precise, intentional, and detail-oriented, with a focus on combining traditional craftsmanship with technical precision to create meaningful garments that stand out with confidence.',
];

/** Open questions before launch. */
export const aboutQuestions = [
  'Is “Where creative vision meets technical precision.” the right one-line statement for the home page? (Chosen for her; confirm with Aya.)',
  'The home hero text joins her specialisms to her “my goal” paragraph. Is she happy with it?',
  'A professional portrait for the About page.',
  'Social links (Instagram, LinkedIn), if she wants them on the site.',
  'Availability line for recruiters: internship dates, location (Berlin), on-site or remote.',
];
