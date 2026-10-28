<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aya's Portfolio — "The Atelier"

Fashion portfolio site: a persistent 3D atelier hub (React Three Fiber + drei) with per-project rooms, prerendered project pages, and a Node media pipeline. Next.js 16 App Router, React 19, Tailwind 4, strict TypeScript.

**Read `PLAN.md` before non-trivial work** — it is the project log: decisions made, per-phase status, current design, and open questions for Aya.

## Commands

```sh
npm run dev
npm run build                # production build (Turbopack)
npx tsc --noEmit             # typecheck (no dedicated script)
npm run lint
npm run check:content        # run after editing content/: validates media refs, lists unused assets and open questions
npm run media                # _source/ → public/media/ + content/media.generated.json (needs _source/, which is git-ignored)
npm run media -- --project=<slug> --only=images,documents,videos --force
npm run media:signature      # after `npm run media`: crops renders, traces stitch paths
npm run icons                # after editing app/icon.svg: regenerates favicon.ico, apple + PWA icons
```

No test suite, no CI, and the project is not a git repository yet. Verify changes with `lint`, `tsc --noEmit`, and `build` (plus `check:content` for content edits).

## Content and media

- Copy lives in `content/projects/*.ts` (plain typed data, one file per project), plus `content/about.ts` and `content/cv.ts`. Media is referenced by id (`MediaRef`) and resolved against `content/media.generated.json` via `lib/media.ts`; unknown ids **throw** (deliberate typo guard). If the manifest is missing, run `npm run media`.
- `content/media.generated.json` and `content/signature.generated.json` are generated — never edit by hand. The source-file → project mapping (page ranges, video crops, posters) lives in `scripts/media/config.mjs`.
- All copy is `status: 'draft'` until Aya reviews it; per-project `questions` arrays hold open items (listed by `check:content`). Don't mark anything approved or invent final copy.

## Next.js 16 quirks (cacheComponents is on)

- Pages that await `params` must do it inside `<Suspense>`; the project body streams behind a loading placeholder. Because of that, `/work/<unknown>` intentionally returns 200 with the not-found UI and `noindex`; other unknown paths 404.
- `SITE_URL` (falls back to localhost) drives canonical URLs, OG, sitemap and JSON-LD at build time via `lib/site.ts`. Unset until the domain is chosen.
- `/style` is an internal style tile, `noindex`, disallowed in `app/robots.ts`.

## Bundle and runtime rules

- Client components must import media URL helpers from `lib/media-urls.ts`, **not** `lib/media.ts` — the latter imports the ~40 KB gzipped manifest and ships it to every page showing a photo (this regression already happened once).
- All sound is synthesised with Web Audio (`lib/sound.ts`); there are no audio files. Sound is off by default.

## 3D hub

- drei's `<Html>` crashes the scene on unmount under React 19. Labels are plain HTML positioned by per-frame projection — don't reintroduce `<Html>`.
- Dev-only frame stepping for background tabs: `window.__hub.step(n)`, `__hub.snap(n)`, `__hub.unsnap()` (dev builds only; `components/hub/Scene.tsx`).
- Stations, positions and camera framing: `lib/hub/stations.ts`, `components/hub/Scene.tsx`, props in `components/hub/props.tsx`. Deep links: `/?room=<station>`, `/?room=atelier-floor&slide=<slug>`.
- Screenshot quirk in this environment: at 1.25× DPR only the top-left 80% of the viewport is captured; use `__hub.snap` to inspect the real frame.

## Design state

- Current palette is PLAN.md §11 (supersedes the §9 colours); tokens live in `app/globals.css`. No dark mode, deliberately.
- The stylised primitive look (Aya character, themed sets) is a settled decision — don't swap in downloaded realistic models.
- Every signature interaction (`components/signature/`) must respect `prefers-reduced-motion`, work by keyboard, and have no horizontal overflow at 375 px.
- Satori OG cards need static WOFF/TTF fonts (`assets/fonts/`), not the variable fonts `next/font` loads.

## Ignored paths that matter

- `_source/` (raw originals, ~1.3 GB), `Drive Folder Content/`, `.cache/`, and `public/media/**/video/` (MP4s move to R2 at launch) are git-ignored; processed images in `public/media/` are committed.
- `next-env.d.ts` is generated by the Next.js CLI.
