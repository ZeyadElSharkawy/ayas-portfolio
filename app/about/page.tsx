import type { Metadata } from 'next';
import Link from 'next/link';
import { aboutText } from '@/content/about';
import { activities, contact, courses, education, experience, languages, skills, software, summary, type Role } from '@/content/cv';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Seam } from '@/components/motif/Seam';
import { StitchPage, STITCH } from '@/components/motif/StitchPage';
import { jsonLdHtml, openGraphBase, personJsonLd } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: summary,
  alternates: { canonical: '/about' },
  openGraph: { ...openGraphBase, type: 'profile', title: 'About Aya Hafez', description: summary, url: '/about' },
};

export default function AboutPage() {
  const intro = aboutText.slice(0, -1);
  const question = aboutText.at(-1);

  return (
    <StitchPage>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-8 lg:pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(personJsonLd())} />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <section aria-labelledby="about-title">
            <p className="label text-forest">About the designer</p>
            <h1
              id="about-title"
              className="mt-3 font-display text-display font-light tracking-[-0.03em]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
            >
              Aya Hafez
            </h1>
            <p lang="ar" dir="rtl" className="mt-2 text-left text-3xl font-light text-ink-soft">
              آية حافظ
            </p>

            <div className="mt-10 max-w-[62ch] space-y-5 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
              {intro.map((p, i) => (
                <p key={p} className={i === 0 ? 'font-display text-2xl leading-snug font-light italic sm:text-3xl' : ''} style={i === 0 ? { fontVariationSettings: '"SOFT" 100' } : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <Link href="/" transitionTypes={STITCH} className="label mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-cream transition-colors hover:bg-burgundy">
              {question} <span aria-hidden>→</span>
            </Link>
          </section>

          <aside aria-label="Contact" className="lg:pt-24">
            <div className="rounded-lg bg-cream p-6 sm:p-7">
              <p className="label text-ink-soft">Get in touch</p>
              <dl className="mt-5 space-y-4">
                <ContactRow label="Email" href={`mailto:${contact.email}`} value={contact.email} />
                <ContactRow label="Phone" href={contact.phone.href} value={contact.phone.display} />
                <ContactRow label="WhatsApp" href={contact.whatsapp.href} value={contact.whatsapp.display} external />
                <div>
                  <dt className="label text-ink-soft">Based in</dt>
                  <dd className="mt-1">{contact.location}</dd>
                </div>
              </dl>
              <a
                href={contact.cvPdf}
                download
                data-cursor="Download"
                className="label mt-7 inline-flex items-center gap-2 rounded-full border-[1.5px] border-dashed border-forest px-5 py-3 text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                Download CV (PDF) <span aria-hidden>↓</span>
              </a>
            </div>

            <div className="mt-6 rounded-lg border-[1.5px] border-dashed border-seam p-6 sm:p-7">
              <p className="label text-ink-soft">At a glance</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                <li>Fashion Design, German International University in Cairo</li>
                <li>Ranked first in Fashion Design, semesters 2–5 · GPA 1.15 (German system)</li>
                <li>Pattern making, garment construction, sewing and jewellery making</li>
                <li>CLO 3D, Adobe Illustrator, InDesign, Lightroom, Wilcom Embroidery</li>
              </ul>
            </div>

            <Link href="/?room=desk" transitionTypes={STITCH} className="label stitch-link mt-6 inline-block">
              Meet Aya in the atelier
            </Link>
          </aside>
        </div>

        <Seam ends className="mt-20" />

        {/* CV */}
        <section aria-labelledby="cv-title" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="cv-title" className="font-display text-headline font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
              CV
            </h2>
            <a href={contact.cvPdf} download className="label stitch-link">
              Download PDF
            </a>
          </div>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{summary}</p>

          <div className="mt-14 grid gap-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-14">
            <h3 className="label text-forest lg:pt-1">Education</h3>
            <ol className="space-y-8">
              {education.map((e) => (
                <li key={e.title}>
                  <Entry title={e.title} place={e.place} dates={e.dates} notes={e.notes} />
                </li>
              ))}
            </ol>

            <h3 className="label text-forest lg:pt-1">Experience</h3>
            <ol className="space-y-8">
              {experience.map((r) => (
                <li key={r.title + r.place}>
                  <RoleEntry role={r} />
                </li>
              ))}
            </ol>

            <h3 className="label text-forest lg:pt-1">Tools & skills</h3>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="label text-ink-soft">Software</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {software.map((s) => (
                    <li key={s} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {skills.map((g) => (
                <div key={g.group}>
                  <p className="label text-ink-soft">{g.group}</p>
                  <p className="mt-3 leading-relaxed">{g.items.join(' · ')}</p>
                </div>
              ))}
            </div>

            <h3 className="label text-forest lg:pt-1">Languages</h3>
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="font-display text-2xl font-light">{l.name}</span>
                  <span className="label ml-2 text-ink-soft">{l.level}</span>
                </li>
              ))}
            </ul>

            <h3 className="label text-forest lg:pt-1">Courses</h3>
            <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
              {courses.map((c) => (
                <li key={c} className="border-b border-dashed border-seam pb-2">
                  {c}
                </li>
              ))}
            </ul>

            <h3 className="label text-forest lg:pt-1">Activities</h3>
            <ol className="grid gap-8 sm:grid-cols-2">
              {activities.map((r) => (
                <li key={r.title + r.place}>
                  <RoleEntry role={r} />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </StitchPage>
  );
}

function ContactRow({ label, href, value, external = false }: { label: string; href: string; value: string; external?: boolean }) {
  return (
    <div>
      <dt className="label text-ink-soft">{label}</dt>
      <dd className="mt-1">
        <a href={href} className="stitch-link break-all" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {value}
        </a>
      </dd>
    </div>
  );
}

function Entry({ title, place, dates, notes }: { title: string; place: string; dates: string; notes: string[] }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-display text-2xl font-light">{title}</p>
        <p className="label text-ink-soft tabular-nums">{dates}</p>
      </div>
      <p className="mt-1 text-ink-soft">{place}</p>
      <ul className="mt-3 space-y-1.5">
        {notes.map((n) => (
          <li key={n} className="flex gap-3 leading-relaxed">
            <span aria-hidden className="mt-[0.7em] h-[1.5px] w-3 shrink-0 bg-thread" />
            {n}
          </li>
        ))}
      </ul>
    </>
  );
}

function RoleEntry({ role }: { role: Role }) {
  return <Entry title={role.title} place={`${role.place} · ${role.kind}`} dates={role.dates} notes={role.notes} />;
}
