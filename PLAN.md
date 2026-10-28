# Aya Hafez — Portfolio Plan

Working title: **The Atelier** (a Cairo fashion house in 3D)

## 1. What the content tells us

Aya's work has a clear signature: **Egyptian / Arab heritage translated into contemporary fashion**, plus strong process documentation. Each project also has its *own* visual world, which we should use rather than flatten.

| # | Project | What it is | Its visual world | Assets we have |
|---|---------|-----------|------------------|----------------|
| 1.1 | **Cultural Echoes** | Executed look inspired by Alternative Egyptian Pop (oud, tabla, qanun, lyrics, posters); khayamiya (tent-maker appliqué) technique | Bottle green, saffron, burnt orange, plum. Islamic Cairo shoot: turquoise arched doors, minarets, golden-hour rooftops, tuk-tuk | Front/Back/Side/Detail stills, poster, full film, trailer, outfit-details film, 64-page booklet (**booklet photos flagged "do not use"**) |
| 1.2 | **Carina Arabesque** ("كارينا بالعربي") | Brand capsule for **Carina**: a mother-and-daughter collection for Eid Al-Fitr and Mother's Day 2027. The arabesque stands for "infinite connection", a family as one unbreakable pattern | Olive, pale lemon, brown, teal, orange; arabesque and vegetal motifs. Executed look shot at Islamic Cairo mashrabiya and mosque courtyards | 15 photos, video, 70-page booklet (brand DNA, motifs, fabrics, element breakdown, embroidery variations, **proposed SKUs and colourways**, prototypes, embroidery close-ups) |
| 1.2b | **In Honor of Our Women** ("تكريماً لنسائنا"), Carte Blanche | Textile wall installation: machine-embroidered line portraits of Egyptian women with handwritten Arabic tributes | Off-white dakka cloth, hot-pink gabardine, black-and-white archive photos | Inside the Carina booklet (pp. 59–70). **Ask Aya whether it should be its own project** |
| 1.3 | **Glacier** | Ice-skating garment for a child, two interchangeable looks. Theme: *the unseen cost of chasing perfection* | Ice blue, navy, white; ice cracks and snowflakes as symbols | Lookbook at the ice rink, mannequin and process shots, final film, 54-page booklet (slashing, digital embroidery, silver-plated jewelry, storyboard) |
| 1.4 | **Into Her Skin** | Costume for aerial-hoop performer Shahenda Bahgat; identity analysis, then bodysuit and draping | Lavender and lemon yellow; every booklet page is framed inside a hoop | 58-page booklet (patterns, technical drawings, digital prototype, 3 fittings, draping and pleats, storyboard), interview film |
| 2.1 | **Arabia Collection** (CLO3D) | Three digital abaya/garment looks; arabesque calligraphy prints | Maroon and cream, Arabic calligraphy | 26-page bilingual (EN/AR) deck: avatar, fabrics, fabric maps, renders, technical drawings, 2D patterns. Turntables, render, walk video |
| 2.2 | **Identity Breakdown** (CLO3D) | Digital look built from a person's identity (Salma Amr), framed as a cinema story | Crimson, hot pink, red velvet cinema | 15-page deck, moodboard, CLO renders |
| 3 | **Fashion Styling — Clue** | Styling for Egyptian brand Clue (clue.eg) | Neutral editorial: sand walls, sunlight | 13 editorial photos, 9 screenshots of her shots live on clue.eg, 2 videos |

**Takeaway:** a single generic 3D room would under-sell her. The plan is a **neutral hub** (the atelier) where **each project transforms the space into its own world** when you enter it.

## 2. Concept: The Atelier

I'm merging the two ideas you pasted. The *Fashion House departments* give the structure, the *Little Atelier* gives the playfulness, and I'm dropping the tiny assistant character (reasons below).

### The hub
A warm, softly lit 3D atelier inspired by Cairo limestone, with a **mashrabiya window** casting arabesque shadows across the floor. Visitors can orbit a little and hover objects, and clicking an object flies the camera into it.

| Object in the room | Leads to | Department |
|---|---|---|
| Row of **dress forms**, each draped in a project's colours | Selected Works (1.1–1.4) | The Atelier Floor |
| **Monitor / holographic plinth** with a slowly rotating 3D garment | Digital Fashion (2.1, 2.2) | The Digital Lab |
| **Clothing rail + full-length mirror** | Fashion Styling, Clue | The Styling Room |
| **Sketchbook + sewing table** | About, CV, Contact | The Desk |

### Signature details (cheap to build, high impact)
- **Needle cursor with a running-stitch trail.** The cursor is a needle that leaves a thread. This gives us the playful "assistant" feel without a character, which would be expensive to animate and could read as childish.
- **"Unstitch" page transitions.** Sections stitch open and closed along a seam line.
- An **always-visible Index button** gives a plain list of all work. Recruiters can reach any project in one click, which keeps the 3D a bonus rather than a barrier.

### Each project gets one signature interaction
| Project | Signature interaction |
|---|---|
| Cultural Echoes | Enter through a turquoise Cairo arched door. Khayamiya appliqué panels *stitch themselves* together as you scroll. The oud, tabla and qanun icons from her poster border play a short phrase on hover (sound opt-in). *(The drag-to-spin idea was dropped: the front, side and back stills were shot in different locations.)* |
| Carina Arabesque | A **mashrabiya screen** slides open to reveal each look. An arabesque motif **assembles itself from its elements** (as on her "element breakdown" page). A **colourway switcher** recolours the garment through her proposed SKUs |
| In Honor of Our Women | The installation hangs as a 3D fabric banner that sways; hover a portrait and its **embroidery stitches itself in** line by line, then the Arabic tribute fades in |
| Glacier | An **ice surface that cracks** under the cursor (shader) and reveals the lookbook; snowflakes drift; the "perfection" statement types out over the ice |
| Into Her Skin | Echoes her booklet: content lives inside **3D aerial hoops** you drag to spin; a "fitting timeline" runs Fitting 1 → 2 → 3; the interview plays inside the hoop |
| Arabia (CLO3D) | **Real 3D garments** (GLB exported from CLO3D) you can orbit. Fabric swatch buttons swap materials live, a **before/after** avatar slider, and a toggle between 2D pattern and 3D garment |
| Identity Breakdown | A **cinema**: red velvet seats, curtains part, the CLO runway plays on screen; concept pages styled as movie tickets |
| Clue Styling | Editorial **lightbox with a loupe**, plus a **3D phone** showing her shots live on clue.eg as proof of commercial work |

### Shared project-page template (behind the theatrics)
Every project follows the structure Aya already uses in her booklets, so content entry stays consistent:
**Concept → Research & Moodboard → Sketches → Materials & Techniques → Patterns & Prototypes → Final Look → Film → Credits**

Booklet pages become a **3D flip-book** ("Read the full booklet") as well as feeding the sections above.

## 3. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)**, static export | Routing, image handling, SEO. A persistent 3D canvas in the root layout means scenes don't reload between pages |
| 3D | **React Three Fiber + drei**, GLB with Draco/KTX2 compression | Industry standard; handles CLO3D GLB exports |
| Motion | **GSAP + ScrollTrigger**, **Lenis** smooth scroll, **Motion** for UI | Scroll-driven storytelling |
| Styling | Tailwind CSS | Fast iteration |
| Content | One typed JSON/MDX file per project | Aya (or you) can edit text without touching code |
| Asset pipeline | Node script: **sharp** (resize, AVIF/WebP, fixes EXIF rotation), **heic-convert** (Glacier HEICs), **pdf-to-img** (booklet pages), **ffmpeg** (video transcode, posters, short loops) | The raw files are ~900 MB; phone photos need rotating; HEIC won't display on the web |
| Hosting | **Vercel** for the site; **Cloudflare R2** (or Bunny) for videos | Keeps the git repo small; video streams fast |
| 3D props | Sketchfab CC models (dress form, sewing machine, hoop) or simple Blender builds | Low-poly, baked lighting for speed |

**About keeping media in the source code:** yes for images. The pipeline writes web-ready versions into `public/media/`. The **originals stay in `_source/`** (git-ignored, about 900 MB), and **videos go to R2** once we deploy. Until then they can live locally.

## 4. Performance and accessibility guardrails
- The 3D loads **per room** (code-split); the hub target is under 3 MB to first interaction.
- **Mobile:** a lighter scene with scroll-driven camera instead of orbit, and fewer post-processing effects.
- `prefers-reduced-motion` turns off the camera fly-throughs and the stitch trail.
- The Index view and real HTML text keep the site crawlable and readable by screen readers.
- Loading screen: a thread spool unwinding, which shows progress honestly.

## 5. Build phases

| Phase | Deliverable | Notes |
|---|---|---|
| **0. Content pipeline** ✅ | `_source/` → `public/media/` (images, booklet pages, videos, posters); `content/projects/*.ts` per project with draft copy written from the booklets | Done 2026-10-24. See §8 |
| **1. Design direction** ✅ | Style tile at `/style`; grey-box 3D hub at `/` | Done 2026-10-24. See §9 |
| **2. Site skeleton** ✅ | Routes, Index view, the shared project template working **without 3D** | Done 2026-10-24. See §10 |
| **3. The hub** ✅ | Atelier scene, hover and click objects, camera fly-ins, stitch transitions, needle cursor | Done 2026-10-24. See §9, §11, §13 |
| **4. Signature interactions** ✅ | The per-project moments above: 7 of 8 done (§14, §15). Arabia's (real 3D garments) moves to Phase 5, waiting on the CLO3D GLBs | Order: Cultural Echoes → Glacier → Into Her Skin → Clue → Carina → In Honor of Our Women → Identity |
| **5. Digital Lab** | CLO3D GLB viewer, fabric swap, before/after | Blocked on GLB exports from Aya |
| **6. Polish and launch** (in progress) | Sound, mobile pass, SEO and OG images and performance done (§16). Left: domain (`SITE_URL`), video hosting, analytics | |

## 6. Needed from Aya
1. **GLB/OBJ exports from CLO3D** of the Arabia garments and the Identity Breakdown look (File → Export → glTF/OBJ, with textures). This is the biggest "wow" asset.
2. **In Honor of Our Women:** a standalone project, or part of Carina Arabesque? The plan assumes standalone.
3. **Cultural Echoes booklet "do not use these pics":** why? Those Cairo photos are the strongest images in the portfolio. Is it a photographer-rights issue, or does she just prefer the separate stills?
4. Bio, portrait, CV, contact and socials, education (university and programme).
5. Credits: photographers, models (e.g. Shahenda Bahgat, the Glacier skater), Clue team. Plus Clue's OK to show the screenshots.
6. Her role at Clue (stylist? creative direction?) and dates.
7. Language: **English only to start, Arabic version later?** Her work is already bilingual, so an AR/RTL toggle would be a nice touch.
8. Domain name.

## 7. Source content status
- All 90 Drive files are mirrored to `_source/` (1.3 GB, folder structure kept; `_manifest.json` maps files to Drive IDs). Every file passed an integrity check.
- Three extensionless Drive files are PDFs and were renamed: `1.3 glacier booklet.pdf`, `2.1 Arabia Collection.pdf`, `2.2 Identity Breakdown.pdf`.
- Drive downloads drop large files silently. If you re-download, verify the files (the Cultural Echoes film and poster both arrived truncated the first time).

## 8. Phase 0: how the content works

**Commands**
| Command | What it does |
|---|---|
| `npm run media` | Rebuilds `public/media/` from `_source/` and skips anything unchanged. Flags: `--project=<slug>`, `--only=images,documents,videos`, `--force` |
| `npm run check:content` | Checks every media reference in `content/` resolves, lists unused assets, and prints the open questions for Aya. Run it after editing content |
| `node scripts/media/contact-sheet.mjs [slug]` | Labelled contact sheets in `.cache/sheets/` for curating images and pages |

**Files**
- `scripts/media/config.mjs`: which source files belong to which project, page ranges, and video crop and poster frame.
- `content/media.generated.json`: generated by the pipeline (sizes, blur placeholders, dominant colours, video metadata). Don't edit it by hand.
- `content/types.ts`, `content/categories.ts`, `content/projects/*.ts`: the site's content, one file per project.
- `lib/media.ts`: resolves media references to URLs and `srcset`s, and throws on typos.

**Outputs**
- Images: AVIF and WebP at 640, 1280 and 1920 px, auto-rotated, with HEIC converted. 70 photos.
- Booklet and deck pages: WebP at 800 and 1600 px. 224 pages, including the poster.
- Videos: H.264 MP4, at most 1080p, 30 fps, faststart. 12 clips, 805 MB down to 184 MB. They are git-ignored and go to R2 at launch.
- Committed media (images, pages and posters) is about 77 MB across 786 files.

**Decisions made**
- **In Honor of Our Women** is its own project (pp. 50–69 of the Carina booklet), pending Aya's answer.
- The Cultural Echoes booklet's photos (pp. 8–63) are **not processed** until Aya clarifies "do not use".
- The Cultural Echoes trailer was a vertical video inside a 16:9 frame, so it was cropped to 840×1440.
- All copy is `status: 'draft'`, written from her booklets and posters. Her Arabic text is kept where she wrote it (Arabia concept, poster subtitle).
- There are 27 open questions in the project files. The most important are the Glacier child-model consent, the CLO3D GLB exports, and the "do not use" booklet. `npm run check:content` lists them all.

## 9. Phase 1: design direction and grey-box hub

**Style tile** (`/style`)
- **Colours:** limestone `#ECE3D2`, paper `#F7F2EA`, sand, clay, umber, ink `#1E1A17`, brass `#B08D57` and one accent, **thread** `#A3262A` (pomegranate). They are Tailwind tokens in `app/globals.css`. The atelier stays quiet so each project's own palette can take over its room.
- **Type:** **Fraunces** for display (light, soft optical sizes, italic for quotes), **Instrument Sans** for UI and body, and **Alexandria** for Arabic (designed in Egypt). All three load through `next/font`.
- **Motif:** a running stitch in thread red. It appears as seam dividers (with cross-stitch ends), stitch-in reveals, stitched link underlines, dashed focus rings, and the **"unstitch" transition** prototype (the seam is unpicked, then the fabric parts).
- **Cursor:** a **needle** that leaves a running-stitch thread. The stitches stay anchored to the path, the needle rotates toward the direction of travel, and it can show labels (`data-cursor="…"` or `setCursorLabel()`). Only on mouse pointers without reduced motion; touch devices keep the system cursor. The drawing lives in `lib/thread.ts` and was checked by rendering it outside the browser.
- **No dark mode, deliberately:** the atelier is a daylit room. We can revisit this after Phase 3.

**Grey-box hub** (`/`)
- A Cairo atelier diorama: limestone walls, and a **mashrabiya window whose lattice shadow falls across the floor**.
- **Four stations:** the Atelier Floor (four dress forms dressed in their project palettes, plus a hanging banner for In Honor of Our Women), the Digital Lab (a wireframe hologram on a plinth and a monitor), the Styling Room (a rail in Clue's palette and a mirror) and the Desk (a sketchbook, a sewing machine and a stool).
- **Camera flow:** a dolly-in from the establishing shot, then a gently clamped orbit in the overview. Clicking a station flies the camera to it and locks the framing; Back or Escape returns. Each station is framed from its subject size, so it fits the space the panel leaves free: left of the panel on desktop, above the bottom sheet on phones.
- **Hover is linked everywhere:** a stitched ring appears on the floor, the station label turns red, the cursor shows "Enter · Room", and the matching room chip highlights. Inside the Atelier Floor, hovering a dress form highlights its project in the panel, and the other way round.
- **Accessibility and fallbacks:** the HTML room list and the **Index** dialog are the real navigation (keyboard, screen readers, no-WebGL). With reduced motion there are no camera flights and the hologram stays still.
- Station positions and camera framing live in `lib/hub/stations.ts`, the props in `components/hub/props.tsx`, and the scene and camera rig in `components/hub/Scene.tsx`.

**Lessons for Phase 3**
- drei's `<Html>` crashed the scene on unmount under React 19, so labels are plain HTML positioned by a per-frame projection instead. Don't bring `<Html>` back.
- **Dev tooling:** `window.__hub.step(n)` and `__hub.snap(n)` (dev builds only) advance and capture frames when the tab is in the background.
- **Not yet checked in a foreground browser:** how smooth the camera flights and the thread trail feel. Every check so far ran with the tab in the background, stepping frames by hand.
- **Phones:** the overview shows the centre of the room, and the edge stations are a swipe or a tap on the room list away. A purpose-built mobile composition belongs in Phase 3.
- **Next for the hub:** real models in place of the primitives, an environment light so the mirror and brass read properly, project pages for the panel to link to (Phase 2), and the GLB garments in the Digital Lab (Phase 5).

## 10. Phase 2: site skeleton and project pages

**Routes**
| Route | What it is |
|---|---|
| `/` | The 3D atelier hub. `/?room=atelier-floor` (or `digital-lab`, `styling-room`, `desk`) opens straight into a station |
| `/work` | The full Index: every project grouped by department, with no 3D. This is the page search engines will crawl |
| `/work/<slug>` | One page per project. All 8 are prerendered at build time |
| `/style` | Style tile (internal reference) |

**The project template** (`app/work/[slug]/page.tsx`), one template for all 8 projects, driven by `content/projects/*.ts`:
- **Hero:** washed in the project's first palette colour, with the room and department label, the title (plus the Arabic title where there is one), the tagline in italic, palette swatches and the hero image.
- **Summary and key facts.**
- **Sections in booklet order** (Concept → … → Film), with a sticky "On this page" navigation on desktop that marks the current section with a stitch.
- **Media:** films first (landscape ones full width, vertical ones side by side), then a masonry of images and pages that keeps their proportions. Films load nothing until play is pressed.
- **Lightbox:** every image and page in reading order, across the whole project. Arrow keys work, Escape closes, focus returns, and the page behind is scroll-locked.
- **Booklet reader:** portrait booklets show as two-page spreads on wide screens (cover alone, like print); landscape decks and phones show one page at a time. It has a scrubber and arrow keys, and stands in until the Phase 5 flip-book.
- **Credits, previous/next project, and "Back to <room>"**, which returns to the hub inside that station.
- **Accent colours** come from each palette, using the first colour that passes 4.5:1 contrast on limestone (`lib/theme.ts`).

**Hub wiring:** station panel entries and Index rows link to the project pages, and clicking a dress form inside a station opens its project.

**Next.js 16 notes**
- With cache components on, a page that awaits `params` must do it inside `<Suspense>` for instant navigation. The header is the static shell, and the project body streams behind a stitched "Threading the needle" placeholder. All 8 pages still prerender fully.
- Because of that streaming, `/work/<unknown>` returns 200 with the not-found UI and `noindex`, as Next.js documents. Other unknown paths return 404. There is a custom not-found page.
- `metadataBase` reads `SITE_URL`, which falls back to localhost. Set it once the domain is decided, or social preview images will point at localhost.

**Checked:** all 8 pages render at 1280×800 and 375×812 with no sideways scrolling on phones; the lightbox, booklet reader, films, section nav, the `?room=` deep link and 3D click-through all work; the production build is clean.

**Later:** each prerendered page is 90–225 KB of HTML, mostly the blur placeholders inlined for every thumbnail plus the lightbox data. That's fine for now; if it matters, Phase 6 could move placeholders into CSS or load lightbox data on demand.

## 11. Design update (2026-10-24): new palette, Aya at the Desk, Atelier Floor as themed slides

**Site palette** (supersedes the Phase 1 colours)
| Colour | Hex | Role | Token |
|---|---|---|---|
| Warm Beige | `#F4E2CC` | Background and base: pages, the room | `beige` |
| Forest Green | `#2F5643` | Primary accent: buttons, labels, focus, selection | `forest` |
| Warm Orange | `#E69E52` | Highlights and hover fills. **Not for text** (1.8:1 on beige) | `orange` |
| Rust Brown | `#9E4F2E` | Earthy details: the thread, stitches, cursor trail (4.9:1) | `rust` = `thread` |
| Deep Burgundy | `#572530` | Dark accent and contrast: hover on dark buttons, dark viewers | `burgundy` |

Supporting roles: `cream #FBF4EA` (surfaces), `ink #2B1A1D` (text), `ink-soft #6E4F4A` (5.8:1), `sand`, `clay`. All are defined in `app/globals.css`.

**The Atelier Floor is now a slideshow** (`components/hub/sets.tsx`, `SlideCaption.tsx`)
- Five themed **bays** line the back wall, one per selected work, each with its mannequin:
  - **Cultural Echoes:** a turquoise pointed-arch Cairo door in a stone wall.
  - **Carina Arabesque:** a backlit mashrabiya with an arabesque rosette, and a mother-and-daughter pair of forms.
  - **In Honor of Our Women:** the embroidered banner between archive photo strips, on a dusty rose wall.
  - **Glacier:** a cracked ice wall with snowflakes, an ice floor and falling snow.
  - **Into Her Skin:** a lavender wall with the booklet's gold ring and a slowly turning aerial hoop.
- Clicking a mannequin (or "Selected Works") opens its **slide**. The other bays sink through the floor, the active set's wall opens out to fill the view, the floor and lighting take on its mood, and the caption shows the title, Arabic title, tagline, palette and "Open the project".
- Navigation: arrows, dots or ←/→. Clicking the current mannequin opens the project page. `/?room=atelier-floor&slide=<slug>` deep-links to a slide, and project pages link back to their own slide.

**Aya at the Desk** (`components/hub/AyaCharacter.tsx`, `Dialogue.tsx`, `content/about.ts`)
- A stylised Aya stands beside her desk. Clicking her (or "Meet Aya") flies the camera in. She **waves**, and a visual-novel dialogue box opens: lines type out while she nods and talks, then choices branch into topics (her work, process, the room, contact).
- **The introduction is Aya's own "About the designer" text**, nine lines ending on "Shall we take a look around?". The choices then take you to the selected works (slides), the Digital Lab, the Styling Room or contact.
- Her look follows a photo of Aya in her Cultural Echoes outfit: a burnt-orange **hijab** with the white underscarf at the forehead and long ends draped down the front, a teal oversized top and trousers with the pink-and-red sleeve appliqué, and a gold chain. Colours are in `ayaLook` in `content/about.ts`.
- Accessibility: the conversation is keyboard-operable, focus moves to Continue or the first choice, each full line is announced once through a polite live region, and reduced motion shows lines instantly.

**Needed from Aya for this round**
1. ~~Contact details and CV~~: done (see §12).
2. Social links (Instagram, LinkedIn), if she wants them on the site.

**Implementation notes**
- Framing is unified: `frame()` in `Scene.tsx` fits any subject to the area the UI leaves free (the right panel for the Lab and Styling Room, the left caption for slides, the bottom box for the dialogue, a bottom sheet on phones).
- Testing tip: in this environment, screenshots at 1.25× DPR capture only the top-left 80% of the viewport. To check the real 3D frame, copy the canvas into a 75%-size image (see the dev `__hub.step`/`snap` handle).

## 12. About page, contact and CV (2026-10-24)

- **`/about`:** Aya's "About the designer" text, a contact card, an at-a-glance box and the full CV (education, experience, tools and skills, languages, courses, activities), with the résumé as a PDF download (`public/Aya-Hafez-CV.pdf`).
- **Contact:** email, phone and WhatsApp (`content/cv.ts`). The phone link opens the dialler and the WhatsApp link opens wa.me. Her text lives once, in `aboutText` (`content/about.ts`), and the Desk dialogue splits it into sentences.
- **Dialogue:** the "How can I reach you?" answer is now real, with choices to email her, message her on WhatsApp, or read the CV.
- **Headers:** an About link in the hub header and the site header. The hub tagline is now "Fashion designer · Berlin · Cairo", following her CV.
- **Clue project:** her role (Fashion Stylist & Content Creator, internship, Aug–Sep 2026) and the brand name, Clue Wear, now come from the CV.
- **Privacy:** both phone numbers (German mobile and WhatsApp) are published, as decided on 2026-10-24.

## 13. Phase 3: the hub, finished (2026-10-24)

Built on the work in §9 and §11. Phase 3 adds:

- **Stitch page transitions** (`components/motif/StitchPage.tsx`, CSS in `app/globals.css`): navigating between the hub, the Index, project pages and About closes the old page into a vertical seam (with a rust running stitch down the middle) and opens the new page out of it. The effect uses React's `<ViewTransition>` and the browser's View Transitions API, triggered only on navigations tagged `STITCH` (links, prev/next, the hub panels, the 3D click-through and Aya's dialogue links). Browser back/forward and refreshes don't animate. Reduced motion makes it instant, and browsers without support simply switch pages. In production the page update takes about 20 ms and the whole transition about 700 ms.
- **Environment lighting**: drei's `<Environment>` renders a reflection map once from procedural light shapes (the window, the ceiling, front fill), so nothing is downloaded. The mirror is now a real mirror and the brass reads as metal. The hemisphere light was lowered to compensate.
- **Adaptive performance**: drei's `<PerformanceMonitor>` starts at 1.25× resolution, rises to the device's ratio (capped at 1.75) when frames are smooth, and drops to 1× when they aren't. In the foreground the hub ran at about 61 fps.
- **Loading spool**: a rust thread spool with a running stitch pulling off it replaces the plain loading line (`components/motif/Spool.tsx`). It's used while the 3D code downloads and while a project page streams in.
- **Polish**: a soft beige wash behind the hub header keeps the wordmark readable over the window lattice, and the Arabic font is no longer preloaded.

**Decisions and what's left**
- **Models:** the stylised primitive look, with Aya's character, the themed sets and the dress forms, now holds together as a design in its own right. I recommend keeping it rather than mixing in downloaded realistic models. Modelled props (a sewing machine, Aya in Blender) remain an option for Phase 6 polish.
- **Phones:** the overview still crops the edge stations, and the room list plus a swipe reach them. Stations, slides and the dialogue all frame correctly on phones.
- **Checked live in the foreground:** the camera and transitions now render in real time (about 61 fps). Verified there: the stitch transition, the environment reflections, Aya and the dialogue on a narrow layout.

## 14. Phase 4: signature interactions, part 1 (2026-10-25)

Each project page now has a signature section right after the hero (`components/signature/Signature.tsx` picks it by slug and resolves its media on the server). Three are built; all respect reduced motion, work by keyboard, and fit at 375 px.

**Cultural Echoes** (`components/signature/CulturalEchoes.tsx`)
- **Through the door:** a 230vh sticky stage. As you scroll, two turquoise studded door leaves swing inward (CSS 3D) inside a pointed sandstone arch on a coursed stone wall. The view then pushes in on her photo, and "من أعماق المجتمع / From the depths of society" fades in. With reduced motion the door is shown open.
- **Stitched by hand:** a wall of 12 khayamiya appliqué tiles in her palette (star, lotus, diamond, arch, sun, zigzag). They drop into place and their running-stitch borders sew on when the wall scrolls into view.
- **Instruments:** the oud, tabla and qanun tiles from her poster play short phrases (`lib/sound.ts`). The phrases are synthesised with Web Audio in maqam Hijaz, so there are no audio files. Sound is off until the visitor turns it on, and the choice is remembered.

**Glacier** (`components/signature/Glacier.tsx`)
- **Crack the ice:** her lookbook triptych lies under a canvas of frost (an icy gradient, speckle, glare and faint old hairline cracks), and her statement types out across it.
- **Cracking:** moving the pointer or tapping grows branching cracks in about 0.4 s, opening channels through the frost with a thin icy rim. The statement fades as the ice breaks.
- **Buttons:** "Crack the ice", "Shatter" (the frost falls away) and "Freeze again". Snow drifts throughout. Phones keep their cracks when the address bar resizes the page.

**Into Her Skin** (`components/signature/IntoHerSkin.tsx`)
- **In the hoop:** eight golden aerial hoops on ropes in a 3D ring, holding her on-the-hoop photos (cropped past the booklet's own printed hoop). Dragging spins the ring; a fast flick coasts with momentum, and slow drags, the buttons and the arrow keys glide with a CSS transition. The hoops sway, and the front hoop's caption is announced.
- **Fitting timeline:** Prototype → Fitting 2 → Fitting 3, using her booklet pages, a stitched progress line and her construction notes.
- **Interview:** the Shahenda interview plays inside a hoop, with a gold ring that fills as it plays.

**Aya's character restyled after her Bitmoji** (`components/hub/AyaCharacter.tsx`, `ayaLook` in `content/about.ts`): a teal hijab over the white underscarf, draping to a point; big almond eyes with brown irises and winged liner; pink lips. She wears a pale teal open abaya with dark teal embroidered trim on the front edges and cuffs, a pale inner dress and white heels.
- **Next:** her Bitmoji expressions as portraits in the dialogue box. This needs the image files (the stickers or the grid screenshot) dropped into the project folder.

**Phase 4 continued in §15**, which adds Clue, Carina Arabesque, In Honor of Our Women and Identity Breakdown.

## 15. Phase 4: signature interactions, part 2 (2026-10-25)

Seven of the eight signatures are now built; Arabia's needs the CLO3D GLB exports (Phase 5). The four new ones follow the same rules as §14: they respect reduced motion, work by keyboard, and have no horizontal overflow at 375 px.

**Clue** (`components/signature/Clue.tsx`)
- **Light table:** her 11 editorial frames on a contact sheet, with the selected frame circled in grease pencil. The large frame has a **loupe** at 2.6× zoom. With a mouse it follows the pointer; on a phone you tap to put it down, drag to move it and tap again to lift it. Arrow keys change the frame.
- **The phone:** a CSS 3D phone with a solid edge (stacked layers) that tilts with the pointer. Its screen shows the 9 clue.eg screenshots. You can swipe, use the buttons or dots, and "Turn it over" to see the back.

**Carina Arabesque** (`components/signature/Carina.tsx`)
- **Behind the mashrabiya:** a carved, arched window with two turned-wood lattice leaves. They slide open when the window scrolls into view. Choosing another look (lantern-shaped thumbnails, from her palette page) closes the screen, changes the photo and opens it again.
- **Element breakdown:** her rosette is laid out as six elements in a row, as on her booklet page. They fly together into the finished motif; "Take it apart" separates them again.
- **Colourways:** technical flats of the matching mother-and-daughter look: a blouse with yoke and placket, embroidered rosettes, and a three-tier skirt. Choose one of six proposed SKUs, or pick a part and recolour it from her eight palette colours.

**In Honor of Our Women** (`components/signature/InHonor.tsx`)
- **The banner:** off-white dakka cloth with a hot-pink border hangs from a wooden rod and sways gently. It holds four panels: Doria Shafik, Hekmat Ashour, Mennatallah Mahmoud and Hala Kassem.
- **Embroidery:** each portrait starts as a chalk tracing. Hovering (or scrolling to it on a phone, or "Stitch all four") machine-embroiders it in pink running stitch, with a needle following the line. The paths are **traced from her own line drawings** (booklet pp. 58–61). Then her **handwritten tribute** (cropped from the same page, so it stays in her hand) fades in beside it.

**Identity Breakdown** (`components/signature/Identity.tsx`)
- **The cinema:** a red-velvet auditorium. When it scrolls into view the house lights dim, the curtains gather to the sides and a projector beam lights the screen. The screen plays a reel:
  - a title card, "Crazy enough? Never enough."
  - her five CLO3D renders (cropped from the deck), shown with a slow push-in and film grain
  - an end card for *Hepta*.
  You can pause the reel, jump to a numbered scene, or use Lights up/down.
- **Tickets:** five concept pages styled as movie tickets (Row H, seats 3–7; Hepta's is seat 7). Tear off the stub by dragging or clicking it: it falls away, leaving a ripped edge, and the page opens underneath.

**New tooling**
- `npm run media:signature` (`scripts/media/signature-assets.mjs`) runs after `npm run media`. It:
  - crops single renders out of deck pages;
  - traces each In Honor line portrait into ordered stitch paths (thinning to a one-pixel skeleton, then walking the line);
  - crops the matching tribute.
  Output goes to `public/media/<slug>/sig/` and `content/signature.generated.json`, read through `lib/signature-assets.ts`.
- **Pipeline fix:** images now also keep their native width when it is well above the largest standard size. Clue's 1080 px photos previously topped out at 640 px, which was too soft for the loupe; Clue and Glacier were re-rendered.
- New shared bits: `lib/use-media-query.ts`, and keyframes in `globals.css` (draw-in, banner-sway, needle-bob, grain, ken-burns, stub-fall).

**For Aya to confirm**
- The Arabic tributes are shown as images of her handwriting; their alt text names each woman but doesn't transcribe the text. A transcription or translation from her would make them readable for screen readers.
- The role lines under the four portraits ("intellectual and pioneer feminist", "her great-grandmother", and so on) come from her booklet page.
- Clue's OK to show the store screenshots (already in §6).

## 16. Phase 6: polish and launch prep (2026-10-26)

**Performance**
- The media manifest (about 40 KB gzipped) had been shipping to every page that shows a photo, because `Picture` imported its URL helpers from `lib/media.ts`. The helpers now live in `lib/media-urls.ts`, which doesn't import the manifest. JavaScript per page dropped by about 36 KB gzipped: home 232 → 196 KB, Glacier 243 → 206 KB.
- Checked and left as they are:
  - three.js (~290 KB gzipped) loads only with the hub, after first paint.
  - Videos use `preload="none"`, and heroes load with `priority`.
  - Inline blur placeholders cost about 5 KB gzipped per page.
- The two Fraunces files (~270 KB, upright and italic) are the biggest remaining cost. They carry the `opsz` and `SOFT` axes that the type style depends on (27 uses), so they stay.

**SEO**
- `lib/site.ts` holds the site identity, built from `SITE_URL`, which falls back to localhost in dev.
- The root layout sets the full metadata: title template, description, authors, keywords, canonical, Open Graph (`en_GB`), a `summary_large_image` Twitter card, and the `viewport` theme colour.
- Every page has its own canonical URL and Open Graph block. The style tile is `noindex`.
- `app/sitemap.ts` lists the pages plus each project's cover as an image entry. `app/robots.ts` disallows `/style` and points to the sitemap.
- JSON-LD:
  - a `Person` and `WebSite` graph on the home and About pages (name, Arabic name, job title, email, Berlin, GIU, skills);
  - a `CreativeWork` per project (title, Arabic title, tagline, summary, image, genre, creator).

**Share images and icons**
- `opengraph-image.tsx` cards for the home page, Index, About and each project, drawn in her fonts and palette (`lib/og.tsx`, `lib/og-site.tsx`):
  - Project cards: the room and category, title, Arabic title, tagline and palette chips, with the cover photo beyond a stitched seam.
  - Site cards: a fanned stack of covers.
- Satori, which draws the cards, needs WOFF/TTF fonts. Static instances live in `assets/fonts/` (OFL; see its README).
- Satori lays Arabic words out left to right, so the card sets the word order itself.
- Cover crops use `attention`, with a per-project override (In Honor crops left, onto the portrait).
- The file reads are `'use cache'` helpers, so every card prerenders at build time.
- **Icon:** a needle-and-thread mark in her palette (`app/icon.svg`). `npm run icons` (`scripts/make-icons.mjs`) renders `favicon.ico` (16/32/48), the Apple touch icon and the PWA icons, including a maskable one. `app/manifest.ts` describes the installable app. The starter's default favicon is gone.

**Sound** (`lib/sound.ts`, `components/site/Sound.tsx`)
- One site-wide toggle in both headers, off by default. It shares the remembered choice with Cultural Echoes' own switch.
- Every cue is synthesised with Web Audio, so there are no audio files:

| Where | Cue |
| --- | --- |
| Internal links and entering a station | Thread pull (soft rising hiss) |
| Changing slides | Whoosh |
| Aya's dialogue | Soft blips as she talks |
| Glacier | Crack per crack, plus shatter and freeze |
| In Honor of Our Women | Sewing machine while a portrait stitches (one shared machine, however many portraits run) |
| Identity Breakdown | Curtain swish; ticket tear |
| Clue | Camera shutter between frames; tick on phone screens |
| Carina Arabesque | Wooden screen sliding; ticks on colour picks |
| Into Her Skin | Hoop whoosh |

**Mobile**
- **Hub on portrait screens:** a purpose-built overview. A higher, more frontal "dollhouse" view, with the camera distance solved so every station's anchor fits across the screen (`overviewPose` in `Scene.tsx`). Station labels clamp inside the viewport.
- **Hub header:** the tagline shortens to "Fashion designer" on phones, and the buttons wrap under the name on narrow screens.
- **Site header:** the wordmark stays on one line; the "Atelier" link hides on phones (the wordmark leads there); links have taller tap targets.
- **Checks:** no horizontal overflow on any route at 320 px or 375 px.

**Still before launch**
1. **Domain:** set `SITE_URL` (canonical URLs, Open Graph, sitemap and JSON-LD all read it at build time).
2. **Video hosting:** the 186 MB of MP4s in `public/media/**/video/` are git-ignored. Move them to R2 or another CDN, or decide to deploy them with the site.
3. **Analytics:** not added yet. A privacy-friendly option needs no cookie banner.
4. **Git:** the project isn't a repository yet.
5. **Aya's approvals:** listed in §6, §14 and §15. Note that the Glacier share card features the child skater, pending the consent question.

## 17. Portfolio UX refresh (2026-10-28)

- The home atelier links directly to **Aya's work** instead of opening the old index overlay. `/work` is a single all-project card grid; hover/focus reveals media teasers and an **Explore more** link.
- Selected-work slides in the atelier include still and video teasers. Project detail pages end with Aya's contact details and links to every project.
- Cultural Echoes begins with a door action that reveals the complete page; its sketches scroll horizontally. Identity Breakdown uses a short curtain reveal and then its normal project content, without the cinema reel or ticket interaction.
- Glacier automatically breaks into a clear three-look reveal. Into Her Skin's ring images no longer trigger native browser image dragging, and the Styling Room has a larger invisible hit target.
- Aya's 3D figure has a more expressive, oversized-head cartoon treatment with larger eyes and cheek colour, while keeping the existing materials and wave/dialogue animations.

## 18. Showcase and reveal refinements (2026-10-28)

- `/work` now transitions each project card's cover into an in-place media preview on hover/focus; touch visitors can open the same preview with a button. Teasers prefer final looks and film over process pages.
- The Atelier Floor keeps its original compact caption panel and layers the selected project's photo and film over the mannequin, without covering the full scene.
- Cultural Echoes and Identity Breakdown intros now open automatically: a forward push through the Cultural Echoes door and a curtain part for Identity Breakdown. Both skip the animation for reduced-motion preferences.
- The Digital Lab uses cool holographic lighting, projection rings and a luminous interface. The Next.js dev route indicator is hidden while development errors remain visible.
