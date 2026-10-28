// Each project's signature moment, shown on its page right after the hero (see PLAN.md §2).
// Resolves the media each one needs on the server and hands it to a client component.

import type { MediaRef, Project } from '@/content/types';
import { largest, resolveMedia, type ResolvedImage, type ResolvedVideo } from '@/lib/media';
import { signaturePortrait } from '@/lib/signature-assets';
import { CarinaSignature } from './Carina';
import { ClueSignature } from './Clue';
import { CulturalEchoesSignature } from './CulturalEchoes';
import { GlacierSignature } from './Glacier';
import { InHonorSignature } from './InHonor';
import { IntoHerSkinSignature } from './IntoHerSkin';

const image = (slug: string, id: string, alt: string) => resolveMedia(slug, { kind: 'image', id, alt }) as ResolvedImage;
const page = (slug: string, doc: string, n: number, alt: string) => resolveMedia(slug, { kind: 'page', doc, n, alt }) as ResolvedImage;

export function Signature({ project }: { project: Project }) {
  const { slug } = project;

  if (slug === 'cultural-echoes') {
    return <CulturalEchoesSignature palette={project.theme.palette} />;
  }

  if (slug === 'glacier') {
    const statement = project.sections.find((s) => s.quote)?.quote?.text ?? project.tagline;
    return (
      <GlacierSignature
        statement={statement}
        images={[
          image(slug, 'img-4437', 'Gliding on the ice in the white look, one leg extended'),
          image(slug, 'img-4572', 'Arm raised on the ice in the dark-blue look'),
          image(slug, 'img-4447', 'Portrait in the white look with snowflake embroidery'),
        ]}
      />
    );
  }

  if (slug === 'into-her-skin') {
    // The on-the-hoop photos, with the alt text already written for them in the project content.
    const finalPages = (project.sections.find((s) => s.kind === 'final')?.media ?? []).filter(
      (m): m is Extract<MediaRef, { kind: 'page' }> => m.kind === 'page',
    );
    const finals = [38, 39, 40, 42, 44, 46, 47, 52].map((n) =>
      page(slug, 'booklet', n, finalPages.find((m) => m.n === n)?.alt ?? `On the hoop, page ${n}`),
    );
    const fittings = [
      { label: 'Prototype', page: page(slug, 'booklet', 23, 'First prototype of the printed bodysuit'), note: 'The first prototype needed more flow than the print alone could give, so mesh joined the leotard. Side seams then broke the print, which had to be reworked.' },
      { label: 'Fitting 2', page: page(slug, 'booklet', 30, 'Fitting 2 on the aerial hoop'), note: 'Too tight to lift her arms, and the mesh didn’t drape from the sides. A wider neckline and triangular “princess-cut” inserts at the ankles fixed the fit.' },
      { label: 'Fitting 3', page: page(slug, 'booklet', 31, 'Fitting 3 with the draped mesh top'), note: 'The mesh top is pleated halfway so it drapes from the hip, complements the skirt, and knots at the neck to flatter her back.' },
    ];
    const interview = resolveMedia(slug, { kind: 'video', id: 'interview', title: 'Interview with Shahenda Bahgat' }) as ResolvedVideo;
    return <IntoHerSkinSignature hoops={finals} fittings={fittings} interview={interview} />;
  }

  if (slug === 'clue-styling') {
    const images = (kind: 'final' | 'context') =>
      (project.sections.find((s) => s.kind === kind)?.media ?? []).map((m) => resolveMedia(slug, m) as ResolvedImage);
    const photos = images('final').map((img) => ({ ...img, zoom: largest(img) }));
    const screens = images('context').map((img) => ({ ...img, label: img.alt.replace(/^clue\.eg /, '').replace(/^./, (c) => c.toUpperCase()) }));
    return <ClueSignature photos={photos} screens={screens} />;
  }

  if (slug === 'carina-arabesque') {
    const finals = project.sections.find((s) => s.kind === 'final')?.media ?? [];
    const looks = ['img-8437', 'img-8440', 'img-8442', 'img-8455', 'img-8498', 'img-8534'].map((id) => {
      const ref = finals.find((m) => m.kind === 'image' && m.id === id);
      if (!ref) throw new Error(`Carina look ${id} is not in the final section`);
      return resolveMedia(slug, ref) as ResolvedImage;
    });
    return <CarinaSignature looks={looks} />;
  }

  if (slug === 'in-honor-of-our-women') {
    const women = [
      { id: 'doria', name: 'Doria Shafik', role: 'intellectual and pioneer feminist' },
      { id: 'hekmat', name: 'Hekmat Ashour', role: 'her great-grandmother' },
      { id: 'mennatallah', name: 'Mennatallah Mahmoud', role: 'our beloved teacher' },
      { id: 'hala', name: 'Hala Kassem', role: 'Carina’s CEO' },
    ].map((w) => ({ ...w, ...signaturePortrait(slug, w.id, `Handwritten Arabic tribute to ${w.name}`) }));
    return <InHonorSignature women={women} />;
  }

  return null;
}
