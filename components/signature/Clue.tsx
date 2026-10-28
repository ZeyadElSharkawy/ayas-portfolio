'use client';

// Clue signature: her edit laid out on a light table, with a loupe to look at the styling up close,
// and a phone you can tilt and turn over, showing the same shoot live on clue.eg.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cue } from '@/lib/sound';

const SAND = '#E9DCC9';
const STONE = '#C9B79C';
const INK = '#2B2B2B';
const PAPER = '#F7F3EE';
const BROWN = '#8A6A4F';
const PENCIL = '#c2412d';

export type LoupePhoto = ResolvedImage & { zoom: string };
export type StoreScreen = ResolvedImage & { label: string };

export function ClueSignature({ photos, screens }: { photos: LoupePhoto[]; screens: StoreScreen[] }) {
  return (
    <section aria-labelledby="clue-sig-title" className="relative overflow-hidden py-16 sm:py-24" style={{ background: SAND, color: INK }}>
      {/* Hard afternoon sun through a window, as on her shoot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(115deg, transparent 0 140px, rgb(90 60 30 / 0.07) 140px 230px)',
          maskImage: 'linear-gradient(180deg, black, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label" style={{ color: BROWN }}>
          Clue · Styling for Clue Wear
        </p>
        <h2 id="clue-sig-title" className="mt-2 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
          From the shoot to the storefront
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed" style={{ color: 'rgb(43 43 43 / 0.8)' }}>
          Her edit on the light table: look closer with the loupe. Then pick up the phone, where the same photos run the clue.eg store.
        </p>
      </div>

      <LightTable photos={photos} />
      <StorePhone screens={screens} />
    </section>
  );
}

// ---------------------------------------------------------------- light table and loupe

const ZOOM = 2.6;

function LightTable({ photos }: { photos: LoupePhoto[] }) {
  const [i, setI] = useState(0);
  const [loupe, setLoupe] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  // Touch: tap to put the loupe down, drag to move it, tap again to lift it.
  const [pinned, setPinned] = useState(false);
  const press = useRef<{ x: number; y: number; wasPinned: boolean } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(88);
  const photo = photos[i];

  useEffect(() => {
    const fit = () => setRadius(window.innerWidth < 640 ? 64 : 88);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const at = (e: ReactPointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: Math.min(r.width, Math.max(0, e.clientX - r.left)), y: Math.min(r.height, Math.max(0, e.clientY - r.top)), w: r.width, h: r.height };
  };
  const go = (k: number) => {
    cue('shutter');
    setI((k + photos.length) % photos.length);
    if (!pinned) setLoupe(null);
  };

  return (
    <div className="relative mx-auto mt-12 grid max-w-7xl items-start gap-8 px-4 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <figure className="mx-auto w-full max-w-[30rem]">
        <div
          ref={stage}
          tabIndex={0}
          role="group"
          aria-roledescription="photo viewer"
          aria-label={`Photo ${i + 1} of ${photos.length}. Left and right arrow keys change the photo.`}
          data-cursor="Loupe"
          className="relative aspect-[2/3] w-full select-none overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgb(60_40_20/0.55)] outline-offset-4"
          style={{ touchAction: pinned ? 'none' : 'pan-y', background: STONE }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(i + 1);
            else if (e.key === 'ArrowLeft') go(i - 1);
            else return;
            e.preventDefault();
          }}
          onPointerMove={(e) => {
            if (e.pointerType === 'mouse') setLoupe(at(e));
            else if (pinned && press.current) setLoupe(at(e));
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setLoupe(null);
          }}
          onPointerDown={(e) => {
            if (e.pointerType === 'mouse') return;
            const p = at(e);
            press.current = { ...p, wasPinned: pinned };
            if (!pinned) {
              setPinned(true);
              setLoupe(p);
            }
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            if (e.pointerType === 'mouse' || !press.current) return;
            const p = at(e);
            const moved = Math.hypot(p.x - press.current.x, p.y - press.current.y);
            if (press.current.wasPinned && moved < 8) {
              setPinned(false);
              setLoupe(null);
            }
            press.current = null;
          }}
        >
          <Picture key={photo.src} image={photo} sizes="(min-width: 1024px) 30rem, 92vw" className="h-full w-full animate-[fade-in_350ms_ease]" />
          {loupe && (
            <div
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                left: loupe.x - radius,
                top: loupe.y - radius,
                width: radius * 2,
                height: radius * 2,
                backgroundImage: `url(${photo.zoom})`,
                backgroundColor: photo.color,
                backgroundSize: `${loupe.w * ZOOM}px ${loupe.h * ZOOM}px`,
                backgroundPosition: `${radius - loupe.x * ZOOM}px ${radius - loupe.y * ZOOM}px`,
                backgroundRepeat: 'no-repeat',
                boxShadow: `0 0 0 3px ${INK}, 0 0 0 7px ${STONE}, 0 0 0 8.5px ${INK}, 0 18px 40px rgb(0 0 0 / 0.4), inset 0 0 22px rgb(0 0 0 / 0.35)`,
              }}
            >
              {/* glass glare */}
              <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 32% 26%, rgb(255 255 255 / 0.35), transparent 38%)' }} />
            </div>
          )}
        </div>
        <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm" aria-live="polite">
          <span>{photo.alt}</span>
          <span className="label shrink-0 tabular-nums" style={{ color: BROWN }}>
            {String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
        </figcaption>
        <p className="mt-1 text-xs" style={{ color: 'rgb(43 43 43 / 0.65)' }}>
          <span className="hidden [@media(hover:hover)]:inline">Move over the photo to look through the loupe.</span>
          <span className="[@media(hover:hover)]:hidden">Tap the photo for the loupe, drag to move it, tap again to lift it.</span>
        </p>
      </figure>

      {/* The contact sheet, marked up in grease pencil */}
      <div>
        <h3 className="label" style={{ color: BROWN }}>
          Contact sheet · {photos.length} frames
        </h3>
        <ul className="mt-4 grid grid-cols-4 gap-2 rounded-sm p-3 sm:grid-cols-4 sm:gap-3 sm:p-4" style={{ background: PAPER, boxShadow: '0 1px 0 rgb(0 0 0 / 0.06), 0 20px 40px -28px rgb(60 40 20 / 0.6)' }}>
          {photos.map((p, k) => (
            <li key={p.src} className="relative">
              <button
                type="button"
                onClick={() => go(k)}
                aria-label={`Show frame ${k + 1}: ${p.alt}`}
                aria-current={k === i ? 'true' : undefined}
                className="group relative block w-full"
              >
                <Picture image={p} sizes="(min-width: 1024px) 9rem, 22vw" className={`aspect-[2/3] w-full transition-[filter,opacity] duration-300 ${k === i ? '' : 'opacity-80 grayscale-[0.6] group-hover:opacity-100 group-hover:grayscale-0'}`} />
                <span className="mt-1 block text-left font-mono text-[0.6rem] tracking-wider" style={{ color: BROWN }}>
                  {String(k + 1).padStart(2, '0')}A
                </span>
              </button>
              {k === i && (
                <svg aria-hidden viewBox="0 0 100 150" preserveAspectRatio="none" className="pointer-events-none absolute -inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%+0.75rem)] overflow-visible">
                  <path
                    key={i}
                    d="M52 4 C84 2 98 22 96 70 C95 118 86 146 50 146 C14 147 4 120 4 74 C3 28 16 6 58 7"
                    pathLength={1}
                    fill="none"
                    stroke={PENCIL}
                    strokeWidth={3.4}
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                    className="animate-[draw-in_450ms_ease-out_both]"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => go(i - 1)} className="label rounded-full border-[1.5px] border-dashed px-3 py-2" style={{ borderColor: BROWN }}>
            ← Previous
          </button>
          <button type="button" onClick={() => go(i + 1)} className="label rounded-full px-4 py-2" style={{ background: INK, color: PAPER }}>
            Next frame →
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- the phone

function StorePhone({ screens }: { screens: StoreScreen[] }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [tilt, setTilt] = useState({ x: 6, y: -18 });
  const [flipped, setFlipped] = useState(false);
  const [width, setWidth] = useState(250);
  const swipe = useRef<number | null>(null);
  const n = screens.length;

  useEffect(() => {
    const fit = () => setWidth(window.innerWidth < 640 ? 210 : 250);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const BEZEL = 9;
  const screenW = width - BEZEL * 2;
  const screenH = screenW / (screens[0].width / screens[0].height);
  const height = screenH + BEZEL * 2;
  const DEPTH = 9;
  const go = (k: number) => {
    const next = Math.min(n - 1, Math.max(0, k));
    if (next !== i) cue('tick');
    setI(next);
  };

  return (
    <div className="relative mx-auto mt-24 grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
      <div
        className="relative grid place-items-center py-6"
        style={{ perspective: 1100 }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: -((e.clientY - r.top) / r.height - 0.5) * 22, y: ((e.clientX - r.left) / r.width - 0.5) * 40 });
        }}
        onPointerLeave={() => setTilt({ x: 6, y: -18 })}
      >
        {/* floor shadow */}
        <div aria-hidden className="absolute bottom-0 h-8 rounded-[50%] blur-xl" style={{ width: width * 1.1, background: 'rgb(60 40 20 / 0.35)' }} />
        <div
          className="relative"
          style={{
            width,
            height,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${reduced ? 0 : tilt.x}deg) rotateY(${(reduced ? 0 : tilt.y) + (flipped ? 180 : 0)}deg)`,
            transition: 'transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          {/* The frame's thickness: stacked layers read as a solid edge when it turns */}
          {Array.from({ length: DEPTH }, (_, k) => (
            <div
              key={k}
              aria-hidden
              className="absolute inset-0 rounded-[2.6rem]"
              style={{ transform: `translateZ(${-k - 1}px)`, background: k === 0 || k === DEPTH - 1 ? '#3a3632' : '#8d8478', backfaceVisibility: 'hidden' }}
            />
          ))}

          {/* Front: the screen */}
          <div className="absolute inset-0 rounded-[2.6rem] p-[9px]" style={{ background: '#151413', backfaceVisibility: 'hidden', boxShadow: 'inset 0 0 0 1.5px #5b554e' }}>
            <div
              className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white"
              style={{ touchAction: 'pan-y' }}
              onPointerDown={(e) => (swipe.current = e.clientX)}
              onPointerUp={(e) => {
                if (swipe.current === null) return;
                const dx = e.clientX - swipe.current;
                swipe.current = null;
                if (dx < -36) go(i + 1);
                else if (dx > 36) go(i - 1);
              }}
              onPointerCancel={() => (swipe.current = null)}
              aria-hidden
            >
              <div className="flex h-full" style={{ transform: `translateX(${-i * 100}%)`, transition: reduced ? 'none' : 'transform 550ms cubic-bezier(0.3, 0.7, 0.2, 1)' }}>
                {screens.map((s, k) => (
                  <div key={s.src} className="h-full w-full shrink-0">
                    {Math.abs(k - i) <= 1 && <Picture image={s} sizes={`${screenW}px`} className="h-full w-full" />}
                  </div>
                ))}
              </div>
              {/* camera notch */}
              <span className="absolute left-1/2 top-[5px] h-[17px] w-[34%] -translate-x-1/2 rounded-b-xl bg-[#151413]" />
              {/* glass */}
              <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(125deg, rgb(255 255 255 / 0.18), transparent 35%)' }} />
            </div>
          </div>

          {/* Back */}
          <div
            aria-hidden
            className="absolute inset-0 grid place-items-center rounded-[2.6rem]"
            style={{ transform: `translateZ(${-DEPTH - 1}px) rotateY(180deg)`, backfaceVisibility: 'hidden', background: `linear-gradient(160deg, ${STONE}, ${BROWN})`, boxShadow: 'inset 0 0 0 1.5px rgb(0 0 0 / 0.2)' }}
          >
            <span className="absolute left-4 top-4 grid h-[26%] w-[42%] grid-cols-2 gap-1.5 rounded-[1.6rem] p-2.5" style={{ background: 'rgb(255 255 255 / 0.18)', boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.15)' }}>
              {[0, 1, 2].map((k) => (
                <span key={k} className="aspect-square rounded-full" style={{ background: 'radial-gradient(circle at 40% 35%, #4a4a52, #0d0d10 60%)', boxShadow: '0 0 0 3px #2b2926' }} />
              ))}
            </span>
            <span className="font-display text-4xl font-light italic tracking-tight" style={{ color: PAPER }}>
              clue
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="label" style={{ color: BROWN }}>
          Live on clue.eg
        </h3>
        <p className="mt-3 font-display text-3xl font-light leading-tight">Her photos run the store: the homepage hero, the collection banners and the weekly “New this week” grid.</p>
        <p className="mt-6 text-sm" aria-live="polite">
          <span className="label tabular-nums" style={{ color: BROWN }}>
            Screen {i + 1} / {n}
          </span>
          <span className="block mt-1 text-base">{screens[i].label}</span>
        </p>
        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Screens">
          {screens.map((s, k) => (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-label={`Screen ${k + 1}: ${s.label}`}
                aria-current={k === i ? 'true' : undefined}
                className="block h-2.5 rounded-full transition-all"
                style={{ width: k === i ? 28 : 10, background: k === i ? INK : 'rgb(43 43 43 / 0.25)' }}
              />
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" disabled={i === 0} onClick={() => go(i - 1)} className="label rounded-full border-[1.5px] border-dashed px-3 py-2 disabled:opacity-30" style={{ borderColor: BROWN }}>
            ← Back
          </button>
          <button type="button" disabled={i === n - 1} onClick={() => go(i + 1)} className="label rounded-full px-4 py-2 disabled:opacity-30" style={{ background: INK, color: PAPER }}>
            Next screen →
          </button>
          <button type="button" onClick={() => {
            cue('whoosh');
            setFlipped((f) => !f);
          }} aria-pressed={flipped} className="label rounded-full px-4 py-2" style={{ background: PAPER, color: INK }}>
            {flipped ? 'Turn it back' : 'Turn it over'}
          </button>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'rgb(43 43 43 / 0.65)' }}>
          Swipe the screen to scroll the store.
        </p>
      </div>
    </div>
  );
}
