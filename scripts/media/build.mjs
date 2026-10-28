// Media pipeline: _source/ → public/media/ + content/media.generated.json
//
//   npm run media                      # everything (skips assets whose source is unchanged)
//   npm run media -- --only=images     # images | documents | videos (comma-separated)
//   npm run media -- --project=glacier # one project
//   npm run media -- --force           # rebuild even if unchanged
//
// Output URL conventions (relative to the site root):
//   images     /media/<slug>/img/<id>-<width>.<avif|webp>
//   documents  /media/<slug>/<docId>/p<NNN>-<width>.webp
//   videos     /media/<slug>/video/<id>.mp4   (+ poster /media/<slug>/poster/<id>.webp)

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { pdf } from 'pdf-to-img';
import ffmpegPath from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import {
  SOURCE_DIR, OUTPUT_DIR, MANIFEST_PATH, IMAGE_WIDTHS, PAGE_WIDTHS, VIDEO_MAX_SIZE, projects,
} from './config.mjs';

const run = promisify(execFile);
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const only = args.only ? args.only.split(',') : ['images', 'documents', 'videos'];
const force = 'force' in args;

const IMAGE_EXT = /\.(jpe?g|png|heic)$/i;
const IMAGE_FORMATS = { avif: { quality: 55, effort: 4 }, webp: { quality: 80 } };

const manifest = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) : {};
let failures = 0;

const slugify = (s) => s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Phone exports named by UUID are shortened to their first block.
const imageId = (file) => {
  const id = slugify(path.basename(file));
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id) ? id.slice(0, 8) : id;
};
const sourceKey = (file, extra = '') => {
  const st = fs.statSync(file);
  return `${st.size}-${Math.round(st.mtimeMs)}${extra}`;
};
const toUrl = (p) => '/' + path.relative('public', p).split(path.sep).join('/');
const mkdirFor = (file) => fs.mkdirSync(path.dirname(file), { recursive: true });

function saveManifest() {
  mkdirFor(MANIFEST_PATH);
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n');
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

// Decodes any supported source into an upright raw bitmap.
async function loadUpright(input) {
  let src = input;
  if (typeof input === 'string' && /\.heic$/i.test(input)) {
    src = Buffer.from(await heicConvert({ buffer: fs.readFileSync(input), format: 'JPEG', quality: 0.95 }));
  }
  const { data, info } = await sharp(src).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, raw: { width: info.width, height: info.height, channels: info.channels } };
}

async function describe(img) {
  const blur = await sharp(img.data, { raw: img.raw }).resize(16).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(img.data, { raw: img.raw }).stats();
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join('');
  return {
    width: img.raw.width,
    height: img.raw.height,
    blur: `data:image/webp;base64,${blur.toString('base64')}`,
    color: hex,
  };
}

// Responsive widths that don't upscale. The native width is kept too when it is well above
// the largest candidate that fits (a 1080 px photo would otherwise top out at 640).
const widthsFor = (width, candidates) => {
  const fit = candidates.filter((w) => w <= width);
  if (!fit.length) return [width];
  return width > fit.at(-1) * 1.15 && width < Math.max(...candidates) ? [...fit, width] : fit;
};

async function writeSizes(img, base, widths, formats) {
  for (const w of widths) {
    for (const [fmt, opts] of Object.entries(formats)) {
      const out = `${base}-${w}.${fmt}`;
      mkdirFor(out);
      await sharp(img.data, { raw: img.raw }).resize(w)[fmt](opts).toFile(out);
    }
  }
}

const outputsExist = (base, widths, formats) =>
  widths.every((w) => formats.every((f) => fs.existsSync(`${base}-${w}.${f}`)));

// ---------------------------------------------------------------- images

async function buildImages(project, entry) {
  const { dir, recursive, group } = project.images;
  const root = path.join(SOURCE_DIR, dir);
  const files = fs.readdirSync(root, { recursive: !!recursive })
    .filter((f) => IMAGE_EXT.test(f))
    .sort();

  const prev = entry.images ?? {};
  const images = {};
  const ids = new Set();

  await pool(files, 4, async (rel) => {
    const file = path.join(root, rel);
    const id = imageId(rel);
    if (ids.has(id)) throw new Error(`duplicate image id "${id}" in ${project.slug}`);
    ids.add(id);

    const base = path.join(OUTPUT_DIR, project.slug, 'img', id);
    const key = sourceKey(file);
    const old = prev[id];
    if (!force && old?.key === key && outputsExist(base, old.widths, Object.keys(IMAGE_FORMATS))) {
      images[id] = old;
      return;
    }
    try {
      const img = await loadUpright(file);
      const widths = widthsFor(img.raw.width, IMAGE_WIDTHS);
      await writeSizes(img, base, widths, IMAGE_FORMATS);
      images[id] = {
        src: toUrl(base),
        widths,
        formats: Object.keys(IMAGE_FORMATS),
        ...(await describe(img)),
        ...(group ? { group: group(rel) } : {}),
        source: path.join(dir, rel).split(path.sep).join('/'),
        key,
      };
      console.log(`  img  ${project.slug}/${id} ${img.raw.width}x${img.raw.height}`);
    } catch (err) {
      failures++;
      console.error(`  FAIL img ${project.slug}/${rel}: ${err.message}`);
    }
  });

  entry.images = Object.fromEntries(Object.keys(images).sort().map((k) => [k, images[k]]));

  // Remove outputs of images that were renamed or deleted at the source.
  const imgDir = path.join(OUTPUT_DIR, project.slug, 'img');
  for (const f of fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []) {
    if (!ids.has(f.replace(/-\d+\.\w+$/, ''))) fs.rmSync(path.join(imgDir, f));
  }
}

// ------------------------------------------------------------- documents

async function buildDocument(project, doc, entry) {
  const file = path.join(SOURCE_DIR, doc.file);
  const key = sourceKey(file, doc.pages ? `-${doc.pages.join(',')}` : '');
  const dirOut = path.join(OUTPUT_DIR, project.slug, doc.id);
  const old = entry.documents?.[doc.id];
  const pageBase = (n) => path.join(dirOut, `p${String(n).padStart(3, '0')}`);

  if (!force && old?.key === key && old.pages.every((p) => outputsExist(pageBase(p.n), p.widths, ['webp']))) {
    return old;
  }

  // Probe page 1 at scale 1 (1px = 1pt) to choose a render scale that hits the largest page width.
  const probe = await pdf(file, { scale: 1 });
  const { width: ptWidth } = await sharp(await probe.getPage(1)).metadata();
  const pageCount = probe.length;
  await probe.destroy();
  const scale = Math.min(4, Math.max(0.5, Math.max(...PAGE_WIDTHS) / ptWidth));

  const doc2 = await pdf(file, { scale });
  const numbers = doc.pages ?? Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = [];
  for (const n of numbers) {
    try {
      const img = await loadUpright(await doc2.getPage(n));
      const widths = widthsFor(img.raw.width, PAGE_WIDTHS);
      await writeSizes(img, pageBase(n), widths, { webp: { quality: 82 } });
      pages.push({ n, src: toUrl(pageBase(n)), widths, ...(await describe(img)) });
    } catch (err) {
      failures++;
      console.error(`  FAIL page ${project.slug}/${doc.id} p${n}: ${err.message}`);
    }
  }
  await doc2.destroy();
  console.log(`  doc  ${project.slug}/${doc.id}: ${pages.length}/${pageCount} pages`);
  return { pageCount, pages, source: doc.file, key };
}

// ---------------------------------------------------------------- videos

async function probeVideo(file) {
  const { stdout } = await run(ffprobe.path, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]);
  const info = JSON.parse(stdout);
  const v = info.streams.find((s) => s.codec_type === 'video');
  const [num, den] = v.r_frame_rate.split('/').map(Number);
  const rotate = Math.abs(Number(v.tags?.rotate ?? 0)) % 180 === 90;
  return {
    width: rotate ? v.height : v.width,
    height: rotate ? v.width : v.height,
    fps: num / den,
    duration: Number(info.format.duration),
    hasAudio: info.streams.some((s) => s.codec_type === 'audio'),
  };
}

async function buildVideo(project, video, entry) {
  const file = path.join(SOURCE_DIR, video.file);
  const key = sourceKey(file, `-${video.crop ?? ''}-${video.posterAt ?? ''}`);
  const out = path.join(OUTPUT_DIR, project.slug, 'video', `${video.id}.mp4`);
  const poster = path.join(OUTPUT_DIR, project.slug, 'poster', `${video.id}.webp`);
  const old = entry.videos?.[video.id];
  if (!force && old?.key === key && fs.existsSync(out) && fs.existsSync(poster)) return old;

  const src = await probeVideo(file);
  const filters = [
    ...(video.crop ? [`crop=${video.crop}`] : []),
    `scale=w='min(${VIDEO_MAX_SIZE},iw)':h='min(${VIDEO_MAX_SIZE},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
    ...(src.fps > 30.5 ? ['fps=30'] : []),
  ];
  mkdirFor(out);
  const t0 = Date.now();
  await run(ffmpegPath, [
    '-y', '-v', 'error', '-i', file,
    '-map', '0:v:0', '-map', '0:a:0?',
    '-vf', filters.join(','),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    out,
  ], { maxBuffer: 1 << 26 });

  // Poster from `posterAt`, else 1s in (or the middle of very short clips).
  const at = Math.min(video.posterAt ?? 1, src.duration / 2).toFixed(2);
  const { stdout: frame } = await run(ffmpegPath, [
    '-v', 'error', '-ss', at, '-i', out, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-',
  ], { encoding: 'buffer', maxBuffer: 1 << 28 });
  const img = await loadUpright(frame);
  mkdirFor(poster);
  await sharp(img.data, { raw: img.raw }).resize({ width: Math.min(1280, img.raw.width) }).webp({ quality: 80 }).toFile(poster);
  const meta = await probeVideo(out);

  const sizeMB = +(fs.statSync(out).size / 1e6).toFixed(1);
  console.log(`  vid  ${project.slug}/${video.id}: ${(fs.statSync(file).size / 1e6).toFixed(0)} MB → ${sizeMB} MB `
    + `${meta.width}x${meta.height} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  return {
    src: toUrl(out),
    poster: toUrl(poster),
    width: meta.width,
    height: meta.height,
    duration: +meta.duration.toFixed(2),
    hasAudio: meta.hasAudio,
    sizeMB,
    blur: (await describe(img)).blur,
    source: video.file,
    key,
  };
}

// ------------------------------------------------------------------ main

const selected = args.project ? projects.filter((p) => p.slug === args.project) : projects;
if (!selected.length) throw new Error(`unknown project "${args.project}"`);

for (const project of selected) {
  console.log(`\n${project.slug}`);
  const entry = (manifest[project.slug] ??= {});

  if (only.includes('images') && project.images) await buildImages(project, entry);

  if (only.includes('documents') && project.documents) {
    entry.documents ??= {};
    for (const doc of project.documents) {
      try {
        entry.documents[doc.id] = await buildDocument(project, doc, entry);
      } catch (err) {
        failures++;
        console.error(`  FAIL doc ${project.slug}/${doc.id}: ${err.message}`);
      }
    }
  }

  if (only.includes('videos') && project.videos) {
    entry.videos ??= {};
    for (const video of project.videos) {
      try {
        entry.videos[video.id] = await buildVideo(project, video, entry);
      } catch (err) {
        failures++;
        console.error(`  FAIL vid ${project.slug}/${video.id}: ${err.message.split('\n')[0]}`);
      }
      saveManifest();
    }
  }
  saveManifest();
}

console.log(failures ? `\ndone with ${failures} failure(s)` : '\ndone');
process.exitCode = failures ? 1 : 0;
