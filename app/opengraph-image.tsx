import { siteCard } from '@/lib/og-site';
import { OG_SIZE, OG_TYPE } from '@/lib/og';

export const alt = 'Aya Hafez, fashion designer: her atelier of executed garments, digital fashion and styling';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return siteCard({
    kicker: 'The atelier',
    heading: 'Aya Hafez',
    sub: 'Executed garments, digital fashion and styling, rooted in Cairo.',
    slugs: ['cultural-echoes', 'glacier', 'carina-arabesque', 'into-her-skin'],
  });
}
