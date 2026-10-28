// Aya's contact details and CV, from her résumé (Drive Folder Content/Aya Hafez Resume.pdf).

export const contact = {
  email: 'ayaayousseffff@gmail.com',
  phone: { display: '+49 151 5628 3150', href: 'tel:+4915156283150' },
  whatsapp: { display: '+20 102 232 1115', href: 'https://wa.me/201022321115' },
  location: 'Berlin, Germany',
  /** The résumé as a download, served from public/. */
  cvPdf: '/Aya-Hafez-CV.pdf',
};

export const summary =
  'Top-ranked Fashion Design student at the German International University in Cairo. Skilled in translating creative concepts into original designs through pattern making, garment construction, sewing and jewellery making, with experience in fashion photography, content creation and social media.';

export const education = [
  {
    title: 'Fashion Design',
    place: 'German International University in Cairo',
    dates: '2023 – present',
    notes: ['Ranked first in Fashion Design in semesters 2, 3, 4 and 5', 'GPA 1.15 (German system)'],
  },
  {
    title: 'High School Diploma and American Diploma',
    place: 'Egyptian American International School',
    dates: '2015 – 2023',
    notes: ['GPA 3.9'],
  },
];

export interface Role {
  title: string;
  place: string;
  dates: string;
  kind: string;
  notes: string[];
}

/** Fashion work first; the rest of her experience follows. */
export const experience: Role[] = [
  {
    title: 'Fashion Stylist & Content Creator',
    place: 'Clue Wear',
    dates: 'Aug – Sep 2026',
    kind: 'Internship',
    notes: [
      'Styled models for photoshoots, keeping them consistent with the brand’s identity and creative direction.',
      'Helped plan and coordinate shoots, contributing to styling concepts and content development.',
      'Captured photo and video for social media, including user-generated content and in-store visuals.',
    ],
  },
  {
    title: 'Fashion Intern',
    place: 'Rabab Kareem Couture',
    dates: 'Jun – Jul 2024',
    kind: 'Internship',
    notes: ['Took client measurements.', 'Hand-stitched and beaded soirée dresses.', 'Learned new pattern-drafting techniques.'],
  },
  {
    title: 'Content Creator / Fashion Photographer',
    place: 'Orion Modeling Agency',
    dates: 'Mar 2022 – Dec 2023',
    kind: 'Project-based',
    notes: ['Produced fashion photography for the agency’s visual content.', 'Managed its social media, from reels to regular posts.'],
  },
  {
    title: 'Content Creator',
    place: 'Target Marketing Agency',
    dates: 'Sep 2023 – Apr 2024',
    kind: 'Part-time',
    notes: ['Developed content plans with clients, from research and trends to visual and written concepts, working with photographers, videographers and designers.'],
  },
  {
    title: 'SEO Specialist',
    place: 'DIY Arabia',
    dates: 'Oct 2023 – Mar 2024',
    kind: 'Part-time',
    notes: ['Wrote and optimised SEO content, from keyword research to articles and website copy.'],
  },
  {
    title: 'On-Ground Content Creator',
    place: 'Power of Three Agency',
    dates: 'Aug – Sep 2023',
    kind: 'Internship',
    notes: ['Created original content for on-ground campaigns with the creative team.'],
  },
];

export const activities: Role[] = [
  {
    title: 'Speaker',
    place: 'TEDxYouth@ABIS',
    dates: 'Jul – Sep 2024',
    kind: 'Public speaking',
    notes: ['Researched, wrote and delivered a talk on the TEDx stage.'],
  },
  {
    title: 'Social Media Head',
    place: 'YouThink',
    dates: 'Aug 2022 – Aug 2023',
    kind: 'Marketing',
    notes: ['Produced carousel and reel content and taught a team the basics of social media strategy.'],
  },
  {
    title: 'Marketing & Multimedia Head',
    place: 'ABISMUN',
    dates: 'Mar – Dec 2022',
    kind: 'Marketing',
    notes: ['Led marketing and multimedia, managing a team of designers and marketers.'],
  },
  {
    title: 'Ambassadorship Multimedia Head',
    place: '51 Campus',
    dates: 'Jan – Jun 2022',
    kind: 'Marketing',
    notes: ['Represented the company and organised promotional events.'],
  },
  {
    title: 'Talents Development Member',
    place: 'Emmkan Ambassadorship Program',
    dates: 'May – Oct 2022',
    kind: 'Training',
    notes: ['Developed training programmes and workshops for the programme’s members.'],
  },
  {
    title: 'Marketing & Multimedia Member',
    place: 'TEDxYouth@ABIS Fourth Generation',
    dates: 'Jan – Oct 2022',
    kind: 'Media',
    notes: ['Designed posts and covered the event and fundraisers.'],
  },
];

export const software = ['Adobe Illustrator', 'Lightroom', 'CLO 3D', 'InDesign', 'Wilcom Embroidery'];

export const skills = [
  { group: 'Design & technical', items: ['Sewing', 'Pattern making', 'Garment construction', 'Jewellery making'] },
  { group: 'Content & media', items: ['Photography', 'Photo editing', 'Videography', 'Content creation', 'Social media', 'SEO writing'] },
  { group: 'Professional', items: ['Communication', 'Problem solving', 'Critical thinking', 'Public speaking'] },
];

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Arabic', level: 'Fluent' },
  { name: 'German', level: 'B2' },
  { name: 'French', level: 'A1' },
];

export const courses = [
  'German B2, HTW University',
  'German B1, Ulm University',
  'German A2, GIU Berlin',
  'SolidWorks, German International University',
  'Autodesk Inventor, German International University',
  'Pattern Making, Creative Courses',
  'Photography, BH Courses',
  'Videography, Cairo Photo Club',
  'Photo Editing, Cairo Photo Club',
];
