import { Folio } from '@/components/folio/Folio';
import { statement } from '@/content/about';
import { folioEntries } from '@/lib/folio';
import { projectColorsCss } from '@/lib/project-colors';

export default function Home() {
  const entries = folioEntries();
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
      {/* The auto-selected project: the page arrives already in its colours. */}
      <style dangerouslySetInnerHTML={{ __html: projectColorsCss(entries[0].slug) }} />
      <section className="grid gap-4 pb-10 pt-12 md:grid-cols-12 md:pb-14 md:pt-20">
        <h1 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.95] md:col-span-8">{statement}</h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-ink-2 md:col-span-4 md:self-end md:justify-self-end">
          Aya Hafez is a fashion designer based in Berlin, ranked first in Fashion Design for four semesters at the German International University. Garments, digital fashion and styling.
        </p>
      </section>
      <Folio entries={entries} />
    </div>
  );
}
