// Labelled contact sheets of processed media, for curating content/projects/*.ts.
//
//   node scripts/media/contact-sheet.mjs [slug]   → .cache/sheets/<slug>-<images|docId|videos>.jpg

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { MANIFEST_PATH } from './config.mjs';

const OUT = '.cache/sheets';
const CELL = 220;
const LABEL = 22;
const COLS = 8;

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const only = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const escape = (s) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
const fileFor = (src, widths, fmt = 'webp') => path.join('public', `${src}-${Math.min(...widths)}.${fmt}`);

async function sheet(name, items) {
  if (!items.length) return;
  const tiles = await Promise.all(items.map(async ({ file, label }) => {
    const img = await sharp(file).resize(CELL, CELL - LABEL, { fit: 'contain', background: '#eee' }).toBuffer();
    const text = Buffer.from(
      `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#111"/>`
      + `<text x="4" y="16" font-family="sans-serif" font-size="13" fill="#fff">${escape(label)}</text></svg>`,
    );
    return sharp({ create: { width: CELL, height: CELL, channels: 3, background: '#eee' } })
      .composite([{ input: img, top: 0, left: 0 }, { input: text, top: CELL - LABEL, left: 0 }])
      .png()
      .toBuffer();
  }));
  const rows = Math.ceil(tiles.length / COLS);
  const out = path.join(OUT, `${name}.jpg`);
  await sharp({ create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: '#ccc' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % COLS) * CELL, top: Math.floor(i / COLS) * CELL })))
    .jpeg({ quality: 75 })
    .toFile(out);
  console.log(out);
}

for (const [slug, m] of Object.entries(manifest)) {
  if (only && slug !== only) continue;
  await sheet(`${slug}-images`, Object.entries(m.images ?? {}).map(([id, img]) => ({
    file: fileFor(img.src, img.widths),
    label: img.group ? `${id} · ${img.group}` : id,
  })));
  for (const [doc, d] of Object.entries(m.documents ?? {})) {
    await sheet(`${slug}-${doc}`, d.pages.map((p) => ({ file: fileFor(p.src, p.widths), label: `${doc} p${p.n}` })));
  }
  await sheet(`${slug}-videos`, Object.entries(m.videos ?? {}).map(([id, v]) => ({
    file: path.join('public', v.poster),
    label: `${id} · ${Math.round(v.duration)}s ${v.width}x${v.height}`,
  })));
}
