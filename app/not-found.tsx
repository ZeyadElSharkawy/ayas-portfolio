import Link from 'next/link';
import { Seam } from '@/components/motif/Seam';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-24 sm:px-8">
      <p className="label text-forest">404</p>
      <h1 className="mt-3 font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 50' }}>
        This thread leads nowhere.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">The page you were looking for isn&rsquo;t in the atelier. It may have moved, or never existed.</p>
      <Seam ends animate className="my-10 max-w-xs" />
      <div className="flex gap-6">
        <Link href="/" className="label stitch-link">
          Back to the atelier
        </Link>
        <Link href="/work" className="label stitch-link">
          See every project
        </Link>
      </div>
    </main>
  );
}
