<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aya's Portfolio

Fashion portfolio for Aya Hafez, aimed at internship recruiters. Quiet, editorial design: one page that previews all her work (an index of project titles beside the work, with an Outcome / Process switch), and a full project page per project with its signature interaction. The page colour follows the selected project. Next.js 16 App Router, React 19, Tailwind 4, strict TypeScript, fully static.

**Read `PLAN.md` before non-trivial work.** Its top section is the current design log; everything under "Archive" describes the earlier 3D-atelier concept (kept on `main`), except §1, which is still the best summary of the content. The design sketches are in `design/sketches/` (open `index.html`); the site follows Concept C.

## Commands

```sh
npm run dev
npm run build                # production build (Turbopack)
npx tsc --noEmit             # typecheck (no dedicated script; run a build or `next dev` first so PageProps/LayoutProps exist)
npm run lint
npm run check:content        # run after editing content/: validates media refs, lists unused assets and open questions
npm run media                # _source/ → public/media/ + content/media.generated.json (needs _source/, which is git-ignored)
npm run media -- --project=<slug> --only=images,documents,videos --force
npm run media:signature      # after `npm run media`: crops renders, traces stitch paths
npm run media:cutouts        # poster icons, Carina flat parts, the hoop and Arabia calligraphy, from the source PDFs
npm run media:clean [slug]    # the work out of her booklets and decks, per scripts/media/clean-specs.mjs
npm run media:about           # home hero cut-out, from _source/about/ (portrait-enhanced.webp, portrait-cutout.png)
```

No test suite and no CI. Verify changes with `lint`, `tsc --noEmit` and `build` (plus `check:content` for content edits).

## Content and media

- Copy lives in `content/projects/*.ts` (plain typed data, one file per project), plus `content/about.ts` and `content/cv.ts`. Media is referenced by id (`MediaRef`) and resolved against `content/media.generated.json` via `lib/media.ts`; unknown ids **throw** (deliberate typo guard). If the manifest is missing, run `npm run media`.
- Never edit generated JSON by hand. The source-file → project mapping (page ranges, video crops, posters) lives in `scripts/media/config.mjs`.
- **Pages show the work, the site writes the words.** No slides and no images containing text on project pages. Use `kind: 'clean'` refs (`content/clean.generated.json`, built by `npm run media:clean` from `scripts/media/clean-specs.mjs`: embedded originals for the digital decks, crops with labels erased for flattened booklets). `check:content` lists any `page` refs left. Allowed exceptions, where text is the work: In Honor's embroidered tributes, the Cultural Echoes poster, the Identity moodboard, her handwritten storyboards. The full booklet viewer is the one place slides appear.
- Sections keep the booklet structure (`SectionKind`) and render in file order on the project page. `lib/chapters.ts` maps them to Outcome, Why, Research and Development for the home page's Process view and the `#process` anchor; a section's `chapter` field overrides the default, and `label` replaces the kind in its small label and the page index ("Moodboard", "Jewellery"). Reflection is Aya's to write and stays hidden until `reflection` is set.
- `content/media.generated.json`, `content/signature.generated.json` and `content/clean.generated.json` are all generated.
- All copy is `status: 'draft'` until Aya reviews it; per-project `questions` arrays (and `aboutQuestions`) hold open items. Don't mark anything approved or invent final copy.
- Cultural Echoes: the booklet file is named "do not use these pics". Use its diagram, moodboard and sketch pages only, not the photos in it, until Aya says otherwise.

## Rendering rules

- Everything is prerendered. `cacheComponents` is off; `/work/[slug]` uses `generateStaticParams` with `dynamicParams = false`, so unknown slugs 404.
- Client components must not import `lib/media.ts` (it pulls in the ~40 KB gzipped manifest). Resolve media on the server and pass plain data, as `lib/folio.ts` does for the home page; client code may use `lib/media-urls.ts` and `components/media/Picture.tsx`.
- `SITE_URL` (falls back to localhost) drives canonical URLs and the sitemap via `lib/site.ts`. Unset until the domain is chosen.

## Design rules

- Colour follows the work. `app/globals.css` holds the beige defaults (About, 404) for `paper`, `ink`, `ink-2`, `ink-3`, `line`, `tint`, `accent`; `lib/project-colors.ts` overrides those same variables per project. Project pages and the home page render them as a `<style>` in server HTML (no flash); `Folio` then updates them on `:root` as the selection changes, and they fade because they are registered with `@property`. New colour work should use these tokens; `night` and `chalk` are fixed, for viewers and film.
- `components/site/PageFinish.tsx` adds a fixed layer behind a project's page: falling snow for Glacier, window sunlight for Clue, brushed paint and her cover calligraphy for Arabia, the red paint ground from her slides for Identity Breakdown. Keep the page colour recognisable and keep marks darker than the page where text sits on them.
- Signature interactions (`components/signature/`) are self-contained bands with their own fixed colours, so they don't follow the tokens. Each must respect `prefers-reduced-motion`, work by keyboard, and have no horizontal overflow at 375 px. Sound is synthesised (`lib/sound.ts`), off by default, and only toggled inside Cultural Echoes.
- Playfair Display for titles (Latin only). Amiri for all Arabic, titles included. The text face is Proxima Nova, loaded with `next/font/local` from `assets/fonts/proxima-nova/`. Those are Fontspring **demo** cuts: ASCII only, with the digit 4 and most symbols watermarked, so `unicode-range` limits them and Montserrat supplies the rest. Replace them with licensed files before launch: see the README in that folder.
- Project heroes are per project (`components/project/Heroes.tsx`, Clue in `ClueHero.tsx`, which pins while its photos rise), fed by `heroSet`; Carina uses the generic three-portrait lookbook, Into Her Skin the hanging hoop. Images in `heroSet` are left out of the sections below, unless a section sets `repeatsHero`.
- The home page opens with an About hero (`components/home/AboutHero.tsx`): on the left a hello that cycles through English, Arabic and German (`HelloCycle`, Arabic in Amiri), "I’m Aya Hafez", her role, short text (`intro` in `content/about.ts`) and two buttons with line icons (Download CV, Let’s connect). The hero starts under the sticky header, which is see-through over it: `Folio` sets `data-in-work` on <html> in the same frame as the colour handover, and the rule in `globals.css` keys off it and `data-home-hero`. Don't give the header its own colour transition: it would trail the page. On the right she stands cut out of her photo, centred in that half (made by `media:about`). Her feet rest on the skills strip that closes the hero (`SkillsMarquee`, from `heroSkills`: software as lettered tiles in lavender, not brand colours, crafts as line drawings), which stands still and wraps under reduced motion. Stacked below 1024 px. `HeroBackdrop` is its ground: violet and magenta glows settling to aubergine at the bottom. Its colours come from the portrait (aubergine, stage-light magenta, lavender-cream and lilac type), and the whole page wears them while the hero is on screen (`home` in `lib/project-colors.ts`); once its bottom passes mid-screen, `Folio` hands the page over to the selected project's colours. A stitched seam with no label (`SeamParallax`, with `rise()` from `rise.ts` for content that lifts at its own speed) marks the way into the work.
- The home page's outcome view shows a wide lead and two portraits. A project's `home` field picks the lead, its crop (`focus`, a CSS object-position) and the two below; `contain` keeps round pictures whole. Check that no heads are cut off at the 5:4 desktop crop.
- No still may be taller than the screen: `MediaGrid` caps images and video at 82svh.
- CV and Contact stay in the header on every page; the footer is the contact block (`#contact`).
- Motion is opt-in via `motion-safe:`; everything works by keyboard; no horizontal overflow at 375 px.
- Screenshot quirk in this environment: at 1.25× DPR only the top-left 80% of the viewport is captured.

## Ignored paths that matter

- `_source/` (raw originals, ~1.3 GB), `Drive Folder Content/` and `.cache/` are git-ignored. Everything in `public/media/` is committed, including the MP4s (about 178 MB, each under 50 MB).
- `next-env.d.ts` is generated by the Next.js CLI.
