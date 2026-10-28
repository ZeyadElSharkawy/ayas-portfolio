// Turns a project's palette into page colours that stay readable on the beige background.

const BEIGE = '#f4e2cc';
const INK = '#2b1a1d';

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export interface ProjectTheme {
  /** Accent for labels and small text: the first palette colour that passes 4.5:1 on beige. */
  accent: string;
  /** Soft wash for the hero, mixed from the first palette colour. Ink text stays readable on it. */
  wash: string;
}

export function projectTheme(palette: string[]): ProjectTheme {
  const accent = palette.find((c) => contrast(c, BEIGE) >= 4.5) ?? INK;
  return {
    accent,
    wash: `color-mix(in oklab, ${palette[0]} 16%, ${BEIGE})`,
  };
}
