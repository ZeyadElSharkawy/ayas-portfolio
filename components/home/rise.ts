import type { CSSProperties } from 'react';

/** A transform for content inside SeamParallax that rises `px` pixels as the seam comes in. Kept out of
 *  the client component so server components can call it. */
export const rise = (px: number): CSSProperties => ({ transform: `translate3d(0, calc((1 - var(--p, 1)) * ${px}px), 0)` });
