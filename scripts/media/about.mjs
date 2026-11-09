// The home page hero's pictures, from _source/about/ (git-ignored):
//   portrait-enhanced.webp  an enhanced, already-cropped 659×852 photo of her at a design event
//   portrait-cutout.png     the same photo with the background removed (658×854; the older 439×568 preview is portrait-cutout-preview.png)
//
//   npm run media:about   → public/media/about/*

import fs from 'node:fs';
import sharp from 'sharp';

const OUT = 'public/media/about';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// The framed portrait (About page and fallbacks).
const PORTRAIT = '_source/about/portrait-enhanced.webp';
const { width, height } = await sharp(PORTRAIT).metadata();
for (const w of [480, width]) await sharp(PORTRAIT).resize(w).webp({ quality: 90 }).toFile(`${OUT}/portrait-${w}.webp`);
console.log(`about: portrait ${width}×${height}`);

// The cut-out, trimmed to her and doubled (Lanczos) so it holds up on dense screens.
const CUTOUT = '_source/about/portrait-cutout.png';
const trimmed = await sharp(CUTOUT).trim({ threshold: 1 }).png().toBuffer();
const tm = await sharp(trimmed).metadata();
const W = tm.width * 2;
const H = tm.height * 2;
const cut = await sharp(trimmed).resize(W, H, { kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer();
for (const w of [Math.round(W / 2), W]) await sharp(cut, { raw: { width: W, height: H, channels: 4 } }).resize(w).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/cutout-${w}.webp`);

console.log(`about: cut-out ${W}×${H}`);
