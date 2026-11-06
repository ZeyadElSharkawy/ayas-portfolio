// Cut-outs taken from the source PDFs at high resolution, for the signature interactions:
//   • Cultural Echoes: instrument icons from her poster, with the orange paper removed
//   • Carina Arabesque: her dress flat from "Color Variations", split into recolourable parts
//   • Into Her Skin: a hanging hoop page, with the lavender page removed
//   • Arabia: the calligraphy from her cover, as one deep tone for the page background
//
//   npm run media:cutouts [poster|carina|hoop|calligraphy]   → public/media/<slug>/cutout/*   (needs _source/)

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { pdf } from 'pdf-to-img';

const dirFor = (slug) => {
  const dir = path.join('public/media', slug, 'cutout');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

/** One PDF page as an opaque image at the given pixel width. */
async function renderPage(file, n, width) {
  const probe = await pdf(file, { scale: 1 });
  const { width: pt } = await sharp(await probe.getPage(n)).metadata();
  await probe.destroy();
  const doc = await pdf(file, { scale: width / pt });
  const png = await doc.getPage(n);
  await doc.destroy();
  return sharp(png).flatten({ background: '#fff' }).removeAlpha();
}

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const dist = (d, i, [r, g, b]) => Math.hypot(d[i] - r, d[i + 1] - g, d[i + 2] - b);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Pixels reachable from the image border through pixels `pass` accepts. */
function floodFromEdges(w, h, pass) {
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (p) => {
    if (!seen[p] && pass(p)) {
      seen[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }
  return seen;
}

// ---------------------------------------------------------------- poster icons

/** Rectangles in 1600-wide poster coordinates. */
const ICONS = {
  oud: { rect: [68, 118, 190, 246] },
  // `clear` blanks a neighbouring piece of the poster title that falls inside the rectangle.
  tabla: { rect: [1398, 118, 1539, 276], clear: [1398, 240, 1428, 276] },
  cymbals: { rect: [80, 1208, 196, 1352] },
  'oud-2': { rect: [66, 556, 162, 682] },
  dancers: { rect: [82, 684, 186, 792] },
  raised: { rect: [104, 918, 172, 1064] },
  tambourine: { rect: [74, 368, 162, 548] },
  gramophone: { rect: [88, 1062, 202, 1206] },
  sax: { rect: [76, 1486, 192, 1624] },
  seller: { rect: [68, 1752, 156, 1948] },
  keys: { rect: [80, 2078, 258, 2194] },
};

/** Drops specks of paper texture: solid shapes smaller than `min` pixels. */
function removeSpecks(rgba, w, h, min) {
  const seen = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || rgba[start * 4 + 3] < 40) continue;
    const blob = [start];
    seen[start] = 1;
    for (let k = 0; k < blob.length; k++) {
      const p = blob[k];
      const x = p % w;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (q >= 0 && q < w * h && !seen[q] && rgba[q * 4 + 3] >= 40) {
          seen[q] = 1;
          blob.push(q);
        }
      }
    }
    if (blob.length < min) for (const p of blob) rgba[p * 4 + 3] = 0;
  }
}

async function posterIcons() {
  const scale = 4;
  const page = await renderPage('_source/1 Selected Works/1.1 Cultural Echoes/1.1 Cultural Echoes Poster.pdf', 1, 1600 * scale);
  const buffer = await page.png().toBuffer();
  for (const [id, { rect: [x0, y0, x1, y1], clear }] of Object.entries(ICONS)) {
    const { data, info } = await sharp(buffer)
      .extract({ left: x0 * scale, top: y0 * scale, width: (x1 - x0) * scale, height: (y1 - y0) * scale })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: c } = info;
    const out = Buffer.alloc(w * h * 4);
    for (let p = 0; p < w * h; p++) {
      const [r, g, b] = [data[p * c], data[p * c + 1], data[p * c + 2]];
      // The paper is a bright orange: strong red and clear green, whatever its texture does.
      const paper = Math.min(1, Math.max(0, (Math.min(r - 195, (g - 105) * 1.4) + 8) / 26));
      const px = x0 + (p % w) / scale;
      const py = y0 + Math.floor(p / w) / scale;
      const blank = clear && px >= clear[0] && px < clear[2] && py >= clear[1] && py < clear[3];
      out.set([r, g, b, blank ? 0 : Math.round(255 * (1 - paper))], p * 4);
    }
    removeSpecks(out, w, h, 500);
    const png = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
    await sharp(await sharp(png).trim({ threshold: 1 }).toBuffer())
      .resize({ width: 420, height: 420, fit: 'inside' })
      .webp({ quality: 90, alphaQuality: 95 })
      .toFile(path.join(dirFor('cultural-echoes'), `${id}.webp`));
  }
}

// ---------------------------------------------------------------- Carina flat

/** Her second dress on "Color Variations": cream top, orange yoke, brown placket, teal skirt. */
const FLAT = { rect: [282, 298, 532, 892], embroidery: [[305, 410, 350, 455], [465, 415, 512, 455]], page: 33 };
const PARTS = { top: '#E8DCC3', yoke: '#F27F27', placket: '#5F4131', skirt: '#106B79', neck: '#FFFFFF' };
const PAPER = '#ECE8DF';

async function carinaFlat() {
  const scale = 3;
  const page = await renderPage('_source/1 Selected Works/1.2 Carina Arabesque/1.2 Documentation Booklet .pdf', FLAT.page, 1600 * scale);
  const [x0, y0, x1, y1] = FLAT.rect.map((v) => v * scale);
  const { data, info } = await page.extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const n = w * h;
  const names = Object.keys(PARTS);
  const colours = names.map((k) => rgb(PARTS[k]));
  const paper = rgb(PAPER);

  const outside = floodFromEdges(w, h, (p) => dist(data, p * c, paper) < 16);
  const inBox = (p) => {
    const x = p % w;
    const y = (p / w) | 0;
    return FLAT.embroidery.some(([a, b, cc, d]) => x >= a * scale - x0 && x < cc * scale - x0 && y >= b * scale - y0 && y < d * scale - y0);
  };

  // Every clean pixel goes to its nearest colour; 255 = undecided (lines and their soft edges).
  const EMB = names.length;
  const label = new Uint8Array(n).fill(255);
  for (let p = 0; p < n; p++) {
    if (outside[p]) continue;
    const i = p * c;
    if (lum(data[i], data[i + 1], data[i + 2]) < 50) continue;
    if (inBox(p)) {
      label[p] = dist(data, i, colours[0]) > 34 ? EMB : 0;
      continue;
    }
    let best = 0;
    let bestD = 1e9;
    colours.forEach((col, k) => {
      const d = dist(data, i, col);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    });
    if (bestD < 42) label[p] = best;
  }

  // Thin slivers are soft edges, not parts: keep only labels with solid neighbours, then grow them back.
  const core = new Uint8Array(n).fill(255);
  const R = 3;
  for (let y = R; y < h - R; y++) {
    for (let x = R; x < w - R; x++) {
      const p = y * w + x;
      const l = label[p];
      if (l === 255) continue;
      if (l === EMB || (label[p - R] === l && label[p + R] === l && label[p - R * w] === l && label[p + R * w] === l)) core[p] = l;
    }
  }
  let frontier = [];
  for (let p = 0; p < n; p++) if (core[p] !== 255) frontier.push(p);
  while (frontier.length) {
    const next = [];
    for (const p of frontier) {
      const x = p % w;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (q < 0 || q >= n || core[q] !== 255 || outside[q]) continue;
        core[q] = core[p];
        next.push(q);
      }
    }
    frontier = next;
  }

  const dir = dirFor('carina-arabesque');
  const save = (buffer, name) =>
    sharp(buffer, { raw: { width: w, height: h, channels: 4 } }).resize({ height: 1000 }).webp({ lossless: true }).toFile(path.join(dir, `${name}.webp`));

  for (const [k, name] of [...names, 'embroidery'].entries()) {
    const mask = Buffer.alloc(n * 4, 255);
    for (let p = 0; p < n; p++) mask[p * 4 + 3] = core[p] === k ? 255 : 0;
    await save(mask, name);
  }

  // The drawing itself: how much darker each pixel is than the flat colour of its part.
  const level = [...colours.map(([r, g, b]) => lum(r, g, b)), 150];
  const paperLevel = lum(...paper);
  const line = Buffer.alloc(n * 4);
  for (let p = 0; p < n; p++) {
    const i = p * c;
    const flat = core[p] === 255 ? paperLevel : level[core[p]];
    const a = Math.min(1, Math.max(0, (flat - lum(data[i], data[i + 1], data[i + 2])) / Math.max(30, flat - 28)));
    line.set([20, 14, 12, a < 0.08 ? 0 : Math.round(a * 255)], p * 4);
  }
  await save(line, 'line');
  console.log('carina flat', w, h);
}

// ---------------------------------------------------------------- hanging hoop

async function hoop() {
  const page = await renderPage('_source/1 Selected Works/1.4 Into her Skin/1.4 Into her skin hoop booklet.pdf', 44, 2000);
  const { data, info } = await page.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const corner = (5 * w + 5) * c;
  const bg = [data[corner], data[corner + 1], data[corner + 2]];
  const outside = floodFromEdges(w, h, (p) => dist(data, p * c, bg) < 26);

  // Her printed page number sits on the photo: cover it with the plain backdrop beside it, feathered.
  const [nx0, ny0, nx1, ny1] = [930, 2655, 1050, 2755];
  const shift = 130;
  for (let y = ny0; y < ny1; y++) {
    for (let x = nx0; x < nx1; x++) {
      const edge = Math.min(x - nx0, nx1 - 1 - x, y - ny0, ny1 - 1 - y);
      const t = Math.min(1, edge / 14);
      const at = (y * w + x) * c;
      const from = (y * w + x - shift) * c;
      for (let k = 0; k < 3; k++) data[at + k] = Math.round(data[at + k] * (1 - t) + data[from + k] * t);
    }
  }

  const out = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    // The cord runs off the top of the page; every other page edge goes, or it shows as a hairline.
    const x = p % w;
    const y = (p / w) | 0;
    const edge = x < 8 || x >= w - 8 || y >= h - 8 || (y < 8 && Math.abs(x - w / 2) > w * 0.1);
    out.set([data[p * c], data[p * c + 1], data[p * c + 2], outside[p] || edge ? 0 : 255], p * 4);
  }
  const dir = dirFor('into-her-skin');
  const cut = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  for (const width of [800, 1400]) {
    await sharp(cut).resize({ width }).webp({ quality: 86, alphaQuality: 100 }).toFile(path.join(dir, `hoop-${width}.webp`));
  }
  console.log('hoop', bg, w, h);
}

// ---------------------------------------------------------------- Arabia calligraphy

async function calligraphy() {
  const scale = 3;
  const page = await renderPage('_source/2 Digital Fashion/2.1 Arabia Collection.pdf', 1, 1600 * scale);
  const { width: pw, height: ph } = await page.clone().metadata();
  const left = 840 * scale;
  const { data, info } = await page.extract({ left, top: 0, width: pw - left, height: ph }).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const out = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    const [r, g, b] = [data[p * c], data[p * c + 1], data[p * c + 2]];
    const red = r - g;
    // Letters are strongly red, their shadow is a pale pink; the cover's brown type is neither.
    const letter = Math.min(1, Math.max(0, (red - 62) / 30));
    const shadow = lum(r, g, b) > 130 ? Math.min(1, Math.max(0, (red - 22) / 18)) * 0.38 : 0;
    out.set([66, 6, 18, Math.round(255 * Math.max(letter, shadow))], p * 4);
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .resize({ height: 1800 })
    .webp({ quality: 50, alphaQuality: 70 })
    .toFile(path.join(dirFor('arabia'), 'calligraphy.webp'));
  console.log('calligraphy', w, h);
}

const only = process.argv[2];
if (!only || only === 'poster') await posterIcons();
if (!only || only === 'carina') await carinaFlat();
if (!only || only === 'hoop') await hoop();
if (!only || only === 'calligraphy') await calligraphy();
