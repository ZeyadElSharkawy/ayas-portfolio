import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects/index.ts';
import { largest, resolveMedia, type ResolvedImage } from '@/lib/media';
import { absolute } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absolute('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absolute('/work'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absolute('/about'), changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((p) => ({
      url: absolute(`/work/${p.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
      images: [absolute(largest(resolveMedia(p.slug, p.cover) as ResolvedImage))],
    })),
  ];
}
