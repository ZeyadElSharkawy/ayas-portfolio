// Assets made by scripts/media/signature-assets.mjs for the signature interactions:
// crops of single renders out of deck pages, and traced line portraits with their tributes.

import generated from '../content/signature.generated.json' with { type: 'json' };
import type { ResolvedImage } from './media.ts';

type Crop = Omit<ResolvedImage, 'kind' | 'alt' | 'caption'>;

/** One embroidered portrait as stitch paths: points in a 0–1000 wide box, in sewing order. */
export interface PortraitTrace {
  aspect: number;
  paths: [number, number][][];
}

interface SignatureAssets {
  crops?: Record<string, Crop>;
  portraits?: Record<string, PortraitTrace & { tribute: Crop }>;
}

const assets = generated as unknown as Record<string, SignatureAssets>;

export function signatureCrop(slug: string, id: string, alt: string): ResolvedImage {
  const crop = assets[slug]?.crops?.[id];
  if (!crop) throw new Error(`No signature crop "${id}" in ${slug}. Run \`npm run media:signature\`.`);
  return { kind: 'image', ...crop, alt };
}

export function signaturePortrait(slug: string, id: string, tributeAlt: string) {
  const p = assets[slug]?.portraits?.[id];
  if (!p) throw new Error(`No traced portrait "${id}" in ${slug}. Run \`npm run media:signature\`.`);
  const { tribute, ...trace } = p;
  return { trace, tribute: { kind: 'image', ...tribute, alt: tributeAlt } satisfies ResolvedImage };
}
