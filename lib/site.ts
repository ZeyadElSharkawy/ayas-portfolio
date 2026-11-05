// Site-wide identity for metadata and the sitemap. SITE_URL is set per deployment;
// localhost keeps dev and previews working until the domain is chosen.

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'Aya Hafez';
export const SITE_TITLE = 'Aya Hafez · Fashion Designer';
export const SITE_DESCRIPTION =
  'Portfolio of Aya Hafez, fashion designer based in Berlin: executed garments, digital fashion in CLO 3D and styling, rooted in Egyptian heritage. Open to internships.';
