import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-20 sm:px-8">
      <p className="text-[12px] text-ink-2">404</p>
      <h1 className="mt-2 font-display text-[clamp(44px,7vw,104px)] leading-[0.95]">This page isn’t in the collection.</h1>
      <Link href="/" className="mt-8 inline-block text-[15px] underline decoration-line underline-offset-4 hover:decoration-ink">
        See all work <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
