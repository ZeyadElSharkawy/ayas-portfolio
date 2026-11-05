// Media for project sections: images, booklet pages and films, each with its garment note underneath.

import type { ResolvedMedia } from '@/lib/media';
import { Picture } from '@/components/media/Picture';

function Figure({ m, sizes }: { m: ResolvedMedia; sizes: string }) {
  const note = m.caption ?? (m.kind === 'video' ? m.title : m.alt);
  return (
    <figure>
      {m.kind === 'video' ? (
        <video
          controls
          playsInline
          preload="none"
          poster={m.poster}
          width={m.width}
          height={m.height}
          className="h-auto w-full bg-tint"
          aria-label={m.title}
        >
          <source src={m.src} type="video/mp4" />
        </video>
      ) : (
        <div className="bg-tint">
          <Picture img={m} sizes={sizes} />
        </div>
      )}
      <figcaption className="mt-2 max-w-prose text-[12px] leading-snug text-ink-2">{note}</figcaption>
    </figure>
  );
}

/** Portrait photos run three across, landscape pages and films two across; a single item spans the row. */
export function MediaGrid({ media }: { media: ResolvedMedia[] }) {
  if (!media.length) return null;
  const landscape = media.filter((m) => m.width > m.height).length > media.length / 2;
  const cols = media.length === 1 ? 'grid-cols-1' : landscape ? 'sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3';
  const sizes = media.length === 1 ? '(min-width: 1024px) 66vw, 100vw' : landscape ? '(min-width: 640px) 33vw, 100vw' : '(min-width: 1024px) 22vw, 50vw';
  return (
    <div className={`grid gap-x-3 gap-y-6 ${cols}`}>
      {media.map((m, i) => (
        <Figure key={`${m.src}-${i}`} m={m} sizes={sizes} />
      ))}
    </div>
  );
}
