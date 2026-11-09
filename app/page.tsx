import { Folio } from '@/components/folio/Folio';
import { AboutHero } from '@/components/home/AboutHero';
import { rise } from '@/components/home/rise';
import { SeamParallax } from '@/components/home/SeamParallax';
import { statement } from '@/content/about';
import { folioEntries } from '@/lib/folio';
import { projectColorsCss } from '@/lib/project-colors';

export default function Home() {
  const entries = folioEntries();
  return (
    <>
      {/* The page arrives in the hero's colours; scrolling into the work hands over to the selected project's (Folio). */}
      <style dangerouslySetInnerHTML={{ __html: projectColorsCss('home') }} />
      <AboutHero id="about" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <SeamParallax>
          <section className="grid gap-4 pb-10 pt-12 md:grid-cols-12 md:pb-14 md:pt-16">
            <h2 className="font-display text-[clamp(40px,6.2vw,92px)] leading-[0.95] md:col-span-8" style={rise(120)}>
              {statement}
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-2 md:col-span-4 md:self-end md:justify-self-end" style={rise(50)}>
              Aya Hafez is a fashion designer based in Berlin, ranked first in Fashion Design for four semesters at the German International University. Garments, digital fashion
              and styling.
            </p>
          </section>
        </SeamParallax>
        <Folio entries={entries} heroId="about" />
      </div>
    </>
  );
}
