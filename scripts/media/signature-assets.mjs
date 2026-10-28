// Assets the Phase 4 signature interactions need beyond the main pipeline (PLAN.md §15):
//   • crops of single renders out of deck pages (Identity Breakdown's cinema reel)
//   • In Honor of Our Women: each line portrait traced into stitch paths, plus her handwritten
//     tribute cropped from the same page
//
//   npm run media:signature   → public/media/<slug>/sig/*, content/signature.generated.json
//
// Reads the 1600 px pages the main pipeline already rendered, so run `npm run media` first.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT_JSON = 'content/signature.generated.json';
const pagePath = (slug, doc, n) => `public/media/${slug}/${doc}/p${String(n).padStart(3, '0')}-1600.webp`;
const sigBase = (slug, id) => `public/media/${slug}/sig/${id}`;
const toUrl = (p) => p.replace(/^public/, '').replaceAll('\\', '/');

/** Rectangles are fractions of the page: [x0, y0, x1, y1]. */
const CROPS = {
  'identity-breakdown': [
    { id: 'gown-black', doc: 'deck', n: 10, rect: [0.229, 0.124, 0.521, 0.925] },
    { id: 'gown-pink', doc: 'deck', n: 10, rect: [0.566, 0.124, 0.848, 0.925] },
    { id: 'cinema', doc: 'deck', n: 11, rect: [0.476, 0.084, 0.839, 0.914] },
    { id: 'closeup', doc: 'deck', n: 12, rect: [0.495, 0.068, 0.86, 0.898] },
    { id: 'final', doc: 'deck', n: 14, rect: [0.592, 0.003, 0.997, 0.997] },
  ],
};

/** Portrait pages: the pink line portrait and the black handwritten tribute share each page. */
const PORTRAITS = {
  'in-honor-of-our-women': [
    { id: 'doria', n: 59 },
    { id: 'hekmat', n: 58 },
    { id: 'mennatallah', n: 61 },
    { id: 'hala', n: 60 },
  ],
};

fs.mkdirSync('public/media', { recursive: true });
const out = {};

async function writeCrop(input, base, { width, height }) {
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const widths = [640, 1280].filter((w) => w < width);
  widths.push(width);
  for (const w of widths) await sharp(input).resize(w).webp({ quality: 82 }).toFile(`${base}-${w}.webp`);
  const tiny = await sharp(input).resize(16).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(input).stats();
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
  return { src: toUrl(base), widths, formats: ['webp'], width, height, blur: `data:image/webp;base64,${tiny.toString('base64')}`, color: hex };
}

// ---------------------------------------------------------------- crops

for (const [slug, crops] of Object.entries(CROPS)) {
  out[slug] ??= { crops: {} };
  for (const c of crops) {
    const file = pagePath(slug, c.doc, c.n);
    const { width: W, height: H } = await sharp(file).metadata();
    const [x0, y0, x1, y1] = c.rect;
    const region = { left: Math.round(x0 * W), top: Math.round(y0 * H), width: Math.round((x1 - x0) * W), height: Math.round((y1 - y0) * H) };
    const buf = await sharp(file).extract(region).toBuffer();
    out[slug].crops[c.id] = await writeCrop(buf, sigBase(slug, c.id), region);
    console.log(`  crop ${slug}/${c.id} ${region.width}x${region.height}`);
  }
}

// ---------------------------------------------------------------- portraits

const isPink = (r, g, b) => r > 150 && r - g > 60 && b - g > 10;
const isInk = (r, g, b) => r + g + b < 300 && Math.max(r, g, b) - Math.min(r, g, b) < 36;

function bbox(data, W, H, test, pad) {
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      if (test(data[i], data[i + 1], data[i + 2])) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/** Zhang–Suen thinning: reduces the drawn line to a one-pixel skeleton to walk along. */
function thin(m, w, h) {
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : m[y * w + x]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const pass of [0, 1]) {
      const kill = [];
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          if (!m[y * w + x]) continue;
          const p = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
          const b = p.reduce((s, v) => s + v, 0);
          if (b < 2 || b > 6) continue;
          let a = 0;
          for (let k = 0; k < 8; k++) if (!p[k] && p[(k + 1) % 8]) a++;
          if (a !== 1) continue;
          if (pass === 0 ? p[0] * p[2] * p[4] || p[2] * p[4] * p[6] : p[0] * p[2] * p[6] || p[0] * p[4] * p[6]) continue;
          kill.push(y * w + x);
        }
      for (const i of kill) m[i] = 0;
      if (kill.length) changed = true;
    }
  }
}

/** Walks the skeleton into polylines in drawing order: follow the line, then jump to the nearest loose end. */
function walk(m, w, h) {
  const N = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const left = new Set();
  for (let i = 0; i < m.length; i++) if (m[i]) left.add(i);
  const degree = (i) => {
    const x = i % w, y = (i / w) | 0;
    let d = 0;
    for (const [dx, dy] of N) if (left.has((y + dy) * w + x + dx) && x + dx >= 0 && x + dx < w) d++;
    return d;
  };
  const paths = [];
  let cur = [...left].reduce((best, i) => (i < best ? i : best), Infinity); // top-most first
  while (left.size) {
    // Prefer starting at a loose end near where the needle is.
    const cx = cur % w, cy = (cur / w) | 0;
    let start = -1, bestD = Infinity;
    for (const i of left) {
      const d = (i % w - cx) ** 2 + (((i / w) | 0) - cy) ** 2 + (degree(i) === 1 ? 0 : 40);
      if (d < bestD) { bestD = d; start = i; }
    }
    const line = [];
    let at = start, dir = null;
    while (at >= 0) {
      left.delete(at);
      const x = at % w, y = (at / w) | 0;
      line.push([x, y]);
      let next = -1, score = -Infinity;
      for (const [dx, dy] of N) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        const j = ny * w + nx;
        if (!left.has(j)) continue;
        const s = (dir ? dx * dir[0] + dy * dir[1] : 0) - (dx && dy ? 0.3 : 0);
        if (s > score) { score = s; next = j; }
      }
      if (next >= 0) dir = [(next % w) - x, ((next / w) | 0) - y];
      at = next;
    }
    cur = line.length ? line.at(-1)[1] * w + line.at(-1)[0] : start;
    if (line.length >= 6) paths.push(line);
  }
  return paths;
}

function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts.at(-1);
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let max = 0, at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > max) { max = d; at = i; }
  }
  return max > eps ? [...simplify(pts.slice(0, at + 1), eps).slice(0, -1), ...simplify(pts.slice(at), eps)] : [pts[0], pts.at(-1)];
}

for (const [slug, list] of Object.entries(PORTRAITS)) {
  out[slug] ??= {};
  out[slug].portraits = {};
  for (const p of list) {
    const file = pagePath(slug, 'booklet', p.n);
    const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H } = info;

    // The tribute: ink, cropped as an image (her handwriting stays hers).
    const textBox = bbox(data, W, H, isInk, 14);
    const tribute = await writeCrop(await sharp(file).extract(textBox).toBuffer(), sigBase(slug, `${p.id}-tribute`), textBox);

    // The portrait: pink line, traced at a working scale where the line is ~1–2 px wide.
    const box = bbox(data, W, H, isPink, 6);
    const SCALE = 0.75;
    const w = Math.round(box.width * SCALE), h = Math.round(box.height * SCALE);
    const small = await sharp(file).extract(box).resize(w, h).removeAlpha().raw().toBuffer();
    const m = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) m[i] = isPink(small[i * 3], small[i * 3 + 1], small[i * 3 + 2]) ? 1 : 0;
    thin(m, w, h);
    const paths = walk(m, w, h).map((l) => simplify(l, 0.6).map(([x, y]) => [+(x / w * 1000).toFixed(1), +(y / w * 1000).toFixed(1)]));
    const points = paths.reduce((s, l) => s + l.length, 0);

    out[slug].portraits[p.id] = { aspect: +(w / h).toFixed(4), paths, tribute };
    console.log(`  trace ${slug}/${p.id} ${paths.length} lines, ${points} points; tribute ${textBox.width}x${textBox.height}`);
  }
}

fs.writeFileSync(OUT_JSON, JSON.stringify(out));
console.log(`\nwrote ${OUT_JSON} (${(fs.statSync(OUT_JSON).size / 1024).toFixed(0)} KB)`);
