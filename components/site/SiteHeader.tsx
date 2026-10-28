import Link from 'next/link';
import { STITCH } from '@/components/motif/StitchPage';
import { SoundToggle } from '@/components/site/Sound';

/** Header for the non-3D pages. The atelier (/) has its own overlay header. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-dashed border-seam bg-beige/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link href="/" transitionTypes={STITCH} className="shrink-0 font-display text-lg leading-none font-light whitespace-nowrap sm:text-xl" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 50' }}>
          Aya Hafez
        </Link>
        <nav aria-label="Site" className="flex items-center gap-3.5 sm:gap-5">
          {/* On phones the wordmark is the way back to the atelier. */}
          <Link href="/" transitionTypes={STITCH} className="label stitch-link hidden py-2 sm:inline">
            Atelier
          </Link>
          <Link href="/work" transitionTypes={STITCH} className="label stitch-link py-2">
            Aya&apos;s work
          </Link>
          <Link href="/about" transitionTypes={STITCH} className="label stitch-link py-2">
            About
          </Link>
          <SoundToggle className="stitch-link py-2" />
        </nav>
      </div>
    </header>
  );
}
