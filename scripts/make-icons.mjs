// Renders the site icons from app/icon.svg (the needle-and-thread mark):
//   app/favicon.ico (16, 32, 48), app/apple-icon.png (180), public/icons/icon-{192,512}.png
//
//   npm run icons

import fs from 'node:fs';
import sharp from 'sharp';

const SVG = 'app/icon.svg';
const png = (size, { pad = 0, background } = {}) => {
  const inner = size - pad * 2;
  const art = sharp(SVG, { density: (72 * inner) / 16 }).resize(inner, inner);
  if (!pad) return art.png().toBuffer();
  return art
    .png()
    .toBuffer()
    .then((buf) => sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: buf, left: pad, top: pad }]).png().toBuffer());
};

/** An .ico holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
fs.writeFileSync('app/favicon.ico', ico(await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })))));
// Apple adds its own rounded mask, so the touch icon is full-bleed on the green.
fs.writeFileSync('app/apple-icon.png', await sharp(await png(180)).flatten({ background: '#2F5643' }).png().toBuffer());
fs.mkdirSync('public/icons', { recursive: true });
for (const size of [192, 512]) fs.writeFileSync(`public/icons/icon-${size}.png`, await png(size));
// Maskable: the mark inside the safe zone, on the same green.
fs.writeFileSync('public/icons/icon-maskable-512.png', await png(512, { pad: 72, background: '#2F5643' }));
console.log('icons written');
