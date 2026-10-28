// Drawing for the needle's running-stitch thread (see components/cursor/NeedleCursor.tsx).
// Kept free of React/DOM so it can be rendered and checked outside the browser.

export type ThreadPoint = { x: number; y: number; t: number; d: number };

export const THREAD_TRAIL_MS = 650;
export const THREAD_STITCH = [7, 5]; // dash, gap (px)
export const THREAD_RGB = '158, 79, 46'; // --color-thread (rust)

type Ctx = Pick<
  CanvasRenderingContext2D,
  'beginPath' | 'moveTo' | 'lineTo' | 'stroke' | 'setLineDash' | 'lineCap' | 'lineWidth' | 'strokeStyle' | 'lineDashOffset'
>;

/** Drops points older than the trail. */
export function pruneThread(points: ThreadPoint[], now: number) {
  while (points.length && now - points[0].t > THREAD_TRAIL_MS) points.shift();
}

/**
 * Draws the trail as dashed segments that fade with age. Each segment's dash phase is the distance
 * travelled at its start, so stitches stay anchored to the path instead of crawling along it.
 */
export function drawThread(ctx: Ctx, points: ThreadPoint[], now: number) {
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.6;
  ctx.setLineDash(THREAD_STITCH);
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const life = 1 - (now - a.t) / THREAD_TRAIL_MS;
    if (life <= 0) continue;
    ctx.strokeStyle = `rgba(${THREAD_RGB}, ${(life * 0.9).toFixed(3)})`;
    ctx.lineDashOffset = a.d;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}
