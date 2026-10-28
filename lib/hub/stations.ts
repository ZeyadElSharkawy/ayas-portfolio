// The atelier hub: where each department sits in the room and how the camera frames it.
// Units are metres-ish; the room spans x ∈ [-7, 7], z ∈ [-5, 5], floor at y = 0.
// The mashrabiya window is in the left wall (x = -7); daylight comes through it.

import type { CategoryId } from '@/content/types';

export type V3 = [number, number, number];
export interface CameraPose {
  position: V3;
  target: V3;
}

/**
 * How the camera frames a subject: `target` is the subject's centre, `from` the direction to look
 * from, and `size` the subject's width × height in metres. The distance is computed so the subject
 * fits the part of the screen the UI leaves free.
 */
export interface Framing {
  target: V3;
  from: V3;
  size: [number, number];
}

export type StationId = 'atelier-floor' | 'digital-lab' | 'styling-room' | 'desk';

/** Which part of the screen the station's UI covers, so framing can avoid it. */
export type StationUi = 'panel' | 'slides' | 'dialogue';

export interface Station {
  id: StationId;
  /** Department name shown in the room. */
  room: string;
  title: string;
  blurb: string;
  category?: CategoryId;
  ui: StationUi;
  /** Where the floating label sits in overview. */
  anchor: V3;
  /** Radii (x, z) of the stitched hover ring on the floor, centred under `anchor`. */
  ring: [number, number];
  view: Framing;
}

export const INTRO: CameraPose = { position: [14, 2.4, 17], target: [0, 1.4, 0] };
export const OVERVIEW: CameraPose = { position: [9.5, 8.0, 13.6], target: [0.2, 0.6, -0.6] };

/** Width the station panel covers on desktop (24rem + 1.5rem margin). */
export const PANEL_PX = 408;
/** Width of the slide caption column on desktop (26rem + 1.5rem margin). */
export const CAPTION_PX = 440;
/** Below this width the UI becomes a bottom sheet. */
export const SHEET_BREAKPOINT = 640;
/** Share of the height the bottom sheet / caption / dialogue covers on phones. */
export const SHEET_SHARE = 0.52;
/** Share of the height the dialogue box covers on desktop. */
export const DIALOGUE_SHARE = 0.34;

// ------------------------------------------------------------------ the atelier floor

/** Back-wall bays, one per selected work. Each is a themed set with its mannequin. */
export const BAY = { z: -4.0, backdropZ: -4.88, width: 1.6, height: 2.7 } as const;

export type BaySet = 'cairo-door' | 'mashrabiya' | 'banners' | 'ice' | 'hoop';

export interface Bay {
  slug: string;
  x: number;
  set: BaySet;
  /** Scene mood while this slide is shown: the set's wall colour (its world extends in it), background, sky light, sun colour. */
  mood: { wall: string; background: string; sky: string; sun: string };
}

export const BAYS: Bay[] = [
  { slug: 'cultural-echoes', x: -4.9, set: 'cairo-door', mood: { wall: '#d8bd93', background: '#efd2a6', sky: '#ffe9c8', sun: '#ffc978' } },
  { slug: 'carina-arabesque', x: -3.2, set: 'mashrabiya', mood: { wall: '#e6d2ad', background: '#e6dcbc', sky: '#fbf3d6', sun: '#ffdca0' } },
  { slug: 'in-honor-of-our-women', x: -1.5, set: 'banners', mood: { wall: '#dfb9bd', background: '#f0dcdc', sky: '#fff4f1', sun: '#ffe9dc' } },
  { slug: 'glacier', x: 0.2, set: 'ice', mood: { wall: '#cfe3f2', background: '#d6e5f1', sky: '#eef6ff', sun: '#cfe4ff' } },
  { slug: 'into-her-skin', x: 1.9, set: 'hoop', mood: { wall: '#b9b2e2', background: '#dcd8f0', sky: '#f1efff', sun: '#fff1b0' } },
];

/** Framing for one bay as a full slide. */
export function bayView(bay: Bay): Framing {
  return { target: [bay.x, 1.4, (BAY.z + BAY.backdropZ) / 2], from: [0, 0.12, 1], size: [BAY.width + 0.3, BAY.height + 0.2] };
}

/** Where Aya stands, beside her desk, and which way she faces. */
export const AYA = { position: [-3.25, 0, 2.55] as V3, yaw: 0.65 };

// ------------------------------------------------------------------ stations

export const stations: Station[] = [
  {
    id: 'atelier-floor',
    room: 'The Atelier Floor',
    title: 'Selected Works',
    blurb: 'Executed garments, from research and pattern-making to fittings and the final shoot.',
    category: 'selected-works',
    ui: 'slides',
    anchor: [-1.5, 3.1, -4.0],
    ring: [4.6, 1.2],
    view: { target: [-1.5, 1.4, -4.3], from: [0, 0.3, 1], size: [8.6, 3.0] },
  },
  {
    id: 'digital-lab',
    room: 'The Digital Lab',
    title: 'Digital Fashion',
    blurb: 'Virtual prototyping in CLO3D: avatars, fabric maps, patterns, renders and runway animation.',
    category: 'digital-fashion',
    ui: 'panel',
    anchor: [4.6, 2.6, -3.5],
    ring: [1.7, 1.3],
    view: { target: [4.7, 1.15, -3.6], from: [-0.3, 0.25, 1], size: [3.4, 2.4] },
  },
  {
    id: 'styling-room',
    room: 'The Styling Room',
    title: 'Fashion Styling',
    blurb: 'Editorial and e-commerce styling for Egyptian fashion labels.',
    category: 'fashion-styling',
    ui: 'panel',
    anchor: [5.1, 2.35, 2.1],
    ring: [1.6, 1.6],
    view: { target: [5.5, 1.05, 2.1], from: [-0.3, 0.22, 1], size: [3.6, 2.3] },
  },
  {
    id: 'desk',
    room: 'The Desk',
    title: 'Meet Aya',
    blurb: 'The sketchbook, the sewing table, and the designer behind them.',
    ui: 'dialogue',
    anchor: [-3.9, 2.25, 2.0],
    ring: [1.7, 1.5],
    view: { target: [-3.55, 1.05, 2.2], from: [0.45, 0.28, 1], size: [2.5, 2.1] },
  },
];

/**
 * Poses are composed for a 16:10 screen. On narrower screens the camera pulls back from its
 * target so the framing still fits, up to a cap. (Portrait screens get their own overview
 * composition: see overviewPose in components/hub/Scene.tsx.) aspect = width / height.
 */
export function fitPose(pose: CameraPose, aspect: number): CameraPose {
  const k = aspect >= 1.6 ? 1 : Math.min(1.7, Math.pow(1.6 / aspect, 0.8));
  const [px, py, pz] = pose.position;
  const [tx, ty, tz] = pose.target;
  return {
    position: [tx + (px - tx) * k, ty + (py - ty) * k, tz + (pz - tz) * k],
    target: pose.target,
  };
}
