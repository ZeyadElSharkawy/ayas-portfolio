import type { ResolvedVideo } from '@/lib/media';

const duration = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/** Inline film with its poster; nothing downloads until play is pressed. */
export function Video({ video }: { video: ResolvedVideo }) {
  return (
    <figure>
      <video
        controls
        playsInline
        preload="none"
        poster={video.poster}
        width={video.width}
        height={video.height}
        className="h-auto w-full rounded-sm bg-ink"
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
        data-cursor="Play film"
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <figcaption className="mt-2 flex justify-between gap-4 text-sm text-ink-soft">
        <span>{video.title}</span>
        <span className="tabular-nums">{duration(video.duration)}</span>
      </figcaption>
    </figure>
  );
}
