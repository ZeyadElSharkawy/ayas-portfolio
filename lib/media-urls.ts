// URL helpers for pipeline images. Kept apart from lib/media.ts so client components can use them
// without bundling the whole media manifest.

type Sized = { src: string; widths: number[] };

/** `srcset` for one format, e.g. srcSet(img, 'avif'). */
export function srcSet(img: Sized, format: string) {
  return img.widths.map((w) => `${img.src}-${w}.${format} ${w}w`).join(', ');
}

/** Largest available file, for places that need a single URL (3D textures, OG images). */
export function largest(img: Sized, format = 'webp') {
  return `${img.src}-${Math.max(...img.widths)}.${format}`;
}
