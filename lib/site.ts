// Site-wide identity for metadata, the sitemap and structured data.
// SITE_URL is set per deployment (see PLAN.md §16); localhost keeps dev and previews working.

import type { Metadata } from 'next';
import type { Project } from '../content/types.ts';
import { contact, education } from '../content/cv.ts';
import { categories } from '../content/categories.ts';

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'Aya Hafez';
export const SITE_TITLE = 'Aya Hafez · Fashion Designer';
export const SITE_DESCRIPTION =
  'The atelier of Aya Hafez, fashion designer in Berlin and Cairo: executed garments, digital fashion in CLO3D and styling, rooted in Egyptian heritage.';

export const absolute = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Open Graph fields every page shares. A page's own `openGraph` replaces its parent's wholesale,
 * so pages spread this in rather than relying on the layout's.
 */
export const openGraphBase = {
  siteName: SITE_NAME,
  locale: 'en_GB',
  type: 'website',
} satisfies Metadata['openGraph'];

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#aya`,
  name: 'Aya Hafez',
  alternateName: 'آية حافظ',
  jobTitle: 'Fashion Designer',
  url: SITE_URL,
  email: `mailto:${contact.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Berlin', addressCountry: 'DE' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education[0].place },
  knowsAbout: ['Fashion design', 'Pattern making', 'Garment construction', 'Machine embroidery', 'CLO3D', 'Fashion styling'],
};

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [person, { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: SITE_TITLE, author: { '@id': person['@id'] } }],
  };
}

export function projectJsonLd(project: Project, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    ...(project.titleAr && { alternateName: project.titleAr }),
    headline: project.tagline,
    description: project.summary,
    url: absolute(`/work/${project.slug}`),
    image: absolute(image),
    genre: categories.find((c) => c.id === project.category)?.title,
    ...(project.year && { dateCreated: String(project.year) }),
    creator: person,
  };
}

/** Serialises JSON-LD for a <script> tag; `<` is escaped so the payload can't close the tag. */
export const jsonLdHtml = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
