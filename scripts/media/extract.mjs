// Takes the work itself out of her booklets and decks, so pages show garments, renders and sketches
// instead of slides. Two methods, chosen per item in clean-specs.mjs:
//   • `image`: the original picture embedded in the PDF, by its order on the page (clean and sharpest)
//   • `rect`:  a region of a high-resolution page render, for pages that are flattened or vector.
//              `erase` paints over titles and labels with the page's own background first.
//              `spread` sets the facing page beside it; `lift` takes a drawing off its white page.
//              `src` crops a picture file instead of a PDF page; `mend` covers a mark on a shaded ground.
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

/** A page with the one facing it set beside it, for work she laid across a spread. `seam` is the fraction of the facing page's inner edge left out (its white trim line). */
async function spreadPng(slug, file, n, seam) {
  const out = path.join(CACHE, `${slug}-${path.basename(file).replace(/\W+/g, '-')}-p${n}-spread.png`);
  if (fs.existsSync(out)) return out;
  const [left, right] = [await pagePng(slug, file, n), await pagePng(slug, file, n + 1)];
  const { width, height } = await sharp(left).metadata();
  const skip = Math.round(width * seam);
  const facing = await sharp(right).extract({ left: skip, top: 0, width: width - skip, height }).png().toBuffer();
  await sharp({ create: { width: width * 2 - skip, height, channels: 3, background: '#fff' } })
    .composite([{ input: left, left: 0, top: 0 }, { input: facing, left: width, top: 0 }])
    .png()
    .toFile(out);
  return out;
}

/**
 * Lifts a drawing off its white page: the paper around it turns transparent, the paper inside its
 * outlines stays. `gap` (px of the page render) is how wide a break in a line may be before the
 * paper behind it counts as outside too.
 */
async function liftOff(png, gap = 0) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;
  /** How far a pixel is from white paper, 0–255. */
  const ink = (i) => 255 - Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const paper = new Uint8Array(n);
  for (let i = 0; i < n; i++) paper[i] = ink(i) < 18 ? 1 : 0;

  // Lines thickened by `gap`, so the flood below can't slip through breaks in a sketchy outline.
  let open = paper;
  if (gap) {
    const walls = await sharp(Buffer.from(paper.map((p) => (p ? 0 : 255))), { raw: { width: w, height: h, channels: 1 } })
      .blur(Math.max(0.3, gap / 2))
      .threshold(8)
      .raw()
      .toBuffer();
    open = new Uint8Array(n);
    for (let i = 0; i < n; i++) open[i] = paper[i] && !walls[i] ? 1 : 0;
  }

  // Flood in from the edges.
  const outside = new Uint8Array(n);
  let frontier = [];
  const enter = (i, allowed) => {
    if (allowed[i] && !outside[i]) {
      outside[i] = 1;
      frontier.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    enter(x, open);
    enter((h - 1) * w + x, open);
  }
  for (let y = 0; y < h; y++) {
    enter(y * w, open);
    enter(y * w + w - 1, open);
  }
  const spread = (allowed, rounds = Infinity) => {
    for (let round = 0; frontier.length && round < rounds; round++) {
      const from = frontier;
      frontier = [];
      for (const i of from) {
        const x = i % w;
        if (x > 0) enter(i - 1, allowed);
        if (x < w - 1) enter(i + 1, allowed);
        if (i >= w) enter(i - w, allowed);
        if (i < n - w) enter(i + w, allowed);
      }
    }
  };
  const reached = [];
  if (gap) {
    // Keep every reached pixel as a starting point for growing back up to the lines.
    const from = frontier;
    spread(open);
    for (let i = 0; i < n; i++) if (outside[i]) reached.push(i);
    frontier = reached.length ? reached : from;
    spread(paper, gap * 2);
  } else {
    spread(paper);
  }

  // Clear the paper; where a line meets it, keep the line's own colour and let its soft edge fade out.
  const out = Buffer.from(data);
  for (let i = 0; i < n; i++) {
    if (outside[i]) {
      out[i * 4 + 3] = 0;
      continue;
    }
    const x = i % w;
    const y = (i - x) / w;
    let edge = false;
    for (let dy = -1; dy <= 1 && !edge; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < w && yy >= 0 && yy < h && outside[yy * w + xx]) {
          edge = true;
          break;
        }
      }
    }
    if (!edge) continue;
    let strongest = i;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue;
        const j = yy * w + xx;
        if (!outside[j] && ink(j) > ink(strongest)) strongest = j;
      }
    }
    if (ink(strongest) < 24) continue;
    out[i * 4] = data[strongest * 4];
    out[i * 4 + 1] = data[strongest * 4 + 1];
    out[i * 4 + 2] = data[strongest * 4 + 2];
    out[i * 4 + 3] = Math.round(255 * Math.min(1, ink(i) / ink(strongest)));
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

const fraction = (rect, w, h) => {
  const [l, t, r, b] = rect;
  return { left: Math.round(l * w), top: Math.round(t * h), width: Math.round((r - l) * w), height: Math.round((b - t) * h) };
};

/** A rendered page region, with labels painted out in the colour next to them. */
async function fromRender(png, item) {
  const { data, info } = await sharp(png).rotate(item.rotate ?? 0).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  // `mend` covers a mark on a soft, shaded ground: each row runs from the colour at the box's left edge to the colour at its right.
  for (const rect of item.mend ?? []) {
    const box = fraction(rect, w, h);
    const right = box.left + box.width;
    /** The ground beside the box: a few pixels out, a few rows up and down, averaged so no streaks carry across. */
    const beside = (x0, y) => {
      const sum = [0, 0, 0];
      let count = 0;
      for (let yy = Math.max(0, y - 3); yy <= Math.min(h - 1, y + 3); yy++) {
        for (let x = Math.max(0, x0); x < Math.min(w, x0 + 8); x++, count++) for (let k = 0; k < 3; k++) sum[k] += data[(yy * w + x) * c + k];
      }
      return sum.map((v) => v / count);
    };
    for (let y = box.top; y < box.top + box.height; y++) {
      const [from, to] = [beside(box.left - 8, y), beside(right, y)];
      for (let x = box.left; x < right; x++) {
        const f = (x - box.left + 0.5) / box.width;
        for (let k = 0; k < 3; k++) data[(y * w + x) * c + k] = Math.round(from[k] + (to[k] - from[k]) * f);
      }
    }
  }
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
async function finish(img, { trim, bg, pad = 0, lift }) {
  let out = lift ? await liftOff(img, lift === true ? 0 : lift) : img;
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
      const source = path.join('_source', item.src ?? item.file ?? file);
      // `src` is a picture file of its own (a poster saved as an image), used as it is.
      const png = item.src ? source : item.spread ? await spreadPng(slug, source, item.page, item.spread) : await pagePng(slug, source, item.page);
      raw = await fromRender(png, item);
    }
    entry[item.id] = await write(slug, item.id, item.tile ? await mirrorTile(raw) : await finish(raw, item));
    // Transparent pieces: nothing may sit behind them while they load.
    if (item.round || item.alpha || item.lift) Object.assign(entry[item.id], { blur: '', color: 'transparent' });
  }
  if (task) await task.destroy();
  console.log(`${slug}: ${items.length} items`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
process.exit(0);
