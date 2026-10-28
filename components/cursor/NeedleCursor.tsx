'use client';

// The site's cursor: a needle that leaves a running-stitch thread behind it.
// Only on fine pointers without reduced motion; everyone else keeps the system cursor.
//
// The stitches are anchored to the path (dash phase = distance travelled), so they look
// sewn in place rather than crawling along the line.

import { useEffect, useRef } from 'react';
import { getCursorLabel, subscribeCursorLabel } from '@/lib/cursor';
import { drawThread, pruneThread, type ThreadPoint } from '@/lib/thread';

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], label, select, summary';

export function NeedleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const needle = needleRef.current;
    const labelEl = labelRef.current;
    if (!fine || reduced || !canvas || !needle || !labelEl) return;

    const ctx = canvas.getContext('2d')!;
    document.documentElement.classList.add('has-needle');

    const points: ThreadPoint[] = [];
    let distance = 0;
    let x = -100;
    let y = -100;
    let angle = -135; // idle: pointing up-left like a system cursor
    let targetAngle = angle;
    let lastMove = 0;
    let visible = false;
    let hoverLabel: string | null = null;
    let interactive = false;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const updateLabel = () => {
      const text = getCursorLabel() ?? hoverLabel;
      labelEl.textContent = text ?? '';
      labelEl.style.opacity = text ? '1' : '0';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now();
      const last = points[points.length - 1];
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      if (!last || Math.hypot(dx, dy) > 2) {
        if (last) distance += Math.hypot(e.clientX - last.x, e.clientY - last.y);
        points.push({ x: e.clientX, y: e.clientY, t: now, d: distance });
        if (Math.hypot(dx, dy) > 3) targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        lastMove = now;
      }
      x = e.clientX;
      y = e.clientY;
      visible = true;

      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      interactive = !!el;
      hoverLabel = el?.getAttribute('data-cursor') ?? null;
      updateLabel();
    };

    const onLeave = () => {
      visible = false;
      points.length = 0;
    };

    const frame = (now: number) => {
      pruneThread(points, now);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      drawThread(ctx, points, now);

      // Settle back to the idle angle once the pointer rests.
      if (now - lastMove > 450) targetAngle = -135;
      const delta = ((targetAngle - angle + 540) % 360) - 180;
      angle += delta * 0.18;

      const scale = interactive ? 1.25 : 1;
      needle.style.opacity = visible ? '1' : '0';
      needle.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${scale})`;
      labelEl.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const unsubscribe = subscribeCursorLabel(updateLabel);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', resize);
      document.documentElement.classList.remove('has-needle');
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={needleRef} className="absolute top-0 left-0 opacity-0" style={{ transformOrigin: '0 0' }}>
        {/* Tip at the local origin, pointing along +x; the eye sits at the far end. */}
        <svg width="40" height="10" viewBox="-38 -5 40 10" className="block -translate-x-[38px] -translate-y-[5px]" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="needle-steel" x1="0" y1="-2" x2="0" y2="2" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e9e6e1" />
              <stop offset="0.5" stopColor="#9a9590" />
              <stop offset="1" stopColor="#4d4945" />
            </linearGradient>
          </defs>
          <path d="M0 0 L-26 -1.7 L-35 -1.7 Q-37.5 -1.7 -37.5 0 Q-37.5 1.7 -35 1.7 L-26 1.7 Z" fill="url(#needle-steel)" />
          <ellipse cx="-33" cy="0" rx="2.4" ry="0.7" fill="#f4e2cc" />
        </svg>
      </div>
      <span
        ref={labelRef}
        className="label absolute top-0 left-0 rounded-full bg-ink px-2.5 py-1 whitespace-nowrap text-cream opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
