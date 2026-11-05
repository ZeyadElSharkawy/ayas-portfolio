'use client';

// Cultural Echoes signature: step through a turquoise Cairo door into the work, then watch a wall
// of khayamiya appliqué stitch itself together. The instruments from her poster play when sound is on.

import type { ReactNode } from 'react';
import { useInView } from '@/lib/use-scroll-progress';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { playPhrase, setSoundEnabled, useSoundEnabled, type Instrument } from '@/lib/sound';

export function CulturalEchoesSignature({ palette }: { palette: string[] }) {
  return <KhayamiyaWall palette={palette} />;
}

// ---------------------------------------------------------------- the khayamiya wall

type Tile = { motif: Motif } | { instrument: Instrument };
type Motif = 'lotus' | 'star' | 'diamond' | 'sun' | 'arch' | 'zigzag';

/** The paper of her poster, behind its instrument drawings. */
const POSTER_ORANGE = '#E89A2C';

const TILES: Tile[] = [
  { motif: 'star' },
  { instrument: 'oud' },
  { motif: 'lotus' },
  { motif: 'diamond' },
  { motif: 'arch' },
  { motif: 'sun' },
  { instrument: 'tabla' },
  { motif: 'zigzag' },
  { motif: 'lotus' },
  { instrument: 'cymbals' },
  { motif: 'star' },
  { motif: 'diamond' },
];

function KhayamiyaWall({ palette }: { palette: string[] }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const reduced = useReducedMotion();
  const sound = useSoundEnabled();
  const shown = seen || reduced;
  // Ground colours from the palette, skipping the cream (used for motifs instead).
  const grounds = palette.filter((c) => c.toLowerCase() !== '#f6e3cf');
  const cream = '#f6e3cf';

  return (
    <section aria-labelledby="khayamiya-title" className="bg-[#f6e3cf] py-16 text-[#2b1a1d] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="label text-[#1f5b45]">Khayamiya · the tent-makers’ appliqué</p>
            <h2 id="khayamiya-title" className="mt-2 font-display text-headline">
              Stitched by hand
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[#4a3a33]">
              Symbols from Cairo street life, cut from cloth and appliquéd the way Cairo’s tent-makers do. The instruments come from her poster: turn the
              sound on and play them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled(!sound)}
            aria-pressed={sound}
            className={`label rounded-full border px-4 py-2 transition-colors ${
              sound ? 'border-[#1f5b45] bg-[#1f5b45] text-[#f6e3cf]' : 'border-[#2b1a1d]/40 hover:border-[#1f5b45] hover:text-[#1f5b45]'
            }`}
          >
            Sound {sound ? 'on' : 'off'}
          </button>
        </div>

        <div ref={ref} className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {TILES.map((tile, i) => {
            const ground = 'instrument' in tile ? POSTER_ORANGE : grounds[i % grounds.length];
            const ink = i % 3 === 0 ? cream : grounds[(i + 2) % grounds.length] === ground ? cream : grounds[(i + 2) % grounds.length];
            const delay = `${i * 90}ms`;
            const body = (
              <>
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                  {'motif' in tile && <MotifArt kind={tile.motif} color={ink} />}
                  {/* The running stitch round each appliqué patch, sewn in once the wall is in view */}
                  <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    rx="3"
                    fill="none"
                    stroke={cream}
                    strokeWidth="1.4"
                    strokeDasharray="4 3"
                    style={{
                      clipPath: shown ? 'inset(0)' : 'inset(0 100% 0 0)',
                      transition: reduced ? undefined : `clip-path 900ms var(--ease-thread) calc(${delay} + 350ms)`,
                    }}
                  />
                </svg>
                {'instrument' in tile && (
                  // Drawn by her for the poster.
                  // eslint-disable-next-line @next/next/no-img-element -- a small fixed cut-out, not a pipeline image
                  <img src={`/media/cultural-echoes/cutout/${tile.instrument}.webp`} alt="" className="absolute left-[14%] top-[11%] h-[68%] w-[72%] object-contain" />
                )}
              </>
            );
            const style = {
              backgroundColor: ground,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : `translateY(18px) rotate(${i % 2 ? 3 : -3}deg)`,
              transition: reduced ? undefined : `opacity 500ms ease ${delay}, transform 700ms var(--ease-thread) ${delay}`,
            };
            return 'instrument' in tile ? (
              <button
                key={i}
                type="button"
                onClick={() => playPhrase(tile.instrument)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && playPhrase(tile.instrument)}
                aria-label={`Play the ${tile.instrument}${sound ? '' : ' (turn sound on first)'}`}                className="group relative aspect-square overflow-hidden rounded-[3px] [&_svg]:transition-transform hover:[&_svg]:scale-105"
                style={style}
              >
                {body}
                <span className="label absolute right-0 bottom-[10%] left-0 text-center text-[0.6rem] text-[#5a1f33]">{tile.instrument}</span>
              </button>
            ) : (
              <div key={i} aria-hidden className="relative aspect-square overflow-hidden rounded-[3px]" style={style}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MotifArt({ kind, color }: { kind: Motif; color: string }): ReactNode {
  const fill = { fill: color };
  switch (kind) {
    case 'lotus':
      return (
        <g {...fill}>
          <path d="M50 22 C60 40 60 58 50 74 C40 58 40 40 50 22 Z" />
          <path d="M50 74 C34 66 24 52 22 38 C36 42 46 54 50 74 Z" opacity="0.85" />
          <path d="M50 74 C66 66 76 52 78 38 C64 42 54 54 50 74 Z" opacity="0.85" />
        </g>
      );
    case 'star':
      return (
        <g {...fill}>
          <rect x="30" y="30" width="40" height="40" />
          <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="7" fill="none" stroke="#00000033" strokeWidth="2" />
        </g>
      );
    case 'diamond':
      return (
        <g {...fill}>
          {[
            [50, 24],
            [26, 50],
            [74, 50],
            [50, 76],
          ].map(([x, y]) => (
            <path key={`${x}${y}`} d={`M${x} ${y - 12} L${x + 12} ${y} L${x} ${y + 12} L${x - 12} ${y} Z`} />
          ))}
          <path d="M50 38 L62 50 L50 62 L38 50 Z" opacity="0.6" />
        </g>
      );
    case 'sun':
      return (
        <g {...fill}>
          <circle cx="50" cy="50" r="14" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="48" y="18" width="4" height="12" transform={`rotate(${i * 30} 50 50)`} />
          ))}
        </g>
      );
    case 'arch':
      return <path {...fill} d="M30 82 L30 48 Q30 30 50 20 Q70 30 70 48 L70 82 Z M40 82 L40 52 Q40 40 50 33 Q60 40 60 52 L60 82 Z" fillRule="evenodd" />;
    case 'zigzag':
      return (
        <g fill="none" stroke={color} strokeWidth="5" strokeLinejoin="round">
          {[30, 50, 70].map((y) => (
            <path key={y} d={`M18 ${y} L30 ${y - 8} L42 ${y} L54 ${y - 8} L66 ${y} L78 ${y - 8}`} />
          ))}
        </g>
      );
  }
}
