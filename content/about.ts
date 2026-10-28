// Aya's character at the Desk: how she looks, and what she says when you click her.
// The introduction is Aya's own "About the designer" text.

import type { StationId } from '@/lib/hub/stations';
import { contact } from './cv';

/** The character's colours, after Aya's own Bitmoji. */
export const ayaLook = {
  skin: '#f6cfb3',
  hijab: '#2f8b8e', // teal
  underscarf: '#f6f5f2', // the white band at the forehead
  abaya: '#86c8c3', // pale teal open abaya
  trim: '#2a6c6e', // dark teal embroidered trim on the front edges and cuffs
  dress: '#e6f0f1', // pale inner dress
  shoes: '#ffffff',
  eyes: '#6b4426',
  lips: '#e27b8e',
  liner: '#2b1a1d',
};

export type DialogueAction = { goto: StationId } | { href: string } | 'close';

export interface DialogueChoice {
  label: string;
  next?: string;
  action?: DialogueAction;
}

export interface DialogueNode {
  id: string;
  lines: string[];
  choices?: DialogueChoice[];
}

const tour: DialogueChoice[] = [
  { label: 'Show me the selected works', action: { goto: 'atelier-floor' } },
  { label: 'Show me the digital fashion', action: { goto: 'digital-lab' } },
  { label: 'Show me the styling', action: { goto: 'styling-room' } },
  { label: 'How can I reach you?', next: 'contact' },
  { label: 'Not just yet', next: 'bye' },
];

/** "About the designer", in Aya's words. Shown on /about, and spoken line by line at the Desk. */
export const aboutText = [
  'Welcome to my atelier, where imagination meets construction and every idea has the potential to become something tangible.',
  'I’m a fashion designer exploring the relationship between concept, material, and form. My practice brings together creative experimentation and technical precision, from pattern making and garment construction to textile manipulation, digital design, and visual storytelling.',
  'I approach fashion as both a process of making and a way of communicating. Through silhouettes, textures, details, and movement, I explore how garments can carry meaning, challenge expectations, and express ideas beyond words.',
  'Balancing hands-on craftsmanship with digital exploration, I enjoy moving between disciplines, experimenting with techniques, and turning abstract concepts into considered design outcomes. Each project becomes an opportunity to investigate a new perspective, material, or possibility.',
  'This atelier is a collection of those explorations: ideas developed, techniques tested, and stories translated into form.',
  'Shall we take a look around?',
];

export const ayaDialogue: DialogueNode[] = [
  {
    id: 'start',
    // One sentence per line, so each types out at a comfortable length.
    lines: aboutText.flatMap((p) => p.split(/(?<=[.?!])\s+/)),
    choices: tour,
  },
  {
    id: 'menu',
    lines: ['Where would you like to go?'],
    choices: [...tour.slice(0, 4), { label: 'Hear the introduction again', next: 'start' }, { label: 'Not just yet', next: 'bye' }],
  },
  {
    id: 'contact',
    lines: [
      `I’d love to hear from you! Email me at ${contact.email}, or message me on WhatsApp.`,
      'My CV is on the About page too, if you’d like the whole story.',
    ],
    choices: [
      { label: 'Email Aya', action: { href: `mailto:${contact.email}` } },
      { label: 'Message on WhatsApp', action: { href: contact.whatsapp.href } },
      { label: 'Read the CV', action: { href: '/about' } },
      { label: 'Something else', next: 'menu' },
    ],
  },
  {
    id: 'bye',
    lines: ['Take your time. I’ll be here at my desk.'],
    choices: [
      { label: 'Bye, Aya', action: 'close' },
      { label: 'Actually, show me around', next: 'menu' },
    ],
  },
];

/** Open questions before launch. */
export const aboutQuestions = ['Social links (Instagram, LinkedIn), if she wants them on the site.'];
