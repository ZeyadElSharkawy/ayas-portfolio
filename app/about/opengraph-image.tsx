import { siteCard } from '@/lib/og-site';
import { OG_SIZE, OG_TYPE } from '@/lib/og';

export const alt = 'About Aya Hafez, fashion designer in Berlin and Cairo';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return siteCard({
    kicker: 'About the designer',
    heading: 'Meet Aya',
    sub: 'Pattern making, embroidery and CLO3D, from Cairo to Berlin.',
    slugs: ['glacier', 'cultural-echoes', 'into-her-skin', 'carina-arabesque'],
  });
}
