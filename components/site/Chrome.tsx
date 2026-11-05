// Header and footer. CV and contact sit in the header on every page, so a recruiter is always one click away.

import Link from 'next/link';
import { contact } from '@/content/cv';

const navLink = 'text-ink-2 transition-colors hover:text-ink';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" className="font-serif text-[22px] leading-none tracking-tight">
          Aya Hafez
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-[13px] sm:gap-7">
          <Link href="/" className={navLink}>Work</Link>
          <Link href="/about" className={navLink}>About</Link>
          <a href={contact.cvPdf} download className={navLink}>
            CV <span aria-hidden>↓</span>
          </a>
          <a href="#contact" className="rounded-full border border-ink px-3 py-1 text-ink transition-colors hover:bg-ink hover:text-paper">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="text-[13px] text-ink-2">Open to internships in fashion design</p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-3 block break-all font-serif text-[clamp(32px,5vw,64px)] leading-[1.02] tracking-tight underline decoration-line decoration-1 underline-offset-[0.18em] transition-colors hover:decoration-ink"
          >
            {contact.email}
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-[14px] md:col-span-5 md:self-end">
          <div>
            <dt className="text-[12px] text-ink-3">Based in</dt>
            <dd className="mt-1">{contact.location}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-3">Phone</dt>
            <dd className="mt-1"><a href={contact.phone.href} className="hover:underline">{contact.phone.display}</a></dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-3">WhatsApp</dt>
            <dd className="mt-1"><a href={contact.whatsapp.href} className="hover:underline">{contact.whatsapp.display}</a></dd>
          </div>
          <div>
            <dt className="text-[12px] text-ink-3">Résumé</dt>
            <dd className="mt-1"><a href={contact.cvPdf} download className="hover:underline">Download CV (PDF)</a></dd>
          </div>
        </dl>
      </div>
      <div className="mx-auto flex max-w-[1440px] justify-between px-4 pb-8 text-[12px] text-ink-3 sm:px-8">
        <span>© {new Date().getFullYear()} Aya Hafez</span>
        <a href="#main" className="hover:text-ink">Back to top ↑</a>
      </div>
    </footer>
  );
}
