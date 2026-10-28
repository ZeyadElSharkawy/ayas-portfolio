'use client';

// The atelier hub: a client-only 3D scene with an HTML layer on top.
// The HTML layer is the real navigation (keyboard, screen readers, no-WebGL); the scene mirrors it.

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BAYS, stations, type StationId } from '@/lib/hub/stations';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { setCursorLabel } from '@/lib/cursor';
import { ayaDialogue, type DialogueAction } from '@/content/about';
import { Picture } from '@/components/media/Picture';
import { STITCH } from '@/components/motif/StitchPage';
import { Spool } from '@/components/motif/Spool';
import { SlideCaption } from './SlideCaption';
import { Dialogue } from './Dialogue';
import type { HubProject } from './types';
import { SoundToggle } from '@/components/site/Sound';
import { cue } from '@/lib/sound';
import { ProjectTeasers } from './ProjectTeasers';

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <Loading />,
});

export function HubExperience({ projects }: { projects: HubProject[] }) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [focused, setFocused] = useState<StationId | null>(null);
  const [slide, setSlide] = useState(0);
  const [hoveredStation, setHoveredStation] = useState<StationId | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [talking, setTalking] = useState(false);
  const [waveKey, setWaveKey] = useState(0);
  // Bumped each time a conversation starts, so the dialogue restarts from the top.
  const [conversation, setConversation] = useState(0);
  const labels = useRef(new Map<StationId, HTMLElement>());
  const router = useRouter();

  const slides = BAYS.map((b) => projects.find((p) => p.slug === b.slug)!).filter(Boolean);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    /* eslint-disable react-hooks/set-state-in-effect -- one-time setup from browser-only state after mount */
    setWebgl(!!(canvas.getContext('webgl2') ?? canvas.getContext('webgl')));
    // `/?room=<station>` opens straight into a room, and `&slide=<project>` onto that work's slide
    // (project pages link back this way).
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const at = BAYS.findIndex((b) => b.slug === params.get('slide'));
    if (at >= 0) setSlide(at);
    if (stations.some((s) => s.id === room)) setFocused(room as StationId);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const openProject = useCallback((slug: string) => router.push(`/work/${slug}`, { transitionTypes: STITCH }), [router]);

  const enter = useCallback((id: StationId) => {
    cue('thread');
    setFocused(id);
    setHoveredStation(null);
    setCursorLabel(null);
    if (id === 'desk') {
      setConversation((c) => c + 1);
      setWaveKey((k) => k + 1);
    }
  }, []);

  const showSlide = useCallback((index: number) => {
    cue('whoosh');
    setSlide(index);
    setFocused('atelier-floor');
    setHoveredStation(null);
  }, []);

  const back = useCallback(() => {
    setFocused(null);
    setHoveredProject(null);
    setTalking(false);
    setCursorLabel(null);
  }, []);

  const onDialogueAction = useCallback(
    (action: DialogueAction) => {
      if (action === 'close') back();
      else if ('href' in action) {
        // Site pages go through the router; mailto: stays in this tab; other sites open in a new one.
        if (action.href.startsWith('/')) router.push(action.href, { transitionTypes: STITCH });
        else if (action.href.startsWith('mailto:')) window.location.href = action.href;
        else window.open(action.href, '_blank', 'noopener,noreferrer');
      }
      else if (action.goto === 'atelier-floor') showSlide(0);
      else enter(action.goto);
    },
    [back, router, showSlide, enter],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        back();
      }
      if (focused === 'atelier-floor' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const d = e.key === 'ArrowRight' ? 1 : -1;
        setSlide((s) => (s + d + BAYS.length) % BAYS.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [back, focused]);

  // Hovering a project in the scene brings its panel entry into view.
  useEffect(() => {
    if (!hoveredProject) return;
    document.getElementById(`hub-item-${hoveredProject}`)?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }, [hoveredProject, reduced]);

  const station = stations.find((s) => s.id === focused);
  const stationProjects = station?.category ? projects.filter((p) => p.category === station.category) : [];

  return (
    <div className="fixed inset-0 overflow-hidden bg-beige">
      {webgl && (
        <div className="absolute inset-0">
          <Scene
            projects={projects}
            labels={labels}
            focused={focused}
            slide={slide}
            hoveredStation={hoveredStation}
            hoveredProject={hoveredProject}
            reduced={reduced}
            talking={talking}
            waveKey={waveKey}
            onSelectStation={enter}
            onHoverStation={setHoveredStation}
            onHoverProject={setHoveredProject}
            onSelectProject={openProject}
            onSelectSlide={showSlide}
            onTalk={() => enter('desk')}
          />
          {/* Floating station labels, positioned by the scene. Mouse affordance only: the room list
              below is the keyboard and screen-reader path. */}
          <div aria-hidden className={`pointer-events-none absolute inset-0 ${focused ? 'invisible' : ''}`}>
            {stations.map((s) => (
              <button
                key={s.id}
                ref={(el) => {
                  if (el) labels.current.set(s.id, el);
                  else labels.current.delete(s.id);
                }}
                type="button"
                tabIndex={-1}
                onClick={() => enter(s.id)}
                onPointerEnter={() => setHoveredStation(s.id)}
                onPointerLeave={() => setHoveredStation(null)}
                data-cursor={s.id === 'desk' ? 'Talk to Aya' : `Enter · ${s.room}`}
                className={`label absolute top-0 left-0 rounded-full px-3 py-1.5 whitespace-nowrap shadow-sm transition-colors ${
                  focused ? '' : 'pointer-events-auto'
                } ${hoveredStation === s.id ? 'bg-forest text-cream' : 'bg-cream/90 text-ink'}`}
                style={{ visibility: 'hidden' }}
              >
                {s.room}
              </button>
            ))}
          </div>
        </div>
      )}
      {webgl === false && (
        <p className="absolute inset-x-4 top-1/3 text-center text-ink-soft">
          This browser can&rsquo;t show the 3D atelier, but everything is still here. Pick a room below.
        </p>
      )}

      {/* Top bar */}
      {/* A soft wash keeps the wordmark readable over busy parts of the scene (the window lattice). */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-x-3 gap-y-2 bg-gradient-to-b from-beige/85 via-beige/40 to-transparent p-4 pb-10 sm:p-6 sm:pb-12">
        <div className="pointer-events-auto">
          <h1 className="font-display text-2xl leading-none font-light sm:text-3xl" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 50' }}>
            Aya Hafez
          </h1>
          <p className="label mt-1.5 whitespace-nowrap text-ink-soft">
            Fashion designer<span className="hidden sm:inline"> · Berlin · Cairo</span>
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/about"
            transitionTypes={STITCH}
            className="label rounded-full border-[1.5px] border-dashed border-ink/40 bg-beige/70 px-3 py-2 backdrop-blur transition-colors hover:border-forest hover:text-forest sm:px-4"
          >
            About
          </Link>
          <Link
            href="/work"
            transitionTypes={STITCH}
            className="label rounded-full border-[1.5px] border-dashed border-ink/40 bg-beige/70 px-3 py-2 backdrop-blur transition-colors hover:border-forest hover:text-forest sm:px-4"
          >
            Aya&apos;s work
          </Link>
          <SoundToggle className="rounded-full border-[1.5px] border-dashed border-ink/40 bg-beige/70 px-3 py-2 backdrop-blur transition-colors hover:border-forest hover:text-forest aria-pressed:border-forest aria-pressed:text-forest" />
        </div>
      </header>

      {/* Overview: room list + hint */}
      {!focused && (
        <nav aria-label="Rooms" className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <p className="label mb-3 text-ink-soft">
            <span className="hidden sm:inline">Drag to look around · </span>Choose a room
          </p>
          <ul className="pointer-events-auto flex flex-wrap gap-2">
            {stations.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => enter(s.id)}
                  onPointerEnter={() => setHoveredStation(s.id)}
                  onPointerLeave={() => setHoveredStation(null)}
                  onFocus={() => setHoveredStation(s.id)}
                  onBlur={() => setHoveredStation(null)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    hoveredStation === s.id ? 'bg-forest text-cream' : 'bg-cream/85 text-ink backdrop-blur'
                  }`}
                >
                  <span className="font-display text-base">{s.title}</span>
                  <span className={`ml-2 hidden sm:inline ${hoveredStation === s.id ? 'text-cream/75' : 'text-ink-soft'}`}>{s.room}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* The Atelier Floor: one slide per selected work */}
      {station?.ui === 'slides' && (
        <SlideCaption projects={slides} index={slide} onSelect={setSlide} onBack={back} onHover={setHoveredProject} />
      )}

      {/* The Desk: Aya introduces herself */}
      {station?.ui === 'dialogue' && (
        <Dialogue key={conversation} nodes={ayaDialogue} reduced={reduced} onAction={onDialogueAction} onTalking={setTalking} />
      )}

      {/* Other stations: project panel, right column on desktop, bottom sheet on phones */}
      {station?.ui === 'panel' && (
        <aside
          aria-label={station.room}
          className="absolute inset-x-0 bottom-0 max-h-[52vh] overflow-y-auto rounded-t-lg bg-cream/95 p-5 shadow-xl backdrop-blur sm:inset-x-auto sm:top-24 sm:right-6 sm:bottom-6 sm:max-h-none sm:w-[24rem] sm:rounded-lg"
        >
          <button type="button" onClick={back} className="label stitch-link text-ink-soft">
            ← Back to the atelier
          </button>
          <p className="label mt-6 text-forest">{station.room}</p>
          <h2 className="mt-1 font-display text-4xl font-light" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30' }}>
            {station.title}
          </h2>
          <p className="mt-2 text-ink-soft">{station.blurb}</p>

          <ul className="mt-6 space-y-3">
            {stationProjects.map((p) => (
              <li key={p.slug} id={`hub-item-${p.slug}`}>
                <div
                    className={`rounded-md p-2 transition-colors ${hoveredProject === p.slug ? 'bg-beige' : ''}`}
                >
                    <Link
                      href={`/work/${p.slug}`}
                      transitionTypes={STITCH}
                      onPointerEnter={() => setHoveredProject(p.slug)}
                      onPointerLeave={() => setHoveredProject(null)}
                      onFocus={() => setHoveredProject(p.slug)}
                      onBlur={() => setHoveredProject(null)}
                      data-cursor="Open project"
                      className="grid grid-cols-[4.5rem_1fr] gap-4 rounded-md"
                    >
                      <Picture image={p.cover} sizes="72px" className="aspect-[3/4] rounded-sm" />
                      <div className="min-w-0 self-center">
                        <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.tagline}</p>
                        <div className="mt-2 flex gap-1">
                          {p.palette.slice(0, 4).map((hex) => (
                            <span key={hex} className="h-1 w-5 rounded-full" style={{ background: hex }} />
                          ))}
                        </div>
                      </div>
                    </Link>
                    <div className="mt-3">
                      <ProjectTeasers label={p.title} media={p.previews} />
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      )}

    </div>
  );
}

function Loading() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <Spool />
    </div>
  );
}
