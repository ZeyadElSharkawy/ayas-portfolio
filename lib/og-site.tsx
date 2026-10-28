// The site-level share cards (home, Index, About): a fanned stack of project covers.

import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { getProject } from '../content/projects/index.ts';
import { largest, resolveMedia, type ResolvedImage } from './media.ts';
import { OG_SIZE, ogFonts, ogPhoto, SiteCard } from './og.tsx';

export async function siteCard({ kicker, heading, sub, slugs }: { kicker: string; heading: ReactNode; sub: string; slugs: string[] }) {
  const photos = await Promise.all(
    slugs.map((slug) => {
      const project = getProject(slug)!;
      return ogPhoto(largest(resolveMedia(slug, project.cover) as ResolvedImage), 460, 660);
    }),
  );
  return new ImageResponse(<SiteCard kicker={kicker} heading={heading} sub={sub} photos={photos} />, { ...OG_SIZE, fonts: await ogFonts() });
}
