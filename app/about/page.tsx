import type { Metadata } from 'next';
import { aboutText } from '@/content/about';
import { activities, contact, courses, education, experience, languages, skills, software, summary, type Role } from '@/content/cv';

export const metadata: Metadata = {
  title: 'About',
  description: summary,
  alternates: { canonical: '/about' },
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line pt-6 lg:grid-cols-12">
      <h2 className="text-[12px] uppercase tracking-[0.14em] text-ink-2 lg:col-span-3">{title}</h2>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

function Roles({ roles }: { roles: Role[] }) {
  return (
    <ol className="grid gap-6">
      {roles.map((r) => (
        <li key={r.title + r.place} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
          <p className="text-[15px]">
            {r.title}, <span className="text-ink-2">{r.place}</span>
          </p>
          <p className="text-[13px] tabular-nums text-ink-3 sm:text-right">
            {r.dates} · {r.kind}
          </p>
          <ul className="grid max-w-prose gap-1 text-[14px] leading-relaxed text-ink-2 sm:col-span-2">
            {r.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default function About() {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-16 px-4 pt-12 sm:px-8 md:pt-20">
      <header className="grid gap-8 lg:grid-cols-12">
        <h1 className="font-serif text-[clamp(52px,8vw,128px)] leading-[0.92] tracking-tight lg:col-span-5">About</h1>
        <div className="grid max-w-prose gap-4 text-[17px] leading-relaxed lg:col-span-7 lg:pt-4">
          {aboutText.map((p) => <p key={p}>{p}</p>)}
          <p>
            <a href={contact.cvPdf} download className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-1.5 text-[14px] transition-colors hover:bg-ink hover:text-paper">
              Download CV <span aria-hidden>↓</span>
            </a>
          </p>
        </div>
      </header>

      <div className="grid gap-12">
        <Block title="Education">
          <ol className="grid gap-6">
            {education.map((e) => (
              <li key={e.title} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
                <p className="text-[15px]">
                  {e.title}, <span className="text-ink-2">{e.place}</span>
                </p>
                <p className="text-[13px] tabular-nums text-ink-3 sm:text-right">{e.dates}</p>
                <ul className="grid gap-1 text-[14px] text-ink-2 sm:col-span-2">
                  {e.notes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </Block>
        <Block title="Experience">
          <Roles roles={experience} />
        </Block>
        <Block title="Skills">
          <dl className="grid gap-6 sm:grid-cols-3">
            {skills.map((s) => (
              <div key={s.group}>
                <dt className="text-[12px] text-ink-3">{s.group}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed">{s.items.join(', ')}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[12px] text-ink-3">Software</dt>
              <dd className="mt-2 text-[14px] leading-relaxed">{software.join(', ')}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-ink-3">Languages</dt>
              <dd className="mt-2 text-[14px] leading-relaxed">{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</dd>
            </div>
          </dl>
        </Block>
        <Block title="Leadership and activities">
          <Roles roles={activities} />
        </Block>
        <Block title="Courses">
          <ul className="grid gap-1 text-[14px] text-ink-2 sm:grid-cols-2">
            {courses.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Block>
      </div>
    </div>
  );
}
