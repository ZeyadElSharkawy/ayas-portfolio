// The home page hero. On the left, a hello that changes language (English, Arabic, German), her name,
// what she does and two ways to reach her. On the right she stands cut out of her photo, in the middle
// of that half, her feet on the skills strip that closes the hero (SkillsMarquee). Stacked below
// 1024 px. Colours from her portrait, on the HeroBackdrop glows.

import { contact } from '@/content/cv';
import { intro } from '@/content/about';
import { HelloCycle } from './HelloCycle';
import { HeroBackdrop } from './HeroBackdrop';
import { SkillsMarquee } from './SkillsMarquee';

/** Line icons drawn like the skills strip's. */
const ICON = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const button =
  'inline-flex items-center gap-2.5 rounded-full border border-[#D6C3EA]/25 bg-[#F1E8F4]/[0.06] px-6 py-3.5 text-[16px] font-semibold text-[#F1E8F4] transition-colors hover:border-[#D6C3EA]/60 hover:bg-[#F1E8F4]/[0.12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6C3EA]';

/** `id` lets the work list below tell when the hero has scrolled away (see Folio). */
export function AboutHero({ id }: { id?: string }) {
  return (
    <section id={id} aria-label="About Aya Hafez" data-home-hero="" className="relative isolate -mt-14 overflow-hidden pt-14 text-[#F1E8F4]">
      {/* Starts under the sticky header (pulled up by its height), which is see-through over it (data-home-hero, see globals.css), so the glows run up behind it. */}
      <HeroBackdrop />
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] gap-6 px-4 pt-10 sm:px-8 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-2 lg:gap-12 lg:pt-0 xl:px-16">
        <div className="lg:self-center lg:py-16">
          {/* Sized so "I’m Aya Hafez" stays on one line in half the page. */}
          <h1 className="font-display text-[clamp(52px,7.4vw,112px)] leading-[1.02] tracking-[-0.015em] lg:text-[min(5.9vw,92px)]">
            <span className="block">
              <HelloCycle words={intro.hello} />
            </span>
            <span className="block">I’m {intro.name}</span>
          </h1>
          <p className="mt-6 text-[clamp(24px,2.3vw,34px)] font-medium text-[#D6C3EA]">{intro.role}</p>
          <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-[#CFC1DB]">{intro.text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={contact.cvPdf} download className={button}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" {...ICON}>
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
              </svg>
              Download CV
            </a>
            <a href="#contact" className={button}>
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" {...ICON}>
                <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12z" />
                <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.4} />
              </svg>
              Let’s connect
            </a>
          </div>
        </div>

        {/* She stands in the middle of the right half, sized to the hero (from 1024 px, 86% of the row, however tall the text makes it). Made by `npm run media:about` from her photo with the background removed. */}
        <div className="relative flex justify-center self-end lg:self-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element -- pipeline output, served as is */}
          <img
            src="/media/about/cutout-772.webp"
            srcSet="/media/about/cutout-386.webp 386w, /media/about/cutout-772.webp 772w"
            sizes="(min-width: 1024px) 340px, 60vw"
            width={772}
            height={1694}
            alt="Aya Hafez, smiling, holding a camera, in a striped shirt dress and navy hijab"
            fetchPriority="high"
            draggable={false}
            className="h-[min(64svh,560px)] w-auto max-w-none select-none lg:absolute lg:bottom-0 lg:left-1/2 lg:h-[86%] lg:-translate-x-1/2"
          />
        </div>
      </div>
      <SkillsMarquee />
    </section>
  );
}
