import { siteCard } from '@/lib/og-site';
import { OG_SIZE, OG_TYPE } from '@/lib/og';

export const alt = 'Aya’s work: fashion design, digital fashion and styling projects';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return siteCard({
    kicker: 'Portfolio',
    heading: "Aya's work",
    sub: 'Selected works, digital fashion in CLO3D, and fashion styling.',
    slugs: ['in-honor-of-our-women', 'identity-breakdown', 'clue-styling', 'arabia'],
  });
}
