'use client';

// In Honor of Our Women signature: the installation's banner hangs from its rod and sways. Each
// panel starts as a chalk tracing; hover it (or scroll to it on a phone) and the portrait is
// machine-embroidered line by line, along the paths traced from Aya's own drawing, then her
// handwritten tribute appears beside it.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ResolvedImage } from '@/lib/media';
import type { PortraitTrace } from '@/lib/signature-assets';
import { Picture } from '@/components/media/Picture';
import { useMediaQuery } from '@/lib/use-media-query';
import { useInView } from '@/lib/use-scroll-progress';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { startSewing } from '@/lib/sound';

const CLOTH = '#F4EFE6';
const PINK = '#E0157A';
const PINK_TEXT = '#a50f5a';
const INK = '#1A1A1A';
const WALL = '#E9E2DA';

export type HonoredWoman = { id: string; name: string; role: string; trace: PortraitTrace; tribute: ResolvedImage };

const WEAVE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.3 0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\"), repeating-linear-gradient(0deg, rgb(120 100 80 / 0.05) 0 1px, transparent 1px 4px)";

export function InHonorSignature({ women }: { women: HonoredWoman[] }) {
  const reduced = useReducedMotion();
  const [all, setAll] = useState(false);

  return (
    <section aria-labelledby="honor-sig-title" className="overflow-hidden py-16 sm:py-24" style={{ background: WALL, color: INK }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label" style={{ color: PINK_TEXT }}>
          In Honor of Our Women · <span lang="ar" dir="rtl" className="font-arabic normal-case">تكريماً لنسائنا</span>
        </p>
        <h2 id="honor-sig-title" className="mt-2 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
          Stitched in their honour
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed" style={{ color: 'rgb(26 26 26 / 0.8)' }}>
          Four women, each drawn in a single pink line and machine-embroidered onto dakka cloth beside a tribute in Aya’s handwriting.{' '}
          <span className="hidden [@media(hover:hover)]:inline">Hover a portrait to embroider it.</span>
        </p>
        <button type="button" onClick={() => setAll(true)} disabled={all} className="label mt-5 rounded-full px-4 py-2 disabled:opacity-40" style={{ background: PINK, color: '#fff' }}>
          {all ? 'All four stitched' : 'Stitch all four'}
        </button>
      </div>

      {/* The banner, hung from its rod */}
      <div className="mx-auto mt-14 max-w-[46rem] px-4 sm:px-8" style={{ perspective: 1800 }}>
        <div className="relative mx-auto h-3 w-[calc(100%+2rem)] -translate-x-4 rounded-full shadow-md" style={{ background: 'linear-gradient(180deg, #a07a55, #5d4128)' }} aria-hidden>
          <span className="absolute -left-2 -top-1 h-5 w-5 rounded-full" style={{ background: '#5d4128' }} />
          <span className="absolute -right-2 -top-1 h-5 w-5 rounded-full" style={{ background: '#5d4128' }} />
        </div>
        <div
          className="relative"
          style={{
            transformOrigin: '50% 0',
            animation: reduced ? undefined : 'banner-sway 11s ease-in-out infinite',
            filter: 'drop-shadow(0 24px 30px rgb(60 30 30 / 0.22))',
          }}
        >
          {/* cords from the rod */}
          <svg aria-hidden className="absolute -top-3 left-0 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M12 0 L8 10 M88 0 L92 10" stroke={PINK} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="mt-3 p-[clamp(14px,3.4vw,30px)]" style={{ background: PINK }}>
            <div style={{ backgroundColor: CLOTH, backgroundImage: WEAVE }}>
              <header className="px-6 pb-4 pt-8 text-center sm:pt-10">
                <p lang="ar" dir="rtl" className="font-arabic text-4xl font-semibold sm:text-5xl" style={{ color: PINK }}>
                  تكريماً لنسائنا
                </p>
                <p className="label mt-2" style={{ color: PINK }}>
                  In honor of our women
                </p>
              </header>
              {women.map((w, k) => (
                <Panel key={w.id} woman={w} mirrored={k % 2 === 1} force={all} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ woman, mirrored, force }: { woman: HonoredWoman; mirrored: boolean; force: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6);
  const [start, setStart] = useState(false);
  const [done, setDone] = useState(false);
  const noHover = useMediaQuery('(hover: none)');
  // Phones have no hover: the embroidery starts when the panel scrolls into view.
  const go = start || force || (noHover && inView);

  return (
    <div
      ref={ref}
      className="border-t border-dashed px-4 py-6 sm:px-6"
      style={{ borderColor: 'rgb(26 26 26 / 0.18)' }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setStart(true)}
    >
      <div className={`grid items-center gap-4 sm:gap-6 ${mirrored ? 'sm:grid-cols-[3fr_2fr] sm:[&>*:first-child]:order-2' : 'sm:grid-cols-[2fr_3fr]'}`}>
        <button
          type="button"
          onClick={() => setStart(true)}
          onFocus={() => setStart(true)}
          aria-label={`Embroider the portrait of ${woman.name}`}
          data-cursor="Stitch"
          className="mx-auto block w-full max-w-[14rem] sm:max-w-none"
        >
          <StitchedPortrait trace={woman.trace} name={woman.name} play={go} onDone={() => setDone(true)} />
        </button>
        <div className="transition-[opacity,transform] duration-1000" style={{ opacity: done ? 1 : 0, transform: done ? 'none' : 'translateY(10px)' }}>
          <Picture image={woman.tribute} sizes="(min-width: 640px) 20rem, 80vw" placeholder={false} className="w-full mix-blend-multiply" />
        </div>
      </div>
      <p className="mt-3 text-center text-sm" style={{ color: PINK_TEXT }} aria-live="polite">
        <span className="font-semibold">{woman.name}</span> · {woman.role}
        {done ? '' : <span className="sr-only"> (not yet embroidered)</span>}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- the embroidery

const DURATION = 4200;

function StitchedPortrait({ trace, name, play, onDone }: { trace: PortraitTrace; name: string; play: boolean; onDone: () => void }) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const sewn = useRef(0); // length stitched so far, in trace units
  const started = useRef(false);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  // Path lengths, so the needle can travel at an even speed and jump between lines.
  const { lengths, total } = useMemo(() => {
    const lengths = trace.paths.map((p) => {
      const acc = [0];
      for (let k = 1; k < p.length; k++) acc.push(acc[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
      return acc;
    });
    return { lengths, total: lengths.reduce((s, acc) => s + acc.at(-1)!, 0) };
  }, [trace]);

  /** Draws the stitched line between two distances along the whole trace; returns the needle's point. */
  const sew = (from: number, to: number) => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return null;
    const s = c.width / 1000;
    const dpr = c.width / c.clientWidth || 1;
    let base = 0;
    let tip: [number, number] | null = null;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    trace.paths.forEach((p, k) => {
      const acc = lengths[k];
      const len = acc.at(-1)!;
      const a = from - base;
      const b = to - base;
      base += len;
      if (b <= 0 || a >= len) return;
      const lo = Math.max(0, a);
      const hi = Math.min(len, b);
      const pts: [number, number][] = [];
      for (let i = 0; i < p.length - 1; i++) {
        if (acc[i + 1] < lo || acc[i] > hi) continue;
        const seg = acc[i + 1] - acc[i] || 1;
        const t0 = Math.max(0, (lo - acc[i]) / seg);
        const t1 = Math.min(1, (hi - acc[i]) / seg);
        const at = (t: number): [number, number] => [(p[i][0] + (p[i + 1][0] - p[i][0]) * t) * s, (p[i][1] + (p[i + 1][1] - p[i][1]) * t) * s];
        if (!pts.length) pts.push(at(t0));
        pts.push(at(t1));
      }
      if (pts.length < 2) return;
      ctx.lineDashOffset = lo * s;
      for (const [colour, dx, w] of [
        ['rgb(110 0 50 / 0.35)', 0.7 * dpr, 2.3 * dpr],
        [PINK, 0, 1.9 * dpr],
      ] as const) {
        ctx.setLineDash([4.2 * dpr, 1.4 * dpr]);
        ctx.strokeStyle = colour;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(pts[0][0] + dx, pts[0][1] + dx);
        for (const q of pts.slice(1)) ctx.lineTo(q[0] + dx, q[1] + dx);
        ctx.stroke();
      }
      tip = pts.at(-1)!;
    });
    return tip as [number, number] | null;
  };

  /** Clears to the chalk tracing, then re-sews whatever was already stitched. */
  const repaint = () => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const s = c.width / 1000;
    const dpr = c.width / c.clientWidth || 1;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setLineDash([1.2 * dpr, 3.4 * dpr]);
    ctx.lineDashOffset = 0;
    ctx.strokeStyle = 'rgb(60 100 160 / 0.4)';
    ctx.lineWidth = 1.1 * dpr;
    ctx.beginPath();
    for (const p of trace.paths) {
      ctx.moveTo(p[0][0] * s, p[0][1] * s);
      for (const q of p.slice(1)) ctx.lineTo(q[0] * s, q[1] * s);
    }
    ctx.stroke();
    if (sewn.current > 0) sew(0, sewn.current);
  };

  useEffect(() => {
    const el = box.current;
    const c = canvas.current;
    if (!el || !c) return;
    let width = 0;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (!w || w === width) return;
      width = w;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(w * dpr);
      c.height = Math.round((w / trace.aspect) * dpr);
      repaint();
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- repaint reads refs only
  }, [trace]);

  useEffect(() => {
    if (!play || started.current) return;
    started.current = true;
    if (reduced) {
      sewn.current = total;
      repaint();
      doneRef.current();
      return;
    }
    let raf = 0;
    const stopSewing = startSewing();
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      const next = total * t;
      const tip = sew(sewn.current, next);
      sewn.current = next;
      const c = canvas.current;
      if (tip && needle.current && c) {
        const k = c.clientWidth / c.width;
        needle.current.style.opacity = '1';
        needle.current.style.transform = `translate(${tip[0] * k}px, ${tip[1] * k}px)`;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        if (needle.current) needle.current.style.opacity = '0';
        stopSewing();
        doneRef.current();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopSewing();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sew/repaint read refs only
  }, [play, reduced]);

  return (
    <div ref={box} className="relative w-full" style={{ aspectRatio: trace.aspect }}>
      <canvas ref={canvas} role="img" aria-label={`Line portrait of ${name}, embroidered in pink thread`} className="absolute inset-0 h-full w-full" />
      {/* The needle, its point on the stitch being sewn */}
      <span ref={needle} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300">
        <svg width="40" height="40" viewBox="0 0 40 40" className="-translate-y-full animate-[needle-bob_140ms_linear_infinite]" style={{ overflow: 'visible' }}>
          <path d="M0 40 L30 6 L33 4 L35 6 L33 9 Z" fill="url(#honor-steel)" stroke="#6b6f78" strokeWidth="0.6" />
          <ellipse cx="31.2" cy="7.2" rx="1.1" ry="2.2" transform="rotate(42 31.2 7.2)" fill={CLOTH} />
          <defs>
            <linearGradient id="honor-steel" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#8a8f99" />
              <stop offset="0.5" stopColor="#eef0f3" />
              <stop offset="1" stopColor="#9aa0a8" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </div>
  );
}
