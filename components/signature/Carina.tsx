'use client';

// Carina Arabesque signature: each look revealed behind a sliding mashrabiya screen, her arabesque
// rosette assembling itself from its elements (as on her "element breakdown" page), and a colourway
// switcher that dresses a matching mother and daughter in her proposed SKUs.

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { useInView } from '@/lib/use-scroll-progress';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cue } from '@/lib/sound';

const CREAM = '#EEEBE4';
const OLIVE = '#4E5B3A';
const BROWN = '#5B3A2B';
const TEAL = '#1F6F78';
const ORANGE = '#E2752C';
const WOOD = '#4a2e1f';

/** Her palette page, as named swatches. */
const COLOURS = [
  { name: 'Olive', hex: OLIVE },
  { name: 'Brown', hex: '#5F4131' },
  { name: 'Teal', hex: '#106B79' },
  { name: 'Deep teal', hex: '#15635F' },
  { name: 'Orange', hex: '#F27F27' },
  { name: 'Lemon', hex: '#ECE88C' },
  { name: 'Cream', hex: '#E8DCC3' },
  { name: 'Rose sand', hex: '#D2B9A8' },
  { name: 'Sage', hex: '#B9BC9C' },
] as const;
type Colour = (typeof COLOURS)[number]['hex'];

/** The lantern shape of her palette swatches. */
const LANTERN = 'M0.5,0 C0.62,0.1 0.78,0.1 0.86,0.2 C1,0.36 1,0.64 0.86,0.8 C0.78,0.9 0.62,0.9 0.5,1 C0.38,0.9 0.22,0.9 0.14,0.8 C0,0.64 0,0.36 0.14,0.2 C0.22,0.1 0.38,0.1 0.5,0 Z';

export function CarinaSignature({ looks }: { looks: ResolvedImage[] }) {
  return (
    <section aria-labelledby="carina-sig-title" className="overflow-hidden py-16 sm:py-24" style={{ background: CREAM, color: BROWN }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id="carina-lantern" clipPathUnits="objectBoundingBox">
          <path d={LANTERN} />
        </clipPath>
      </svg>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <p className="label" style={{ color: TEAL }}>
          Carina Arabesque · <span lang="ar" dir="rtl" className="font-arabic normal-case">كارينا بالعربي</span>
        </p>
        <h2 id="carina-sig-title" className="mt-2 font-display text-headline">
          Behind the mashrabiya
        </h2>
        <p className="mt-3 max-w-xl text-lg leading-relaxed" style={{ color: 'rgb(91 58 43 / 0.85)' }}>
          The looks were shot in Islamic Cairo, among carved wooden screens. Choose a look and the screen slides open.
        </p>
      </div>

      <MashrabiyaReveal looks={looks} />
      <MotifAssembly />
      <ColourwaySwitcher />
    </section>
  );
}

// ---------------------------------------------------------------- mashrabiya reveal

function MashrabiyaReveal({ looks }: { looks: ResolvedImage[] }) {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const [i, setI] = useState(0);
  const [closed, setClosed] = useState(true);
  const timer = useRef(0);
  const moved = useRef(false);

  // The wooden leaves sliding in their track (not on first render).
  useEffect(() => {
    if (moved.current) cue('slide');
    moved.current = true;
  }, [closed]);

  useEffect(() => {
    if (!seen) return;
    timer.current = window.setTimeout(() => setClosed(false), reduced ? 0 : 350);
    return () => clearTimeout(timer.current);
  }, [seen, reduced]);

  const choose = (k: number) => {
    if (k === i) return;
    clearTimeout(timer.current);
    if (reduced) {
      setI(k);
      return;
    }
    // Close the screen, change the look behind it, open again.
    setClosed(true);
    timer.current = window.setTimeout(() => {
      setI(k);
      timer.current = window.setTimeout(() => setClosed(false), 120);
    }, 700);
  };

  const look = looks[i];
  const slide: CSSProperties = { transition: reduced ? 'none' : 'transform 700ms cubic-bezier(0.65, 0, 0.35, 1)' };

  return (
    <div ref={ref} className="mx-auto mt-12 grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
      {/* The window: a carved frame, the photo, and two lattice leaves */}
      <figure className="mx-auto w-full max-w-[26rem]">
        <div className="relative rounded-t-[50%_18%] p-3 sm:p-4" style={{ background: `linear-gradient(180deg, #6b4430, ${WOOD})`, boxShadow: '0 30px 60px -30px rgb(40 20 10 / 0.7), inset 0 0 0 2px rgb(255 220 170 / 0.15)' }}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-[50%_16%]" style={{ background: '#2b1a12' }}>
            <Picture key={look.src} image={look} sizes="(min-width: 1024px) 26rem, 88vw" className="h-full w-full" />
            {(['left', 'right'] as const).map((side) => (
              <div
                key={side}
                aria-hidden
                className="absolute inset-y-0 w-1/2"
                style={{
                  ...slide,
                  [side]: 0,
                  transform: closed ? 'none' : `translateX(${side === 'left' ? '-101%' : '101%'})`,
                  boxShadow: side === 'left' ? 'inset -3px 0 0 #2b1a12' : 'inset 3px 0 0 #2b1a12',
                }}
              >
                <Lattice />
              </div>
            ))}
          </div>
        </div>
        <figcaption className="mt-3 text-sm" aria-live="polite">
          <span className="label" style={{ color: TEAL }}>
            Look {i + 1} of {looks.length}
          </span>{' '}
          · {look.alt}
        </figcaption>
      </figure>

      <div>
        <h3 className="label" style={{ color: TEAL }}>
          The executed look
        </h3>
        <p className="mt-3 text-2xl font-medium leading-tight">
          “A single motif makes complex patterns when interlaced together, to symbolize how a family unites.”
        </p>
        <ul className="mt-8 flex flex-wrap gap-3" aria-label="Looks">
          {looks.map((l, k) => (
            <li key={l.src}>
              <button
                type="button"
                onClick={() => choose(k)}
                aria-label={`Look ${k + 1}: ${l.alt}`}
                aria-current={k === i ? 'true' : undefined}
                className="relative block h-20 w-14 transition-transform hover:-translate-y-0.5 sm:h-24 sm:w-[4.25rem]"
              >
                <span className="absolute inset-0" style={{ clipPath: 'url(#carina-lantern)', background: k === i ? ORANGE : 'transparent' }} />
                <span className="absolute inset-[3px]" style={{ clipPath: 'url(#carina-lantern)' }}>
                  <Picture image={l} sizes="5rem" className="h-full w-full" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setClosed((c) => !c)} aria-pressed={!closed} className="label mt-6 rounded-full border px-4 py-2" style={{ borderColor: BROWN }}>
          {closed ? 'Open the screen' : 'Close the screen'}
        </button>
      </div>
    </div>
  );
}

/** Turned-wood lattice: bars with a diamond at every joint and a bead halfway between. */
function Lattice() {
  const id = useId();
  return (
    <svg className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5236" />
          <stop offset="1" stopColor={WOOD} />
        </linearGradient>
        <pattern id={`${id}-p`} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect x="0" y="8.8" width="22" height="4.4" fill={`url(#${id}-wood)`} />
          <rect x="8.8" y="0" width="4.4" height="22" fill={`url(#${id}-wood)`} />
          <path d="M11 5.4 L16.6 11 L11 16.6 L5.4 11 Z" fill="#6b4430" stroke="#2b1a12" strokeWidth="0.7" />
          <ellipse cx="0" cy="11" rx="4" ry="3.3" fill="#7a5236" stroke="#2b1a12" strokeWidth="0.6" />
          <ellipse cx="22" cy="11" rx="4" ry="3.3" fill="#7a5236" stroke="#2b1a12" strokeWidth="0.6" />
          <ellipse cx="11" cy="0" rx="3.3" ry="4" fill="#7a5236" stroke="#2b1a12" strokeWidth="0.6" />
          <ellipse cx="11" cy="22" rx="3.3" ry="4" fill="#7a5236" stroke="#2b1a12" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="rgb(20 10 5 / 0.35)" />
      <rect width="100%" height="100%" fill={`url(#${id}-p)`} />
    </svg>
  );
}

// ---------------------------------------------------------------- the rosette, element by element

// Shapes are drawn at their final size around (0, 0).
const petal = (r0: number, r1: number, wide: number) =>
  `M0 ${-r0} C${wide} ${-(r0 + (r1 - r0) * 0.35)} ${wide} ${-(r0 + (r1 - r0) * 0.75)} 0 ${-r1} C${-wide} ${-(r0 + (r1 - r0) * 0.75)} ${-wide} ${-(r0 + (r1 - r0) * 0.35)} 0 ${-r0} Z`;
const around = (count: number, render: (deg: number, k: number) => ReactNode) =>
  Array.from({ length: count }, (_, k) => render((360 / count) * k, k));

const scallops = Array.from({ length: 16 }, (_, k) => {
  const a0 = ((k * 22.5 - 90) * Math.PI) / 180;
  const a1 = (((k + 1) * 22.5 - 90) * Math.PI) / 180;
  const p = (a: number, r: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  return `${k ? '' : `M${p(a0, 78)} `}Q${p((a0 + a1) / 2, 92)} ${p(a1, 78)}`;
}).join(' ');

const ELEMENTS: { name: string; art: ReactNode }[] = [
  {
    name: 'centre',
    art: <path d="M0 -15 L10.6 -10.6 L15 0 L10.6 10.6 L0 15 L-10.6 10.6 L-15 0 L-10.6 -10.6 Z" fill={ORANGE} transform="rotate(22.5)" />,
  },
  { name: 'diamonds', art: <g>{around(8, (d, k) => <path key={k} d="M0 -30 L4 -24 L0 -18 L-4 -24 Z" fill={BROWN} transform={`rotate(${d + 22.5})`} />)}</g> },
  { name: 'petals', art: <g>{around(8, (d, k) => <path key={k} d={petal(28, 72, 17)} fill="none" stroke={OLIVE} strokeWidth="3" transform={`rotate(${d})`} />)}</g> },
  { name: 'inner petals', art: <g>{around(8, (d, k) => <path key={k} d={petal(36, 62, 8)} fill={TEAL} transform={`rotate(${d})`} />)}</g> },
  { name: 'scallops', art: <path d={scallops} fill="none" stroke={BROWN} strokeWidth="2.4" /> },
  { name: 'dots', art: <g>{around(32, (d, k) => <circle key={k} cx="0" cy="-98" r="2.6" fill={ORANGE} transform={`rotate(${d})`} />)}</g> },
];

function MotifAssembly() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(0.5);
  const [together, setTogether] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const t = window.setTimeout(() => setTogether(true), reduced ? 0 : 500);
    return () => clearTimeout(t);
  }, [seen, reduced]);

  const n = ELEMENTS.length;
  return (
    <div ref={ref} className="mx-auto mt-24 max-w-7xl px-4 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="label" style={{ color: TEAL }}>
            Element breakdown
          </h3>
          <p className="mt-2 max-w-lg text-xl font-medium leading-snug">One rosette, built from six simple elements, the way she drew it apart in her booklet.</p>
        </div>
        <button type="button" onClick={() => {
            cue('whoosh');
            setTogether((t) => !t);
          }} aria-pressed={together} className="label rounded-full px-4 py-2" style={{ background: BROWN, color: CREAM }}>
          {together ? 'Take it apart' : 'Put it together'}
        </button>
      </div>
      <svg viewBox="0 0 720 260" className="mt-8 w-full" role="img" aria-label={together ? 'The arabesque rosette, assembled' : 'The rosette taken apart into its six elements'}>
        {ELEMENTS.map((el, k) => {
          const apartX = 60 + k * 120;
          const t = together
            ? 'translate(360px, 130px) scale(1.15) rotate(0deg)'
            : `translate(${apartX}px, 130px) scale(0.48) rotate(${(k % 2 ? 1 : -1) * 20}deg)`;
          return (
            <g
              key={el.name}
              style={{
                transform: t,
                transition: reduced ? 'none' : `transform 1000ms cubic-bezier(0.6, 0, 0.2, 1) ${(together ? n - 1 - k : k) * 90}ms`,
              }}
            >
              {el.art}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------- colourway switcher

type Part = 'top' | 'yoke' | 'placket' | 'skirt' | 'embroidery';
type Colourway = Record<Part, Colour>;

const PARTS: { id: Part; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'yoke', label: 'Yoke' },
  { id: 'placket', label: 'Collar & placket' },
  { id: 'skirt', label: 'Tiered skirt' },
  { id: 'embroidery', label: 'Embroidery' },
];

const hex = (name: (typeof COLOURS)[number]['name']) => COLOURS.find((c) => c.name === name)!.hex;

/** The six dresses on her "Color Variations" page, in her order. */
const SKUS: { name: string; way: Colourway }[] = [
  { name: 'Orange & teal', way: { top: hex('Orange'), yoke: hex('Orange'), placket: hex('Brown'), skirt: hex('Teal'), embroidery: hex('Teal') } },
  { name: 'Cream & teal', way: { top: hex('Cream'), yoke: hex('Orange'), placket: hex('Brown'), skirt: hex('Teal'), embroidery: hex('Orange') } },
  { name: 'Teal dress', way: { top: hex('Teal'), yoke: hex('Teal'), placket: hex('Brown'), skirt: hex('Teal'), embroidery: hex('Orange') } },
  { name: 'Orange dress', way: { top: hex('Orange'), yoke: hex('Orange'), placket: hex('Brown'), skirt: hex('Orange'), embroidery: hex('Teal') } },
  { name: 'Cream & deep teal', way: { top: hex('Cream'), yoke: hex('Cream'), placket: hex('Deep teal'), skirt: hex('Deep teal'), embroidery: hex('Orange') } },
  { name: 'Cream dress', way: { top: hex('Cream'), yoke: hex('Cream'), placket: hex('Brown'), skirt: hex('Cream'), embroidery: hex('Olive') } },
];

function ColourwaySwitcher() {
  const [way, setWay] = useState<Colourway>(SKUS[1].way);
  const [part, setPart] = useState<Part>('top');
  const sku = SKUS.find((s) => (Object.keys(s.way) as Part[]).every((p) => s.way[p] === way[p]));
  const colourName = (h: string) => COLOURS.find((c) => c.hex === h)?.name;

  return (
    <div className="mx-auto mt-24 grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
      <div className="flex items-end justify-center gap-2 rounded-sm px-4 pb-4 pt-8 sm:gap-6" style={{ background: 'rgb(255 255 255 / 0.55)' }}>
        <Flat way={way} className="h-[19rem] sm:h-[26rem]" label="Mother's look" />
        <Flat way={way} className="h-[13.5rem] sm:h-[18.5rem]" label="Daughter's matching look" />
      </div>

      <div>
        <h3 className="label" style={{ color: TEAL }}>
          Colourways
        </h3>
        <p className="mt-2 text-xl font-medium leading-snug">Mother and daughter, matching. Try her colour variations, or pick a part and recolour it from her palette.</p>

        <p className="label mt-6" id="carina-skus">
          Colour variations
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="carina-skus">
          {SKUS.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => {
                cue('tick');
                setWay(s.way);
              }}
              aria-pressed={sku === s}
              className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-colors"
              style={sku === s ? { background: BROWN, color: CREAM } : { background: 'rgb(91 58 43 / 0.08)' }}
            >
              <span aria-hidden className="flex">
                {[s.way.top, s.way.skirt].map((c, k) => (
                  <span key={k} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c, marginLeft: k ? -6 : 0 }} />
                ))}
              </span>
              {s.name}
            </button>
          ))}
        </div>

        <p className="label mt-6" id="carina-part">
          Part
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="carina-part">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={part === p.id}
              onClick={() => setPart(p.id)}
              className="label rounded-full border-[1.5px] px-3 py-1.5"
              style={part === p.id ? { background: TEAL, borderColor: TEAL, color: CREAM } : { borderColor: 'rgb(91 58 43 / 0.35)', borderStyle: 'dashed' }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="label mt-6" id="carina-colour">
          Colour · {PARTS.find((p) => p.id === part)!.label}: {colourName(way[part])}
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby="carina-colour">
          {COLOURS.map((c) => (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={way[part] === c.hex}
              aria-label={c.name}
              title={c.name}
              onClick={() => {
                cue('tick');
                setWay((w) => ({ ...w, [part]: c.hex }));
              }}
              className="relative h-12 w-9 transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0" style={{ clipPath: 'url(#carina-lantern)', background: way[part] === c.hex ? BROWN : 'rgb(91 58 43 / 0.2)' }} />
              <span className="absolute inset-[3px]" style={{ clipPath: 'url(#carina-lantern)', background: c.hex }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Her own flat from "Color Variations", cut into parts: each is a mask filled with its colour, her drawing on top. */
function Flat({ way, className, label }: { way: Colourway; className: string; label: string }) {
  const layer = (id: string, colour: string): CSSProperties => {
    const url = `url(/media/carina-arabesque/cutout/${id}.webp)`;
    return { background: colour, maskImage: url, WebkitMaskImage: url, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', transition: 'background-color 450ms ease' };
  };
  return (
    <div
      role="img"
      aria-label={`${label}: ${PARTS.map((p) => `${p.label.toLowerCase()} in ${COLOURS.find((c) => c.hex === way[p.id])?.name.toLowerCase()}`).join(', ')}`}
      className={`relative ${className}`}
      style={{ aspectRatio: '750 / 1782' }}
    >
      <span className="absolute inset-0" style={layer('neck', '#fff')} />
      {PARTS.map((p) => (
        <span key={p.id} className="absolute inset-0" style={layer(p.id, way[p.id])} />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element -- her drawing, aligned to the masks above */}
      <img src="/media/carina-arabesque/cutout/line.webp" alt="" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
