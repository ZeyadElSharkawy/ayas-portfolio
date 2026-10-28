import type { ResolvedImage } from '@/lib/media';
import { srcSet, largest } from '@/lib/media-urls';

// Responsive <picture> for pipeline output. The pipeline already made every size and format,
// so this skips next/image and serves the files directly, with the blur placeholder as background.

export function Picture({
  image,
  sizes = '100vw',
  className = '',
  priority = false,
  fit = 'cover',
  placeholder = true,
  draggable = false,
}: {
  image: ResolvedImage;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  draggable?: boolean;
  /** Blur + dominant colour behind the image while it loads. Turn off where it would letterbox. */
  placeholder?: boolean;
}) {
  const fallback = image.formats.includes('webp') ? 'webp' : image.formats[0];
  return (
    <picture className={`block overflow-hidden ${className}`}>
      {image.formats
        .filter((f) => f !== fallback)
        .map((f) => (
          <source key={f} type={`image/${f}`} srcSet={srcSet(image, f)} sizes={sizes} />
        ))}
      <img
        src={largest(image, fallback)}
        srcSet={srcSet(image, fallback)}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        draggable={draggable}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="h-full w-full"
        style={{
          objectFit: fit,
          ...(placeholder && {
            backgroundImage: `url(${image.blur})`,
            backgroundSize: 'cover',
            backgroundColor: image.color,
          }),
        }}
      />
    </picture>
  );
}
