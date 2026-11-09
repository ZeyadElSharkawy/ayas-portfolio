// Each project's page colours, taken from its palette. Setting these variables recolours the whole
// site, header and footer included, because every colour utility reads them (see app/globals.css).
// No manifest import, so client components can use this.

const base: Record<string, { paper: string; ink: string; accent: string }> = {
  // The home page while its hero is on screen: the aubergine of the hero, from the stage light in her portrait.
  home: { paper: '#200E27', ink: '#F1E8F4', accent: '#D6C3EA' },
  'cultural-echoes': { paper: '#1F5B45', ink: '#F6E3CF', accent: '#F4B860' },
  'carina-arabesque': { paper: '#4E5B3A', ink: '#F2F0B8', accent: '#F6C79B' },
  'in-honor-of-our-women': { paper: '#F4EFE6', ink: '#1A1A1A', accent: '#B00F60' },
  glacier: { paper: '#0F2A5C', ink: '#E8EEF8', accent: '#7FD3E6' },
  'into-her-skin': { paper: '#9D99CD', ink: '#14122B', accent: '#1F2A78' },
  arabia: { paper: '#7A1020', ink: '#EFE6D2', accent: '#E0C088' },
  'identity-breakdown': { paper: '#8C0F1E', ink: '#F7ECEE', accent: '#FBD3E0' },
  'clue-styling': { paper: '#E9DCC9', ink: '#2B2B2B', accent: '#6E5238' },
};

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** `share` of `a` over `b`, as a hex colour. */
function mix(a: string, b: string, share: number) {
  const [x, y] = [channels(a), channels(b)];
  return `#${x.map((c, i) => Math.round(c * share + y[i] * (1 - share)).toString(16).padStart(2, '0')).join('')}`;
}

export function projectColors(slug: string): Record<string, string> {
  const c = base[slug];
  if (!c) throw new Error(`No page colours for project "${slug}"`);
  return {
    '--color-paper': c.paper,
    '--color-ink': c.ink,
    '--color-ink-2': mix(c.ink, c.paper, 0.86),
    '--color-ink-3': mix(c.ink, c.paper, 0.74),
    '--color-line': mix(c.ink, c.paper, 0.2),
    '--color-tint': mix(c.ink, c.paper, 0.09),
    '--color-accent': c.accent,
  };
}

/** The same colours as a stylesheet, so server-rendered pages arrive already coloured. */
export const projectColorsCss = (slug: string) =>
  `:root{${Object.entries(projectColors(slug)).map(([k, v]) => `${k}:${v}`).join(';')}}`;
