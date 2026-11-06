// Takes the work itself out of her booklets and decks, so pages show garments, renders and sketches
// instead of slides. Two methods, chosen per item in clean-specs.mjs:
//   • `image`: the original picture embedded in the PDF, by its order on the page (clean and sharpest)
//   • `rect`:  a region of a high-resolution page render, for pages that are flattened or vector.
//              `erase` paints over titles and labels with the page's own background first.
//
//   npm run media:clean [slug]   → public/media/<slug>/clean/*, content/clean.generated.json

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { pdf } from 'pdf-to-img';
import { sources } from './clean-specs.mjs';

const require = createRequire(import.meta.url);
const pdfjsPath = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'legacy/build/pdf.mjs');
const pdfjs = await import(`file:///${pdfjsPath.replaceAll('\\', '/')}`);

const MANIFEST = 'content/clean.generated.json';
const CACHE = '.cache/pages';
const WIDTHS = [640, 1280, 1920];
const RENDER_WIDTH = 3200;

const toUrl = (p) => p.replace(/^public/, '').replaceAll('\\', '/');
const widthsFor = (width) => {
  const fit = WIDTHS.filter((w) => w <= width);
  return fit.length ? (width > fit.at(-1) * 1.15 && width < WIDTHS.at(-1) ? [...fit, width] : fit) : [width];
};

/** One PDF page as a PNG file at RENDER_WIDTH, kept in .cache between runs. */
async function pagePng(slug, file, n) {
  fs.mkdirSync(CACHE, { recursive: true });
  const out = path.join(CACHE, `${slug}-${path.basename(file).replace(/\W+/g, '-')}-p${n}.png`);
  if (fs.existsSync(out)) return out;
  const probe = await pdf(file, { scale: 1 });
  const { width: pt } = await sharp(await probe.getPage(n)).metadata();
  await probe.destroy();
  const doc = await pdf(file, { scale: RENDER_WIDTH / pt });
  fs.writeFileSync(out, await sharp(await doc.getPage(n)).flatten({ background: '#fff' }).png().toBuffer());
  await doc.destroy();
  return out;
}

/** The raster images painted on a page, in order, skipping repeats. */
async function embeddedImages(doc, n) {
  const page = await doc.getPage(n);
  const ops = await page.getOperatorList();
  const seen = new Set();
  const images = [];
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue;
    const name = ops.argsArray[i][0];
    if (seen.has(name)) continue;
    seen.add(name);
    images.push(await new Promise((res) => (page.objs.has(name) ? res(page.objs.get(name)) : page.objs.get(name, res))));
  }
  return images;
}

const fraction = (rect, w, h) => {
  const [l, t, r, b] = rect;
  return { left: Math.round(l * w), top: Math.round(t * h), width: Math.round((r - l) * w), height: Math.round((b - t) * h) };
};

/** A rendered page region, with labels painted out in the colour next to them. */
async function fromRender(png, item) {
  const { data, info } = await sharp(png).rotate(item.rotate ?? 0).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  for (const rect of item.erase ?? []) {
    const box = fraction(rect, w, h);
    // Next to the label, or the page corner where the label sits against the artwork.
    const sample = item.fill === 'corner' ? (60 * w + 60) * c : (Math.max(0, box.top - 3) * w + Math.max(0, box.left - 3)) * c;
    const colour = [data[sample], data[sample + 1], data[sample + 2]];
    for (let y = box.top; y < Math.min(h, box.top + box.height); y++) {
      for (let x = box.left; x < Math.min(w, box.left + box.width); x++) data.set(colour, (y * w + x) * c);
    }
  }
  const cut = fraction(item.rect ?? [0, 0, 1, 1], w, h);
  let img = await sharp(data, { raw: { width: w, height: h, channels: c } }).extract(cut).png().toBuffer();
  if (item.round) {
    const { width, height } = cut;
    const mask = Buffer.from(`<svg width="${width}" height="${height}"><ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2}" ry="${height / 2}" fill="#fff"/></svg>`);
    img = await sharp(img).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  }
  return img;
}

async function fromEmbedded(image, item) {
  if (!image?.data) throw new Error(`no image data for ${item.id}`);
  const channels = image.kind === 2 ? 3 : 4;
  let img = await sharp(Buffer.from(image.data), { raw: { width: image.width, height: image.height, channels } }).png().toBuffer();
  if (item.cut) {
    const { width, height } = await sharp(img).metadata();
    img = await sharp(img).extract(fraction(item.cut, width, height)).png().toBuffer();
  }
  return img;
}

/** Trims empty margins, then lays the piece on `bg` with a little air around it. */
async function finish(img, { trim, bg, pad = 0 }) {
  let out = img;
  if (trim) out = await sharp(out).trim({ threshold: trim === true ? 12 : trim }).png().toBuffer();
  if (pad) {
    const { width, height } = await sharp(out).metadata();
    const p = Math.round(Math.max(width, height) * pad);
    out = await sharp(out).extend({ top: p, bottom: p, left: p, right: p, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  }
  if (bg) out = await sharp(out).flatten({ background: bg }).png().toBuffer();
  return out;
}

/** Four mirrored copies, so a texture repeats across a page without seams. */
async function mirrorTile(png) {
  const { width, height } = await sharp(png).metadata();
  const flop = await sharp(png).flop().png().toBuffer();
  const flip = await sharp(png).flip().png().toBuffer();
  const both = await sharp(png).flip().flop().png().toBuffer();
  return sharp({ create: { width: width * 2, height: height * 2, channels: 3, background: '#000' } })
    .composite([
      { input: png, left: 0, top: 0 },
      { input: flop, left: width, top: 0 },
      { input: flip, left: 0, top: height },
      { input: both, left: width, top: height },
    ])
    .png()
    .toBuffer();
}

async function write(slug, id, png) {
  const dir = path.join('public/media', slug, 'clean');
  fs.mkdirSync(dir, { recursive: true });
  const { width, height } = await sharp(png).metadata();
  const widths = widthsFor(width);
  const base = path.join(dir, id);
  for (const w of widths) await sharp(png).resize({ width: w }).webp({ quality: 84, alphaQuality: 90 }).toFile(`${base}-${w}.webp`);
  const blur = await sharp(png).resize(16).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(png).flatten({ background: '#ffffff' }).stats();
  return {
    src: toUrl(base),
    widths,
    formats: ['webp'],
    width,
    height,
    blur: `data:image/webp;base64,${blur.toString('base64')}`,
    color: `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`,
  };
}

const only = process.argv[2];
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

for (const { slug, file, items } of sources) {
  if (only && only !== slug) continue;
  const entry = (manifest[slug] ??= {});
  const needsPdf = items.some((i) => i.image);
  const task = needsPdf ? pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(path.join('_source', file))), verbosity: 0 }) : null;
  const doc = task ? await task.promise : null;
  const onPage = new Map();
  for (const item of items) {
    let raw;
    if (item.image) {
      if (!onPage.has(item.page)) onPage.set(item.page, await embeddedImages(doc, item.page));
      raw = await fromEmbedded(onPage.get(item.page)[item.image - 1], item);
    } else {
      raw = await fromRender(await pagePng(slug, path.join('_source', item.file ?? file), item.page), item);
    }
    entry[item.id] = await write(slug, item.id, item.tile ? await mirrorTile(raw) : await finish(raw, item));
    // Transparent pieces: nothing may sit behind them while they load.
    if (item.round || item.alpha) Object.assign(entry[item.id], { blur: '', color: 'transparent' });
  }
  if (task) await task.destroy();
  console.log(`${slug}: ${items.length} items`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
process.exit(0);
