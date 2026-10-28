import type { ResolvedImage, ResolvedMedia, ResolvedVideo } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { LightboxButton } from './Lightbox';
import { Video } from './Video';

export type GridItem = { media: ResolvedMedia; lightboxIndex?: number };

/**
 * A section's media. Films come first: landscape ones full width, vertical ones side by side.
 * Images and booklet pages follow in a masonry of columns, which keeps their natural proportions.
 */
export function MediaGrid({ items, horizontal = false }: { items: GridItem[]; horizontal?: boolean }) {
  const videos = items.map((i) => i.media).filter((m): m is ResolvedVideo => m.kind === 'video');
  const wide = videos.filter((v) => v.width >= v.height);
  const tall = videos.filter((v) => v.width < v.height);
  const stills = items.filter((i): i is { media: ResolvedImage; lightboxIndex: number } => i.media.kind !== 'video');
  // Few stills look lost in a 3-column masonry.
  const cols = Math.min(3, Math.max(1, stills.length)) as 1 | 2 | 3;
  const colClass = { 1: 'sm:columns-1 max-w-3xl', 2: 'sm:columns-2', 3: 'sm:columns-2 lg:columns-3' }[cols];

  return (
    <div className="space-y-6">
      {wide.map((v) => (
        <Video key={v.src} video={v} />
      ))}
      {tall.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tall.map((v) => (
            <Video key={v.src} video={v} />
          ))}
        </div>
      )}
      {stills.length > 0 && (
        <div
          role={horizontal ? 'region' : undefined}
          aria-label={horizontal ? 'Scroll horizontally to view all sketches' : undefined}
          tabIndex={horizontal ? 0 : undefined}
          className={horizontal ? 'flex w-max max-w-full gap-4 overflow-x-auto pb-3' : `columns-1 gap-4 ${colClass}`}
        >
          {stills.map(({ media, lightboxIndex }) => (
            <figure key={media.src} className={horizontal ? 'w-[min(82vw,28rem)] shrink-0' : 'mb-4 break-inside-avoid'}>
              <LightboxButton index={lightboxIndex} label={media.alt}>
                <Picture
                  image={media}
                  sizes={horizontal ? '(min-width: 640px) 28rem, 82vw' : cols === 1 ? '(min-width: 768px) 48rem, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'}
                  className="rounded-sm transition-opacity hover:opacity-90"
                />
              </LightboxButton>
              {(media.caption || horizontal) && <figcaption className="mt-2 text-sm text-ink-soft">{media.caption ?? media.alt}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
