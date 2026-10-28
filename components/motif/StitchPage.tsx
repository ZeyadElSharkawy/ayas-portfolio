import { ViewTransition, type ReactNode } from 'react';

/** Transition type for navigations that should "stitch" between pages. Pass to Link/router.push. */
export const STITCH = ['stitch'];

/**
 * Wraps a page so navigations tagged with STITCH close it into a seam and open the next page out
 * of it (CSS in app/globals.css). Other navigations (browser back/forward, refreshes) don't animate.
 * Goes in each page, not the layout: layouts persist, so enter/exit would never fire there.
 */
export function StitchPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter={{ stitch: 'stitch', default: 'none' }} exit={{ stitch: 'stitch', default: 'none' }} default="none">
      {/* Full-screen pages (the hub) pass `fixed inset-0` so the snapshot covers the viewport. */}
      <div className={className}>{children}</div>
    </ViewTransition>
  );
}
