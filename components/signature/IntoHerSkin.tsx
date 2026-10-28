'use client';

// Into Her Skin signature: the work lives inside aerial hoops, as in Aya's booklet. A ring of hoops
// to drag and spin, a fitting timeline from first prototype to Fitting 3, and the interview
// played inside a hoop.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { ResolvedImage, ResolvedVideo } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cue } from '@/lib/sound';

const LAVENDER = '#8f89cf';
const GOLD = '#d4a63a';
const YELLOW = '#f5e15a';
const INK = '#1f1d33';

type Fitting = { label: string; page: ResolvedImage; note: string };

export function IntoHerSkinSignature({ hoops, fittings, interview }: { hoops: ResolvedImage[]; fittings: Fitting[]; interview: ResolvedVideo }) {
  return (
    <section aria-labelledby="ihs-sig-title" className="overflow-hidden py-16 text-white sm:py-24" style={{ background: LAVENDER }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label" style={{ color: YELLOW }}>
          Into Her Skin · Aerial hoop
        </p>
        <h2 id="ihs-sig-title" className="mt-2 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
          In the hoop
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/85">
          Every page of her booklet sits inside a hoop. Here they hang from the rig: drag to spin them.
        </p>
      </div>

      <HoopRing hoops={hoops} />

      <div className="mx-auto mt-20 grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <FittingTimeline fittings={fittings} />
        <InterviewHoop video={interview} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- the ring of hoops

function HoopRing({ hoops }: { hoops: ResolvedImage[] }) {
  const reduced = useReducedMotion();
  const n = hoops.length;
  const step = 360 / n;
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  // Button, key and slow-drag moves glide with a CSS transition; only a fast flick runs the
  // momentum loop below.
  const [glide, setGlide] = useState(false);
  const drag = useRef({ x: 0, last: 0, v: 0, t: 0 });
  const raf = useRef(0);
  const [size, setSize] = useState(220);

  useEffect(() => {
    const fit = () => setSize(window.innerWidth < 640 ? 160 : 250);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Ring radius so neighbouring hoops don't overlap.
  const radius = (size / 2 / Math.tan(Math.PI / n)) * 1.18;
  const front = ((Math.round(-angle / step) % n) + n) % n;

  const snapTo = (target: number) => {
    if (target !== angle) cue('whoosh');
    cancelAnimationFrame(raf.current);
    setGlide(!reduced);
    setAngle(target);
  };

  const settle = (from: number, velocity: number) => {
    cancelAnimationFrame(raf.current);
    if (reduced || Math.abs(velocity) < 1.5) {
      snapTo(Math.round(from / step) * step);
      return;
    }
    cue('whoosh');
    setGlide(false);
    let a = from;
    let v = velocity;
    const tick = () => {
      // Glide with friction, then ease onto the nearest hoop.
      if (Math.abs(v) > 0.05) {
        a += v;
        v *= 0.93;
      } else {
        const target = Math.round(a / step) * step;
        a += (target - a) * 0.18;
        if (Math.abs(target - a) < 0.05) {
          setAngle(target);
          return;
        }
      }
      setAngle(a);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const onDown = (e: ReactPointerEvent) => {
    cancelAnimationFrame(raf.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, last: angle, v: 0, t: performance.now() };
    setGlide(false);
    setDragging(true);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const next = drag.current.last + (e.clientX - drag.current.x) * 0.35;
    drag.current.v = ((next - angle) / Math.max(1, now - drag.current.t)) * 16;
    drag.current.t = now;
    setAngle(next);
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    settle(angle, drag.current.v);
  };
  const go = (d: number) => snapTo(Math.round(angle / step) * step - d * step);

  return (
    <div className="mt-6">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Hoops: drag or use the arrows to spin"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDragStart={(event) => event.preventDefault()}
        data-cursor={dragging ? undefined : 'Drag to spin'}
        className="relative mx-auto h-[24rem] touch-pan-y select-none sm:h-[30rem]"
        style={{ perspective: '1300px', cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(${-radius}px) rotateY(${angle}deg)`,
            transition: glide ? 'transform 700ms var(--ease-thread)' : undefined,
          }}
        >
          {hoops.map((img, i) => {
            const facing = Math.cos(((i * step + angle) * Math.PI) / 180);
            return (
              <div
                key={img.src}
                className="absolute"
                style={{
                  width: size,
                  height: size,
                  left: -size / 2,
                  top: -size / 2,
                  transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                  opacity: 0.3 + 0.7 * Math.max(0, facing),
                }}
              >
                {/* Rope up to the rig */}
                <span aria-hidden className="absolute bottom-full left-1/2 h-[40rem] w-px -translate-x-1/2" style={{ background: INK }} />
                <div className={reduced ? '' : 'animate-[hoop-sway_5s_ease-in-out_infinite]'} style={{ animationDelay: `${-i * 0.6}s`, transformOrigin: '50% -40rem' }}>
                  <div className="rounded-full p-[7px] shadow-xl" style={{ background: `conic-gradient(from 200deg, ${GOLD}, #f3d27a, ${GOLD}, #9a7220, ${GOLD})` }}>
                    <div className="overflow-hidden rounded-full" style={{ width: size - 14, height: size - 14, background: INK }}>
                      <Picture image={img} sizes={`${size}px`} // Booklet pages already frame each photo in a printed hoop; crop past it.
                      className="h-full w-full scale-[1.55]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-2 flex max-w-xl items-center justify-between gap-4 px-4">
        <button type="button" onClick={() => go(-1)} aria-label="Previous hoop" data-cursor="Previous" className="label rounded-full border-[1.5px] border-dashed border-white/60 px-3 py-2 hover:border-white">
          ←
        </button>
        <p className="text-center text-sm text-white/85" aria-live="polite">
          {hoops[front].alt}
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Next hoop" data-cursor="Next" className="label rounded-full border-[1.5px] border-dashed border-white/60 px-3 py-2 hover:border-white">
          →
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- fittings

function FittingTimeline({ fittings }: { fittings: Fitting[] }) {
  const [i, setI] = useState(0);
  const f = fittings[i];
  return (
    <div>
      <h3 className="label" style={{ color: YELLOW }}>
        Fitting timeline
      </h3>
      <ol className="mt-5 flex items-center" aria-label="Fittings">
        {fittings.map((x, k) => (
          <li key={x.label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => setI(k)}
              aria-current={k === i ? 'step' : undefined}
              className="label flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors"
              style={k === i ? { background: YELLOW, color: INK } : { background: 'rgb(255 255 255 / 0.15)' }}
            >
              <span aria-hidden className="tabular-nums">
                {k + 1}
              </span>
              {x.label}
            </button>
            {k < fittings.length - 1 && (
              <span
                aria-hidden
                className="stitch mx-2 flex-1"
                style={{ color: k < i ? YELLOW : 'rgb(255 255 255 / 0.4)' }}
              />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-6 grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Picture key={f.page.src} image={f.page} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw" className="rounded-sm shadow-lg animate-[fade-in_400ms_ease]" />
        <div>
          <p className="font-display text-3xl font-light">{f.label}</p>
          <p className="mt-3 leading-relaxed text-white/90" aria-live="polite">
            {f.note}
          </p>
          <div className="mt-6 flex gap-2">
            <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="label rounded-full border-[1.5px] border-dashed border-white/60 px-3 py-2 disabled:opacity-30">
              ← Back
            </button>
            <button type="button" disabled={i === fittings.length - 1} onClick={() => setI(i + 1)} className="label rounded-full px-4 py-2 disabled:opacity-30" style={{ background: YELLOW, color: INK }}>
              Next fitting →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- interview

function InterviewHoop({ video }: { video: ResolvedVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const C = 2 * Math.PI * 48;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <div>
      <h3 className="label" style={{ color: YELLOW }}>
        Interview · Shahenda Bahgat
      </h3>
      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[22rem]">
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          className="absolute inset-[6%] h-[88%] w-[88%] rounded-full object-cover"
          style={{ background: INK }}
        />
        {/* The hoop: a gold ring that fills as the interview plays */}
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="3" />
          <circle cx="50" cy="50" r="48" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause the interview' : 'Play the interview'}
          data-cursor={playing ? 'Pause' : 'Play'}
          className="absolute inset-[6%] grid place-items-center rounded-full"
        >
          {!playing && (
            <span className="grid h-16 w-16 place-items-center rounded-full shadow-lg" style={{ background: YELLOW, color: INK }}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                <path d="M7 4 L20 12 L7 20 Z" fill="currentColor" />
              </svg>
            </span>
          )}
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-white/80">
        {video.title} · {Math.floor(video.duration / 60)}:{String(Math.round(video.duration % 60)).padStart(2, '0')}
      </p>
    </div>
  );
}
