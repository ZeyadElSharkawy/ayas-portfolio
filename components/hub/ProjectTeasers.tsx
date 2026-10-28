import type { ResolvedMedia } from '@/lib/media';
import { Picture } from '@/components/media/Picture';

export function ProjectTeasers({
  label,
  media,
  featured = false,
}: {
  label: string;
  media: ResolvedMedia[];
  featured?: boolean;
}) {
  if (media.length === 0) return null;

  if (featured) {
    const [main, ...rest] = media;
    return (
      <div role="group" aria-label={`${label} photo and video previews`} className="grid aspect-[16/9] max-h-[46vh] grid-cols-[minmax(0,1fr)_6rem] gap-2 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <PreviewMedia media={main} label={label} featured />
        <div className="grid min-h-0 grid-rows-2 gap-2">
          {rest.slice(0, 2).map((item) => (
            <PreviewMedia key={item.src} media={item} label={label} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div role="group" aria-label={`${label} preview media`} className="grid grid-cols-3 gap-1.5">
      {media.map((item) => (
        <PreviewMedia key={item.src} media={item} label={label} />
      ))}
    </div>
  );
}

function PreviewMedia({ media, label, featured = false }: { media: ResolvedMedia; label: string; featured?: boolean }) {
  return (
    <figure className="relative min-h-0 min-w-0 overflow-hidden rounded-sm bg-ink">
      {media.kind === 'video' ? (
        <video
          controls
          playsInline
          preload="none"
          poster={media.poster}
          width={media.width}
          height={media.height}
          aria-label={`${label}: ${media.title}`}
          className="h-full w-full object-cover"
          onDragStart={(event) => event.preventDefault()}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <Picture
          image={media}
          sizes={featured ? '(min-width: 1024px) 60vw, 90vw' : '(min-width: 640px) 12rem, 30vw'}
          className="h-full w-full"
        />
      )}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-ink/70 px-2 py-1 text-xs text-cream">
        {media.kind === 'video' ? media.title : media.alt}
      </figcaption>
    </figure>
  );
}
