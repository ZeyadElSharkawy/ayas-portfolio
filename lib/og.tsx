// Share cards (Open Graph and Twitter) for the opengraph-image routes. Rendered at build time by
// next/og (Satori): flexbox only, woff/ttf fonts from assets/fonts, JPEG/PNG images as data URIs.
// The file reads are cached ('use cache') so the image routes can still be prerendered.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import type { ReactNode } from 'react';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = 'image/png';

const BEIGE = '#F4E2CC';
const INK = '#2B1A1D';
const FOREST = '#2F5643';
const RUST = '#9E4F2E';
const ORANGE = '#E69E52';

// Plain ArrayBuffers: they survive the cache's serialisation in a form Satori's font parser accepts.
const font = async (file: string) => {
  const buf = await readFile(join(process.cwd(), 'assets/fonts', file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

export async function ogFonts() {
  'use cache';
  const [fraunces, frauncesItalic, instrument, alexandria] = await Promise.all([
    font('Fraunces-Light-opsz144.woff'),
    font('Fraunces-LightItalic-opsz144.woff'),
    font('InstrumentSans-Medium.woff'),
    font('Alexandria-Regular-arabic.woff'),
  ]);
  return [
    { name: 'Fraunces', data: fraunces, weight: 300 as const, style: 'normal' as const },
    { name: 'Fraunces', data: frauncesItalic, weight: 300 as const, style: 'italic' as const },
    { name: 'Instrument Sans', data: instrument, weight: 500 as const, style: 'normal' as const },
    { name: 'Alexandria', data: alexandria, weight: 400 as const, style: 'normal' as const },
  ];
}

/** A pipeline image (served from public/) cropped to size, as a JPEG data URI Satori can draw. */
export async function ogPhoto(publicSrc: string, width: number, height: number, position = 'attention') {
  'use cache';
  const buf = await sharp(join(process.cwd(), 'public', publicSrc))
    .resize(width, height, { fit: 'cover', position })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

/** sRGB mix, standing in for the page's color-mix() wash (Satori has no color-mix). */
function mix(a: string, b: string, t: number) {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(ch(a, i) * t + ch(b, i) * (1 - t)).toString(16).padStart(2, '0')).join('');
}

function NeedleMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="15" fill={FOREST} />
      <path d="M18 51 C 9 45, 9 33, 20 30 S 33 36, 27 43" fill="none" stroke={ORANGE} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="5.5 4" />
      <path d="M15 54 L47 14" stroke={BEIGE} strokeWidth="5.4" strokeLinecap="round" />
      <path d="M44.2 17.6 C 52 22, 54 32, 46 38 S 30 42, 27 43" fill="none" stroke={ORANGE} strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

const label = { fontFamily: 'Instrument Sans', fontSize: 20, letterSpacing: 3.2, textTransform: 'uppercase' as const };

function Signature() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <NeedleMark size={44} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'Fraunces', fontSize: 30, color: INK }}>Aya Hafez</span>
        <span style={{ ...label, fontSize: 15, color: RUST }}>Fashion designer · Berlin · Cairo</span>
      </div>
    </div>
  );
}

/** A dashed running stitch down the seam between text and photo. */
function Seam({ color }: { color: string }) {
  return <div style={{ position: 'absolute', left: 0, top: 28, bottom: 28, width: 0, borderLeft: `4px dashed ${color}` }} />;
}

export function ProjectCard({ kicker, title, titleAr, tagline, palette, photo }: { kicker: string; title: string; titleAr?: string; tagline: string; palette: string[]; photo: string }) {
  const wash = mix(palette[0], BEIGE, 0.16);
  const size = title.length > 16 ? 76 : 92;
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: wash, color: INK }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640, padding: '56px 56px 48px 64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...label, color: RUST }}>{kicker}</span>
          <span style={{ fontFamily: 'Fraunces', fontSize: size, lineHeight: 0.98, letterSpacing: -2, marginTop: 22 }}>{title}</span>
          {/* Satori shapes Arabic letters but lays words out left to right, so set the word order here. */}
          {titleAr && (
            <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: 0, fontFamily: 'Alexandria', fontSize: 34, marginTop: 14, color: '#5a4446' }}>
              {titleAr.split(/\s+/).map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </div>
          )}
          <span style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 30, lineHeight: 1.25, marginTop: 24, maxWidth: 500 }}>{tagline}</span>
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {palette.map((c) => (
              <div key={c} style={{ width: 52, height: 12, borderRadius: 6, background: c, border: '1px solid rgba(0,0,0,0.08)' }} />
            ))}
          </div>
        </div>
        <Signature />
      </div>
      <div style={{ display: 'flex', position: 'relative', width: 560, height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
        <img src={photo} width={560} height={630} style={{ objectFit: 'cover' }} alt="" />
        <Seam color={BEIGE} />
      </div>
    </div>
  );
}

export function SiteCard({ kicker, heading, sub, photos }: { kicker: string; heading: ReactNode; sub: string; photos: string[] }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: BEIGE, color: INK }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640, padding: '64px 48px 48px 64px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ ...label, color: FOREST }}>{kicker}</span>
          <span style={{ fontFamily: 'Fraunces', fontSize: 104, lineHeight: 0.95, letterSpacing: -3, marginTop: 24 }}>{heading}</span>
          <span style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 32, lineHeight: 1.25, marginTop: 28, maxWidth: 520 }}>{sub}</span>
        </div>
        <Signature />
      </div>
      {/* A fanned stack of covers, like prints laid out on the cutting table */}
      <div style={{ display: 'flex', position: 'relative', width: 560, height: '100%' }}>
        {photos.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              position: 'absolute',
              left: 40 + i * 92,
              top: 70 + (i % 2) * 40,
              transform: `rotate(${[-6, 3, -2, 5][i % 4]}deg)`,
              padding: 10,
              background: '#fffaf3',
              boxShadow: '0 18px 40px rgba(60,30,20,0.28)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image */}
            <img src={p} width={230} height={330} style={{ objectFit: 'cover' }} alt="" />
          </div>
        ))}
        <Seam color={RUST} />
      </div>
    </div>
  );
}
