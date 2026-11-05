// A pipeline image as <picture>: AVIF/WebP sources at every processed width, a flat colour while it loads.
// No manifest import, so client components can render it too.

import { srcSet } from '@/lib/media-urls';

export interface PictureData {
  src: string;
  widths: number[];
  formats: string[];
  width: number;
  height: number;
  color?: string;
  alt: string;
}

interface Props {
  img: PictureData;
  sizes: string;
  className?: string;
  /** Fill the parent box (object-cover) instead of keeping the image's own aspect ratio. */
  fill?: boolean;
  priority?: boolean;
}

export function Picture({ img, sizes, className = '', fill, priority }: Props) {
  const formats = img.formats.length ? img.formats : ['webp'];
  const fallback = formats[formats.length - 1];
  return (
    <picture className={fill ? 'contents' : undefined}>
      {formats.slice(0, -1).map((f) => (
        <source key={f} type={`image/${f}`} srcSet={srcSet(img, f)} sizes={sizes} />
      ))}
      <img
        src={`${img.src}-${img.widths[0]}.${fallback}`}
        srcSet={srcSet(img, fallback)}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={img.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={{ backgroundColor: img.color }}
        className={`${fill ? 'h-full w-full object-cover' : 'h-auto w-full'} ${className}`}
      />
    </picture>
  );
}
