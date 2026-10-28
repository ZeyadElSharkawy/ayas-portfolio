// Maps the raw Drive mirror in _source/ to web-ready media in public/media/.
// Each project lists where its images, documents (PDF booklets/decks) and videos come from.
// Paths are relative to _source/.

export const SOURCE_DIR = '_source';
export const OUTPUT_DIR = 'public/media';
export const MANIFEST_PATH = 'content/media.generated.json';

export const IMAGE_WIDTHS = [640, 1280, 1920];
export const PAGE_WIDTHS = [800, 1600];
export const VIDEO_MAX_SIZE = 1920; // longest edge
// Per-video options: `crop` (ffmpeg crop=w:h:x:y, applied before scaling), `posterAt` (seconds; default 1).

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const projects = [
  {
    slug: 'cultural-echoes',
    images: { dir: '1 Selected Works/1.1 Cultural Echoes' },
    documents: [
      // Booklet photos (pp. 8–63) are marked "do not use" until Aya confirms otherwise.
      { id: 'booklet', file: '1 Selected Works/1.1 Cultural Echoes/1.1 Cultural Echoes Booklet (do not use these pics).pdf', pages: [...range(1, 7), 64] },
      { id: 'poster', file: '1 Selected Works/1.1 Cultural Echoes/1.1 Cultural Echoes Poster.pdf' },
    ],
    videos: [
      { id: 'film', file: '1 Selected Works/1.1 Cultural Echoes/1.1 Full Video .mp4' },
      // Vertical footage exported inside a 16:9 frame; crop off the black side bars.
      { id: 'trailer', file: '1 Selected Works/1.1 Cultural Echoes/1.1 Trailer.mp4', crop: '840:1440:860:0', posterAt: 15.7 },
      { id: 'outfit-details', file: '1 Selected Works/1.1 Cultural Echoes/1.1 Outfit Details video.mp4' },
    ],
  },
  {
    slug: 'carina-arabesque',
    images: { dir: '1 Selected Works/1.2 Carina Arabesque' },
    documents: [
      { id: 'booklet', file: '1 Selected Works/1.2 Carina Arabesque/1.2 Documentation Booklet .pdf', pages: range(1, 49) },
    ],
    videos: [{ id: 'film', file: '1 Selected Works/1.2 Carina Arabesque/2.mp4', posterAt: 7.8 }],
  },
  {
    // Carte Blanche installation, documented at the back of the Carina booklet.
    slug: 'in-honor-of-our-women',
    documents: [
      { id: 'booklet', file: '1 Selected Works/1.2 Carina Arabesque/1.2 Documentation Booklet .pdf', pages: range(50, 69) },
    ],
  },
  {
    slug: 'glacier',
    images: { dir: '1 Selected Works/1.3 Glacier', recursive: true },
    documents: [{ id: 'booklet', file: '1 Selected Works/1.3 Glacier/1.3 glacier booklet.pdf' }],
    videos: [{ id: 'film', file: '1 Selected Works/1.3 Glacier/1.3 Final Video.mp4' }],
  },
  {
    slug: 'into-her-skin',
    documents: [{ id: 'booklet', file: '1 Selected Works/1.4 Into her Skin/1.4 Into her skin hoop booklet.pdf' }],
    videos: [{ id: 'interview', file: '1 Selected Works/1.4 Into her Skin/1.4 Shahenda Interview.mp4' }],
  },
  {
    slug: 'arabia',
    documents: [{ id: 'deck', file: '2 Digital Fashion/2.1 Arabia Collection.pdf' }],
    videos: [
      { id: 'abaya-render', file: '2 Digital Fashion/2.1 Abaya rendered video.mp4', posterAt: 10.7 },
      { id: 'walk-unrendered', file: '2 Digital Fashion/2.1 garment 3 walk unrendered.mp4', posterAt: 13.5 },
      { id: 'turntable-abaya', file: '2 Digital Fashion/2.1 Turntable Abaya .mp4' },
      { id: 'turntable-shirt', file: '2 Digital Fashion/2.1 Turntable shirt.mp4' },
    ],
  },
  {
    slug: 'identity-breakdown',
    documents: [
      { id: 'deck', file: '2 Digital Fashion/2.2 Identity Breakdown.pdf' },
      { id: 'moodboard', file: '2 Digital Fashion/2.2 Identity Breakdown  Moodboard.pdf' },
    ],
  },
  {
    slug: 'clue-styling',
    images: {
      dir: '3 Fashion Styling',
      // Phone screenshots of clue.eg vs. the editorial shoot.
      group: (file) => (/\.png$/i.test(file) ? 'screenshot' : 'editorial'),
    },
    videos: [
      { id: 'reel-1', file: '3 Fashion Styling/copy_C4FFA637-717E-4311-AA9E-E6A656AEC777.mov' },
      { id: 'reel-2', file: '3 Fashion Styling/copy_F14EDB28-88B4-432A-9361-514DC871C383.mov' },
    ],
  },
];
