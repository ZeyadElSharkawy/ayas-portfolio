'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ResolvedImage, ResolvedMedia, ResolvedVideo } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { STITCH } from '@/components/motif/StitchPage';

export interface WorkCard {
  slug: string;
  title: string;
  titleAr?: string;
  tagline: string;
  summary: string;
  palette: string[];
  cover: ResolvedImage;
  previews: ResolvedMedia[];
}

export function WorkGrid({ projects }: { projects: WorkCard[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug}>
          <WorkCardItem project={project} />
        </li>
      ))}
    </ul>
  );
}

function WorkCardItem({ project }: { project: WorkCard }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <article className={`group/card relative ${previewOpen ? 'preview-open' : ''}`}>
      <div className="relative overflow-hidden rounded-sm">
        <Link href={`/work/${project.slug}`} transitionTypes={STITCH} data-cursor="Explore work" className="block">
          <Picture
            image={project.cover}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="aspect-[4/5] transition-transform duration-700 ease-[var(--ease-thread)] group-hover/card:scale-[1.03] group-focus-within/card:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-2 rounded-[1px] border-[1.5px] border-dashed border-cream/0 transition-colors duration-500 group-hover/card:border-cream/80 group-focus-within/card:border-cream/80" />
        </Link>

        <button
          type="button"
          aria-expanded={previewOpen}
          aria-controls={`preview-${project.slug}`}
          onClick={() => setPreviewOpen((open) => !open)}
          className="label absolute bottom-3 right-3 z-10 rounded-full border border-cream/70 bg-ink/75 px-3 py-1.5 text-cream backdrop-blur transition-colors hover:bg-forest sm:hidden"
        >
          {previewOpen ? 'Close preview' : 'Preview'}
        </button>

        <div
          id={`preview-${project.slug}`}
          style={{ opacity: previewOpen ? 1 : undefined }}
          className={`absolute inset-0 z-[5] flex flex-col overflow-y-auto bg-cream/95 p-4 opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[var(--ease-thread)] group-hover/card:opacity-100 group-focus-within/card:opacity-100 ${
            previewOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label text-forest">A closer look</p>
              <h3 className="mt-1 font-display text-2xl leading-tight font-light">{project.title}</h3>
            </div>
            <div className="mt-1 flex shrink-0 gap-1" aria-hidden>
              {project.palette.slice(0, 5).map((hex) => (
                <span key={hex} className="h-1.5 w-4 rounded-full" style={{ background: hex }} />
              ))}
            </div>
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{project.summary}</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {project.previews.map((media) => (
              <div key={media.src} className="min-w-0 overflow-hidden rounded-sm bg-beige">
                {media.kind === 'video' ? <TeaserVideo video={media} /> : <Picture image={media} sizes="(min-width: 1024px) 10vw, 25vw" className="aspect-[4/3]" />}
              </div>
            ))}
          </div>
          <Link
            href={`/work/${project.slug}`}
            transitionTypes={STITCH}
            className="label mt-auto self-start rounded-full bg-forest px-4 py-2.5 text-cream transition-colors hover:bg-burgundy"
          >
            Explore more <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <Link href={`/work/${project.slug}`} transitionTypes={STITCH} data-cursor="Explore work" className="group/title block">
        <h2 className="mt-4 font-display text-2xl font-light transition-colors group-hover/title:text-forest">{project.title}</h2>
        {project.titleAr && (
          <p lang="ar" dir="rtl" className="mt-0.5 text-left text-ink-soft">
            {project.titleAr}
          </p>
        )}
        <p className="mt-1 text-sm text-ink-soft">{project.tagline}</p>
        <div className="mt-3 flex gap-1" aria-hidden>
          {project.palette.slice(0, 5).map((hex) => (
            <span key={hex} className="h-1.5 w-6 rounded-full" style={{ background: hex }} />
          ))}
        </div>
      </Link>
    </article>
  );
}

function TeaserVideo({ video }: { video: ResolvedVideo }) {
  return (
    <div className="relative aspect-[4/3]">
      <video
        controls
        playsInline
        preload="none"
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.title}
        className="h-full w-full object-cover"
        onDragStart={(event) => event.preventDefault()}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <p className="pointer-events-none absolute left-2 top-2 rounded-full bg-ink/75 px-2 py-1 text-xs text-cream">{video.title}</p>
    </div>
  );
}
