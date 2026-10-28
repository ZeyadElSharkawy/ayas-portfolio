'use client';

// Opt-in sound for the whole site, synthesised with Web Audio (no audio files): the oud, qanun and
// tabla phrases in Cultural Echoes, plus small cues for the atelier's interactions (a thread pull on
// navigation, cracking ice, a sewing machine, a ticket tearing…). Off until the visitor switches it
// on with the header toggle; the choice is remembered.

import { useSyncExternalStore } from 'react';

const KEY = 'atelier-sound';
const listeners = new Set<() => void>();
let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

try {
  enabled = typeof window !== 'undefined' && window.localStorage.getItem(KEY) === 'on';
} catch {
  enabled = false;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit.
  }
  if (on) audio(); // create/resume the context inside the click that enabled it
  listeners.forEach((l) => l());
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => enabled,
    () => false,
  );
}

function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return { ctx, out: master! };
}

// Maqam Hijaz on D: D E♭ F♯ G A B♭ C D.
const D4 = 293.66;
const hijaz = [1, 1.0595, 1.26, 1.335, 1.498, 1.587, 1.782, 2].map((r) => D4 * r);

/** A plucked string: two detuned oscillators through a closing low-pass filter. */
function pluck(at: number, freq: number, { bright = 1800, decay = 0.7, level = 0.6 } = {}) {
  const { ctx, out } = audio();
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(level, at + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(bright, at);
  filter.frequency.exponentialRampToValueAtTime(400, at + decay);
  filter.connect(env).connect(out);
  for (const [type, detune] of [
    ['triangle', 0],
    ['sawtooth', 7],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + decay + 0.05);
  }
}

/** Tabla: "dum" is a low pitch-dropping thump, "tak" a short bright slap. */
function drum(at: number, kind: 'dum' | 'tak') {
  const { ctx, out } = audio();
  const env = ctx.createGain();
  env.connect(out);
  if (kind === 'dum') {
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(140, at);
    osc.frequency.exponentialRampToValueAtTime(62, at + 0.25);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(1, at + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.4);
    osc.connect(env);
    osc.start(at);
    osc.stop(at + 0.45);
    return;
  }
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 2800;
  band.Q.value = 2;
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(0.7, at + 0.002);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
  noise.connect(band).connect(env);
  noise.start(at);
}

export type Instrument = 'oud' | 'qanun' | 'tabla';

export function playPhrase(instrument: Instrument) {
  if (!enabled) return;
  const now = audio().ctx.currentTime + 0.02;
  if (instrument === 'oud') {
    [0, 1, 2, 3, 2, 1, 0].forEach((n, i) => pluck(now + i * 0.17, hijaz[n] / 2, { bright: 1600, decay: 0.8 }));
  } else if (instrument === 'qanun') {
    [7, 6, 5, 4, 3, 4, 5, 7].forEach((n, i) => pluck(now + i * 0.085, hijaz[n], { bright: 4200, decay: 0.45, level: 0.4 }));
  } else {
    (['dum', 'tak', 'tak', 'dum', 'tak'] as const).forEach((k, i) => drum(now + [0, 0.22, 0.33, 0.55, 0.77][i], k));
  }
}

// ---------------------------------------------------------------- interaction cues

let noiseBuffer: AudioBuffer | null = null;

/** White noise through a filter and an envelope: the base of most cues below. */
type NoiseOptions = { type?: BiquadFilterType; freq?: number; to?: number; q?: number; level?: number; attack?: number };

function noise(at: number, dur: number, { type = 'bandpass', freq = 2000, to = freq, q = 1, level = 0.5, attack = 0.004 }: NoiseOptions = {}) {
  const { ctx, out } = audio();
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, at);
  if (to !== freq) filter.frequency.exponentialRampToValueAtTime(to, at + dur);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(level, at + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(env).connect(out);
  src.start(at, Math.random() * 1.5);
  src.stop(at + dur + 0.05);
  return env;
}

/** A short sine or square tone with a pitch glide. */
function tone(at: number, dur: number, { freq = 600, to = freq, type = 'sine', level = 0.3 }: { freq?: number; to?: number; type?: OscillatorType; level?: number } = {}) {
  const { ctx, out } = audio();
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, at + dur);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(level, at + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(env).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export type Cue = 'thread' | 'tick' | 'blip' | 'crack' | 'shatter' | 'freeze' | 'tear' | 'shutter' | 'slide' | 'curtain' | 'whoosh';

const lastPlayed: Partial<Record<Cue, number>> = {};
/** Minimum gap between repeats, so pointer-driven cues don't pile up. */
const SPACING: Partial<Record<Cue, number>> = { crack: 0.07, blip: 0.045, tick: 0.03, whoosh: 0.25 };

export function cue(name: Cue) {
  if (!enabled) return;
  const { ctx } = audio();
  const now = ctx.currentTime + 0.01;
  if (now - (lastPlayed[name] ?? -1) < (SPACING[name] ?? 0)) return;
  lastPlayed[name] = now;
  const r = Math.random();
  switch (name) {
    case 'thread': // pulling thread through cloth: a soft rising hiss with a faint pitch
      noise(now, 0.32, { freq: 900, to: 3200, q: 3, level: 0.18, attack: 0.08 });
      tone(now + 0.04, 0.26, { freq: 520, to: 780, level: 0.05 });
      break;
    case 'tick':
      noise(now, 0.025, { freq: 3200, q: 4, level: 0.25 });
      break;
    case 'blip': // Aya talking: a soft, pitched murmur per syllable
      tone(now, 0.06, { freq: 440 + r * 160, type: 'triangle', level: 0.07 });
      break;
    case 'crack': // ice: a sharp snap and a glassy ping
      noise(now, 0.07, { type: 'highpass', freq: 2600, level: 0.5, attack: 0.001 });
      tone(now + 0.005, 0.18, { freq: 2200 + r * 1800, to: 1600 + r * 900, level: 0.05 });
      break;
    case 'shatter':
      for (let i = 0; i < 9; i++) {
        noise(now + i * 0.035 + Math.random() * 0.03, 0.08, { type: 'highpass', freq: 2200 + Math.random() * 2000, level: 0.35, attack: 0.001 });
        tone(now + 0.05 + i * 0.05, 0.3, { freq: 1800 + Math.random() * 2600, level: 0.035 });
      }
      noise(now, 0.6, { type: 'lowpass', freq: 900, to: 200, level: 0.12 });
      break;
    case 'freeze': // frost spreading back: a falling shimmer
      noise(now, 0.9, { freq: 6000, to: 1800, q: 6, level: 0.12, attack: 0.2 });
      break;
    case 'tear': // paper: a grainy tear sweeping up
      for (let i = 0; i < 7; i++) noise(now + i * 0.04, 0.05, { freq: 900 + i * 380, q: 1.5, level: 0.3 + Math.random() * 0.2, attack: 0.002 });
      break;
    case 'shutter': // camera: two quick mechanical clicks
      noise(now, 0.02, { freq: 2600, q: 2, level: 0.45, attack: 0.001 });
      noise(now + 0.07, 0.03, { type: 'lowpass', freq: 1400, level: 0.35, attack: 0.001 });
      break;
    case 'slide': // a wooden screen sliding in its track
      noise(now, 0.65, { type: 'lowpass', freq: 380, to: 620, level: 0.3, attack: 0.15 });
      noise(now, 0.65, { freq: 1200, q: 8, level: 0.03, attack: 0.15 });
      break;
    case 'curtain': // heavy velvet: a long, low swish
      noise(now, 1.9, { type: 'lowpass', freq: 260, to: 900, level: 0.22, attack: 0.5 });
      break;
    case 'whoosh': // the hoop swinging past
      noise(now, 0.4, { freq: 500, to: 1500, q: 2, level: 0.14, attack: 0.12 });
      break;
  }
}

let machine: { users: number; stop: () => void } | null = null;

/**
 * A sewing machine for as long as it runs: needle strokes at ~14 per second over a motor hum.
 * Shared, so several portraits stitching at once run one machine. Returns a stop function; does
 * nothing (and returns a no-op) while sound is off.
 */
export function startSewing(): () => void {
  if (!enabled) return () => {};
  if (!machine) machine = { users: 0, stop: runMachine() };
  machine.users++;
  let released = false;
  return () => {
    if (released || !machine) return;
    released = true;
    if (--machine.users === 0) {
      machine.stop();
      machine = null;
    }
  };
}

function runMachine(): () => void {
  const { ctx, out } = audio();
  const at = ctx.currentTime + 0.01;
  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0.0001, at);
  bus.gain.exponentialRampToValueAtTime(1, at + 0.15);
  bus.connect(out);

  const motor = ctx.createOscillator();
  motor.type = 'sawtooth';
  motor.frequency.value = 92;
  const motorFilter = ctx.createBiquadFilter();
  motorFilter.type = 'lowpass';
  motorFilter.frequency.value = 260;
  const motorGain = ctx.createGain();
  motorGain.gain.value = 0.09;
  motor.connect(motorFilter).connect(motorGain).connect(bus);

  // Needle strokes: noise gated by a 14 Hz square wave.
  if (!noiseBuffer) noise(at, 0.001, { level: 0.0001 });
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1700;
  band.Q.value = 1.4;
  const gate = ctx.createGain();
  gate.gain.value = 0;
  const lfo = ctx.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 14;
  const depth = ctx.createGain();
  depth.gain.value = 0.11;
  lfo.connect(depth).connect(gate.gain);
  src.connect(band).connect(gate).connect(bus);

  for (const node of [motor, src, lfo]) node.start(at);
  return () => {
    const t = ctx.currentTime;
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    for (const node of [motor, src, lfo]) node.stop(t + 0.15);
  };
}
