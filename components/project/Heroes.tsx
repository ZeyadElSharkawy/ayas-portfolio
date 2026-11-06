// Each project opens its own way, drawn from what the work is about. Images come from `heroSet`,
// and the page leaves them out of the sections below so nothing shows twice.
/* eslint-disable @next/next/no-img-element -- small fixed cut-outs, not pipeline images */

import type { ComponentType } from 'react';
import type { Project } from '@/content/types';
import type { ResolvedImage } from '@/lib/media';
import { Picture } from '@/components/media/Picture';
import { ClueHero } from '@/components/project/ClueHero';

type HeroProps = { project: Project; images: ResolvedImage[] };

// ---------------------------------------------------------------- Cultural Echoes

const POSTER_ICONS = ['oud', 'dancers', 'tabla', 'tambourine', 'cymbals', 'gramophone', 'oud-2', 'seller', 'sax', 'raised', 'keys'];

/** Stitched appliqué patches, as on a tent-maker's panel, for the frame. */
const PANEL = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>" +
    "<rect width='48' height='48' fill='#C2531F'/><rect x='48' width='48' height='48' fill='#5A1F33'/><rect y='48' width='48' height='48' fill='#E89A2C'/><rect x='48' y='48' width='48' height='48' fill='#123F30'/>" +
    "<g fill='#F6E3CF'><rect x='14' y='14' width='20' height='20'/><rect x='14' y='14' width='20' height='20' transform='rotate(45 24 24)'/></g>" +
    "<path d='M72 10L86 24L72 38L58 24Z' fill='#E89A2C'/><path d='M24 58L38 72L24 86L10 72Z' fill='#5A1F33'/>" +
    "<g fill='#E89A2C'><rect x='62' y='62' width='20' height='20'/><rect x='62' y='62' width='20' height='20' transform='rotate(45 72 72)'/></g>" +
    "<g fill='none' stroke='#F6E3CF' stroke-width='1' stroke-dasharray='3 3'><rect x='3' y='3' width='42' height='42'/><rect x='51' y='3' width='42' height='42'/><rect x='3' y='51' width='42' height='42'/><rect x='51' y='51' width='42' height='42'/></g></svg>",
)}")`;

/** Her khayamiya as the frame: the photo set into a tent-maker's panel, with a swatch of the real appliqué pinned on. */
function CulturalEchoesHero({ project, images: [photo, swatch] }: HeroProps) {
  return (
    <header>
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pt-10 sm:px-8 lg:grid-cols-12 lg:pt-12">
        <div className="lg:col-span-6">
          <p lang="ar" dir="rtl" className="text-right text-[clamp(2.75rem,6vw,6rem)] leading-[1.15] text-accent lg:text-left">
            {project.titleAr}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.75rem,1.5rem+5vw,6.5rem)] leading-[0.98] tracking-[-0.01em]">{project.title}</h1>
          <p className="mt-6 max-w-[42ch] text-lg font-medium leading-snug sm:text-xl">{project.tagline}</p>
        </div>
        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <div className="relative">
            <div className="p-6 sm:p-12" style={{ backgroundImage: PANEL, backgroundSize: '96px 96px', backgroundPosition: 'center' }}>
              <div className="aspect-[2/3] w-[min(62vw,calc(58svh*0.667))] outline-2 outline-offset-4 outline-dashed outline-[#F6E3CF]">
                <Picture image={photo} sizes="(min-width: 1024px) 30vw, 62vw" priority className="h-full" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-6 w-[30%] -rotate-6 border-[6px] border-[#F6E3CF] sm:-left-14">
              <div className="aspect-square">
                <Picture image={swatch} sizes="12vw" className="h-full [&_img]:object-[50%_38%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="mt-8 overflow-hidden border-y-2 border-dashed border-[#F6E3CF] bg-[#E89A2C] py-3">
        <div className="flex w-max motion-safe:animate-[frieze_70s_linear_infinite]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-12 pr-12">
              {POSTER_ICONS.map((id) => (
                <img key={id} src={`/media/cultural-echoes/cutout/${id}.webp`} alt="" className="h-16 w-auto sm:h-20" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- Glacier

const CRACKS = [
  'M0 150 L120 190 L210 170 L330 260 L470 235 L560 330 L700 300 L820 395 L1000 360',
  'M330 260 L300 370 L350 470 L320 600',
  'M560 330 L640 210 L620 90 L680 0',
  'M820 395 L860 500 L960 600',
  'M210 170 L240 70 L205 0',
  'M700 300 L790 230 L1000 250',
];

/** "Beneath the ice": her photos lie whole under a frozen surface, its cracks running across page and pictures alike. */
function GlacierHero({ project, images: [white, blue] }: HeroProps) {
  const ice = '[mask-image:linear-gradient(180deg,black_60%,transparent)]';
  const frost = 'pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgb(232_238_248/0.5)]';
  return (
    <header className="relative overflow-hidden">
      <div aria-hidden className={`absolute inset-0 ${ice} bg-[url(/media/glacier/clean/ice-1920.webp)] bg-cover bg-center`} />
      <div aria-hidden className={`absolute inset-0 ${ice} bg-[#0F2A5C]/70`} />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pb-14 pt-10 sm:px-8 lg:grid-cols-12 lg:pt-12">
        <div className="lg:col-span-5">
          <h1 className="font-display text-[clamp(3.5rem,2rem+8vw,10rem)] leading-[0.95] tracking-[-0.01em]">{project.title}</h1>
          <p className="mt-5 max-w-[30ch] text-lg font-medium leading-snug sm:text-xl">{project.tagline}</p>
        </div>
        <div className="relative flex items-end justify-center lg:col-span-7 lg:justify-end">
          <div className="relative z-10 -mr-[8%] mb-[-4%] aspect-[2/3] w-[46%] -rotate-3 lg:w-auto lg:h-[min(58svh,40vw)]">
            <Picture image={blue} sizes="(min-width: 1024px) 24vw, 46vw" className="h-full" />
            <div aria-hidden className={frost} />
          </div>
          <div className="relative aspect-[2/3] w-[60%] rotate-1 lg:w-auto lg:h-[min(80svh,52vw)]">
            <Picture image={white} sizes="(min-width: 1024px) 32vw, 60vw" priority className="h-full" />
            <div aria-hidden className={frost} />
          </div>
        </div>
      </div>
      <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 h-full w-full">
        {CRACKS.map((d) => (
          <path key={d} d={d} fill="none" stroke="#E8EEF8" strokeOpacity="0.75" strokeWidth="1" vectorEffect="non-scaling-stroke" className="motion-safe:animate-[fade-in_1400ms_ease-out_both]" />
        ))}
      </svg>
    </header>
  );
}

// ---------------------------------------------------------------- Arabia

const NICHE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150' preserveAspectRatio='none'><path d='M50 0C54 12 76 20 88 36C96 47 100 56 100 68V150H0V68C0 56 4 47 12 36C24 20 46 12 50 0Z'/></svg>",
)}")`;

/** Her three looks, each standing in a niche: the arches of the mosques her calligraphy belongs to. */
function ArabiaHero({ project, images }: HeroProps) {
  return (
    <header className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pt-8 sm:px-8 lg:grid-cols-12 lg:pt-10">
      <div className="lg:col-span-5">
        <h1 className="font-display text-[clamp(2.75rem,1.5rem+5vw,6.5rem)] leading-[0.98] tracking-[-0.01em]">{project.title}</h1>
        <p className="mt-6 max-w-[34ch] text-lg font-medium leading-snug sm:text-xl">{project.tagline}</p>
      </div>
      <div className="flex items-end justify-center gap-2 sm:gap-4 lg:col-span-7">
        {images.map((img, i) => (
          <div key={img.src} className={`relative aspect-[2/3.4] lg:w-auto ${i === 1 ? 'w-[38%] lg:h-[80svh]' : 'w-[30%] lg:h-[66svh]'}`}>
            <div aria-hidden className="absolute inset-0 bg-[#EFE6D2]" style={{ maskImage: NICHE, WebkitMaskImage: NICHE, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }} />
            <div className="absolute inset-x-[6%] bottom-[3%] top-[9%]">
              <Picture image={img} sizes="(min-width: 1024px) 18vw, 32vw" priority={i === 1} fit="contain" placeholder={false} className="h-full" />
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- Identity Breakdown

/** Her look as the film it was made for: a poster in a lit case outside the cinema, and a ticket. */
function IdentityHero({ project, images: [poster] }: HeroProps) {
  return (
    <header className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 pb-12 pt-10 sm:px-8 lg:grid-cols-12 lg:pt-12">
      <div className="lg:col-span-6">
        <h1 className="font-display text-[clamp(2.75rem,1.5rem+5.5vw,7.5rem)] leading-[0.98] tracking-[-0.01em]">{project.title}</h1>
        <p className="ticket mt-8 inline-block max-w-[30ch] -rotate-2 bg-[#F7ECEE] px-8 py-5 text-lg font-semibold leading-snug text-[#5A0A14] sm:text-xl">{project.tagline}</p>
      </div>
      <div className="flex justify-center lg:col-span-6 lg:justify-end">
        <div className="relative bg-[#170708] p-6 sm:p-7">
          <div aria-hidden className="bulbs absolute inset-0" />
          <div aria-hidden className="bulbs bulbs-alt absolute inset-0" />
          <div className="relative aspect-[2637/3413] w-[min(72vw,calc(76svh*0.7726))]">
            <Picture image={poster} sizes="(min-width: 1024px) 36vw, 72vw" priority className="h-full" />
          </div>
        </div>
      </div>
    </header>
  );
}

export const heroes: Record<string, ComponentType<HeroProps>> = {
  'cultural-echoes': CulturalEchoesHero,
  glacier: GlacierHero,
  'clue-styling': ClueHero,
  arabia: ArabiaHero,
  'identity-breakdown': IdentityHero,
};
