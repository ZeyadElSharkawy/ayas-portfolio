'use client';

// The atelier hub scene. Loaded client-only (see HubExperience); everything here is grey-box.

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { setCursorLabel } from '@/lib/cursor';
import {
  AYA,
  BAYS,
  CAPTION_PX,
  DIALOGUE_SHARE,
  INTRO,
  OVERVIEW,
  PANEL_PX,
  SHEET_BREAKPOINT,
  SHEET_SHARE,
  bayView,
  fitPose,
  stations,
  type CameraPose,
  type Framing,
  type StationId,
  type StationUi,
  type V3,
} from '@/lib/hub/stations';
import { Desk, DigitalLab, Room, StitchRing, StylingRoom, WINDOW, ROOM } from './props';
import { BaySet } from './sets';
import { AyaCharacter } from './AyaCharacter';
import type { HubProject } from './types';

// camera-controls ACTION values (v3): not re-exported by drei.
const ACTION = { NONE: 0, ROTATE: 1, DOLLY: 16, TOUCH_ROTATE: 64, TOUCH_DOLLY: 1024 } as const;

/** The room's resting mood; slides on the Atelier Floor ease towards their own. */
const BASE_MOOD = { background: '#f4e2cc', sky: '#fff8ec', sun: '#ffe2b0' };

export interface SceneProps {
  projects: HubProject[];
  /** Station label elements in the HTML overlay; the scene positions them over their anchors. */
  labels: RefObject<Map<StationId, HTMLElement>>;
  focused: StationId | null;
  /** Index into BAYS while the Atelier Floor is open. */
  slide: number;
  hoveredStation: StationId | null;
  hoveredProject: string | null;
  reduced: boolean;
  /** Aya is mid-line: she nods and her mouth moves. */
  talking: boolean;
  /** Bumped when a conversation starts, so she waves. */
  waveKey: number;
  onSelectStation: (id: StationId) => void;
  onHoverStation: (id: StationId | null) => void;
  onHoverProject: (slug: string | null) => void;
  onSelectProject: (slug: string) => void;
  onSelectSlide: (index: number) => void;
  onTalk: () => void;
}

export default function Scene(props: SceneProps) {
  const mood = props.focused === 'atelier-floor' ? BAYS[props.slide].mood : BASE_MOOD;
  // Start at a moderate resolution; PerformanceMonitor raises it on capable devices and lowers it
  // when the frame rate drops.
  const [dpr, setDpr] = useState(1.25);
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={dpr}
      camera={{ fov: 32, near: 0.1, far: 80, position: INTRO.position }}
      gl={{ antialias: true }}
      onPointerMissed={() => props.onHoverStation(null)}
      aria-label="Interactive 3D atelier"
    >
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio))}
        onDecline={() => setDpr(1)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Mood {...mood} />
      <AtelierEnvironment />
      <Room />
      <Stations {...props} />
      <CameraRig focused={props.focused} slide={props.slide} reduced={props.reduced} />
      <LabelProjector labels={props.labels} />
      {process.env.NODE_ENV !== 'production' && <DevHandle />}
    </Canvas>
  );
}

/**
 * Reflections for the mirror, brass and glossy surfaces: a cube map rendered once from light shapes
 * that echo the room (the window on the left, the ceiling, soft fill from the front). Nothing is
 * downloaded.
 */
function AtelierEnvironment() {
  return (
    <Environment resolution={128} frames={1} environmentIntensity={0.5}>
      <color attach="background" args={['#ead5ba']} />
      <Lightformer form="rect" intensity={5} color="#ffdcab" position={[-6, 2.4, -1.4]} rotation-y={Math.PI / 2} scale={[2.6, 2.8, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#fff6ea" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 8, 1]} />
      <Lightformer form="rect" intensity={0.8} color="#f4e2cc" position={[0, 2, 9]} rotation-y={Math.PI} scale={[14, 4, 1]} />
    </Environment>
  );
}

/** Lights and background, easing towards the current mood. */
function Mood({ background, sky, sun }: { background: string; sky: string; sun: string }) {
  const bg = useRef<THREE.Color>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const targets = useMemo(
    () => ({ background: new THREE.Color(background), sky: new THREE.Color(sky), sun: new THREE.Color(sun) }),
    [background, sky, sun],
  );

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-4 * dt);
    bg.current?.lerp(targets.background, k);
    hemi.current?.color.lerp(targets.sky, k);
    sunLight.current?.color.lerp(targets.sun, k);
  });

  return (
    <>
      <color ref={bg} attach="background" args={[BASE_MOOD.background]} />
      <hemisphereLight ref={hemi} args={[BASE_MOOD.sky, '#e3cdb0', 1.3]} />
      {/* Daylight through the mashrabiya: low and warm, from the left wall. */}
      <directionalLight
        ref={sunLight}
        position={[-ROOM.halfX - 6, WINDOW.y + 4.2, WINDOW.z + 1.2]}
        intensity={3.2}
        color={BASE_MOOD.sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <directionalLight position={[6, 8, 10]} intensity={0.9} color="#fbf0e2" />
    </>
  );
}

type Stop = { stopPropagation: () => void };

function Stations({
  projects,
  focused,
  slide,
  hoveredStation,
  hoveredProject,
  reduced,
  talking,
  waveKey,
  onSelectStation,
  onHoverStation,
  onHoverProject,
  onSelectProject,
  onSelectSlide,
  onTalk,
}: SceneProps) {
  const palette = (slug: string) => projects.find((p) => p.slug === slug)?.palette ?? ['#d9be9c'];
  const title = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;
  const inCategory = (c: string) => projects.filter((p) => p.category === c);

  // Station-level pointer handlers: hover rings and labels in overview, click to fly in.
  const stationHandlers = (id: StationId, room: string) => ({
    onPointerOver: (e: Stop) => {
      e.stopPropagation();
      if (focused) return;
      onHoverStation(id);
      setCursorLabel(`Enter · ${room}`);
    },
    onPointerOut: () => {
      if (focused) return;
      onHoverStation(null);
      setCursorLabel(null);
    },
    onClick: (e: Stop) => {
      e.stopPropagation();
      if (focused !== id) {
        setCursorLabel(null);
        onSelectStation(id);
      }
    },
  });

  // Each bay is its own target: in overview it opens that slide; inside the slides,
  // the current bay opens the project page and the others move the slideshow.
  const bayHandlers = (index: number) => {
    const slug = BAYS[index].slug;
    const inSlides = focused === 'atelier-floor';
    const label = inSlides && index === slide ? `Open · ${title(slug)}` : title(slug);
    return {
      onPointerOver: (e: Stop) => {
        e.stopPropagation();
        if (focused && !inSlides) return;
        if (!focused) onHoverStation('atelier-floor');
        onHoverProject(slug);
        setCursorLabel(label);
      },
      onPointerOut: () => {
        if (focused && !inSlides) return;
        if (!focused) onHoverStation(null);
        onHoverProject(null);
        setCursorLabel(null);
      },
      onClick: (e: Stop) => {
        e.stopPropagation();
        if (focused && !inSlides) return;
        setCursorLabel(null);
        if (inSlides && index === slide) onSelectProject(slug);
        else onSelectSlide(index);
      },
    };
  };

  const ayaHandlers = {
    onPointerOver: (e: Stop) => {
      e.stopPropagation();
      if (!focused) onHoverStation('desk');
      setCursorLabel('Talk to Aya');
    },
    onPointerOut: () => {
      if (!focused) onHoverStation(null);
      setCursorLabel(null);
    },
    onClick: (e: Stop) => {
      e.stopPropagation();
      setCursorLabel(null);
      onTalk();
    },
  };

  const active = (id: StationId) => hoveredStation === id || focused === id;
  const lit = (slug: string) => hoveredProject === slug;
  const deskStation = stations.find((s) => s.id === 'desk')!;

  return (
    <>
      {stations.map((s) => (
        <StitchRing key={s.id} radii={s.ring} active={hoveredStation === s.id && !focused} position={s.anchor} />
      ))}

      {BAYS.map((bay, i) => (
        <BaySet
          key={bay.slug}
          bay={bay}
          colors={palette(bay.slug)}
          highlighted={lit(bay.slug) || (focused === 'atelier-floor' && i === slide)}
          active={focused === 'atelier-floor' && i === slide}
          lowered={focused === 'atelier-floor' && i !== slide}
          reduced={reduced}
          {...bayHandlers(i)}
        />
      ))}

      <group {...stationHandlers('digital-lab', 'The Digital Lab')}>
        <DigitalLab
          highlighted={active('digital-lab') || inCategory('digital-fashion').some((p) => lit(p.slug))}
          reduced={reduced}
        />
      </group>

      <group {...stationHandlers('styling-room', 'The Styling Room')}>
        <mesh position={[5.1, 1, 2.1]}>
          <boxGeometry args={[3.8, 2.4, 2.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <StylingRoom highlighted={active('styling-room') || lit('clue-styling')} colors={palette('clue-styling')} />
      </group>

      <group {...stationHandlers(deskStation.id, deskStation.room)}>
        <Desk highlighted={active('desk')} />
      </group>
      <AyaCharacter
        position={AYA.position}
        yaw={AYA.yaw}
        talking={talking}
        waveKey={waveKey}
        highlighted={hoveredStation === 'desk'}
        reduced={reduced}
        {...ayaHandlers}
      />
    </>
  );
}

/** Pins each station's HTML label over its 3D anchor, every frame. */
function LabelProjector({ labels }: { labels: RefObject<Map<StationId, HTMLElement>> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const s of stations) {
      const el = labels.current?.get(s.id);
      if (!el) continue;
      v.set(...s.anchor).project(camera);
      // Labels near the edge slide inward so the whole pill stays on screen.
      const half = el.offsetWidth / 2 + 8;
      const x = Math.min(size.width - half, Math.max(half, (v.x * 0.5 + 0.5) * size.width));
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.visibility = v.z < 1 ? '' : 'hidden';
    }
  });
  return null;
}

/**
 * Drives the camera. Overview allows a gentle, clamped orbit; inside a station (or a slide) the
 * framing is fixed and user input is off. Limits are lifted during flights so they can't clamp a view.
 */
function CameraRig({ focused, slide, reduced }: { focused: StationId | null; slide: number; reduced: boolean }) {
  const ref = useRef<CameraControls>(null);
  const size = useThree((s) => s.size);
  const fov = useThree((s) => (s.camera as THREE.PerspectiveCamera).fov);
  const aspect = size.width / Math.max(1, size.height);
  const introDone = useRef(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.mouseButtons.left = ACTION.ROTATE;
    c.mouseButtons.middle = ACTION.NONE;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.wheel = ACTION.DOLLY;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
    c.dollySpeed = 0.4;
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let cancelled = false;

    const station = stations.find((s) => s.id === focused);
    const view = station?.id === 'atelier-floor' ? bayView(BAYS[slide]) : station?.view;
    const { pose, offset } =
      station && view ? frame(view, station.ui, size.width, size.height, fov) : { pose: overviewPose(aspect, fov), offset: [0, 0] };
    const animate = !reduced;

    unclamp(c);
    c.enabled = !station;

    const run = async () => {
      if (!introDone.current) {
        introDone.current = true;
        if (animate) {
          const intro = fitPose(INTRO, aspect);
          await c.setLookAt(...intro.position, ...intro.target, false);
          c.smoothTime = 1.4;
        }
      }
      await Promise.all([
        c.setLookAt(...pose.position, ...pose.target, animate),
        c.setFocalOffset(offset[0], offset[1], 0, animate),
      ]);
      c.smoothTime = 0.7;
      if (!cancelled && !station) clampToOverview(c, overviewPose(aspect, fov), aspect);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [focused, slide, aspect, size.width, size.height, fov, reduced]);

  return <CameraControls ref={ref} makeDefault smoothTime={0.7} draggingSmoothTime={0.2} />;
}

/**
 * Frames a subject in the part of the screen the station's UI leaves free, and returns the fitted
 * pose plus a camera-space focal offset that shifts the subject away from the UI.
 * - panel: a column on the right (desktop) / bottom sheet (phone)
 * - slides: a caption column on the left (desktop) / bottom sheet (phone)
 * - dialogue: a box along the bottom
 */
function frame(view: Framing, ui: StationUi, width: number, height: number, fov: number) {
  const phone = width < SHEET_BREAKPOINT;
  const cover = phone
    ? { x: 0, y: ui === 'dialogue' ? 0.34 : SHEET_SHARE }
    : ui === 'panel'
      ? { x: PANEL_PX, y: 0 }
      : ui === 'slides'
        ? { x: -CAPTION_PX, y: 0 }
        : { x: 0, y: DIALOGUE_SHARE };
  const freeW = Math.max(1, width - Math.abs(cover.x));
  const freeH = height * (1 - cover.y);

  // At distance d the frustum is 2·d·tan(fov/2) tall and `width/height` times that wide. The subject
  // (plus a 10% margin) must fit inside the free fraction of it in both directions.
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const [w, h] = view.size;
  const distance = Math.max((w * 1.1) / (2 * tanHalf * (width / height) * (freeW / width)), (h * 1.1) / (2 * tanHalf * (freeH / height)));

  const dir = new THREE.Vector3(...view.from).normalize();
  const position = new THREE.Vector3(...view.target).addScaledVector(dir, distance);
  const pose: CameraPose = { position: position.toArray() as V3, target: view.target };

  const visibleH = 2 * distance * tanHalf;
  const visibleW = visibleH * (width / height);
  // A positive focal offset moves the subject left (x) / up (y) on screen, away from the UI.
  const offset: [number, number] = [(visibleW * cover.x) / width / 2, (visibleH * cover.y) / 2];
  return { pose, offset };
}

function unclamp(c: CameraControls) {
  c.minAzimuthAngle = -Infinity;
  c.maxAzimuthAngle = Infinity;
  c.minPolarAngle = 0;
  c.maxPolarAngle = Math.PI;
  c.minDistance = 0.5;
  c.maxDistance = 60;
}

/** Portrait screens look at the atelier from higher and more head-on, like a dollhouse. */
const PORTRAIT_DIR = new THREE.Vector3(0.3, 0.66, 0.69).normalize();
const PORTRAIT_TARGET: [number, number, number] = [0.3, 0.5, -0.4];
/** How far across the screen (in NDC) a station's label anchor may sit; its label clamps inside. */
const PORTRAIT_REACH = 0.8;

/**
 * The overview pose. Landscape screens use the composed pose (pulled back a little on narrow ones);
 * portrait screens get their own composition, at whatever distance puts every station on screen.
 */
function overviewPose(aspect: number, fov: number): CameraPose {
  if (aspect >= 1) return fitPose(OVERVIEW, aspect);
  const target = new THREE.Vector3(...PORTRAIT_TARGET);
  const cam = new THREE.PerspectiveCamera(fov, aspect, 0.1, 200);
  const points = stations.flatMap((s) => [new THREE.Vector3(...s.anchor), new THREE.Vector3(s.anchor[0], 0, s.anchor[2])]);
  const p = new THREE.Vector3();
  const fits = (d: number) => {
    cam.position.copy(target).addScaledVector(PORTRAIT_DIR, d);
    cam.lookAt(target);
    cam.updateMatrixWorld();
    return points.every((pt) => Math.abs(p.copy(pt).project(cam).x) <= PORTRAIT_REACH);
  };
  let lo = 8;
  let hi = 120;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  const at = target.clone().addScaledVector(PORTRAIT_DIR, hi);
  return { position: [at.x, at.y, at.z], target: PORTRAIT_TARGET };
}

function clampToOverview(c: CameraControls, pose: CameraPose, aspect: number) {
  const { position: [px, py, pz], target: [tx, ty, tz] } = pose;
  const azimuth = Math.atan2(px - tx, pz - tz);
  const distance = Math.hypot(px - tx, py - ty, pz - tz);
  // Portrait already shows every station, so its orbit stays modest too.
  const swing = aspect < 1 ? 0.8 : 1;
  c.minAzimuthAngle = azimuth - 0.55 * swing;
  c.maxAzimuthAngle = azimuth + 0.4 * swing;
  c.minPolarAngle = 0.55;
  c.maxPolarAngle = 1.3;
  c.minDistance = distance * 0.7;
  c.maxDistance = distance * 1.2;
}

/**
 * Dev-only tooling for when the page is in a background tab and requestAnimationFrame is paused:
 * `__hub.step(n)` advances n frames by hand; `__hub.snap(n)` steps, then pins the rendered frame
 * as an <img> over the canvas (`__hub.unsnap()` removes it).
 */
function DevHandle() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const w = window as unknown as { __hub?: unknown };
    const step = (n = 1) => {
      const { advance, controls } = get();
      let t = performance.now();
      for (let i = 0; i < n; i++) {
        (controls as unknown as CameraControls | null)?.update(1 / 60);
        advance((t += 1000 / 60));
      }
    };
    w.__hub = {
      get,
      step,
      snap(n = 1) {
        step(n);
        const canvas = get().gl.domElement;
        let img = document.getElementById('__hub-snap') as HTMLImageElement | null;
        if (!img) {
          img = document.createElement('img');
          img.id = '__hub-snap';
          img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
          canvas.parentElement!.appendChild(img);
        }
        img.src = canvas.toDataURL('image/jpeg', 0.85);
      },
      unsnap() {
        document.getElementById('__hub-snap')?.remove();
      },
    };
    return () => {
      delete w.__hub;
    };
  }, [get]);
  return null;
}
