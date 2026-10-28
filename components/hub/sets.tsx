'use client';

// The Atelier Floor: one themed bay per selected work, set against the back wall.
// Each bay is a small stage in that project's world, with its mannequin in front.
// Grey-box primitives; Phase 3 swaps in modelled props.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { BAY, type Bay } from '@/lib/hub/stations';
import { BRASS, DressForm, Lattice, WOOD, type Handlers } from './props';

export function BaySet({
  bay,
  colors,
  highlighted,
  active,
  lowered,
  reduced,
  ...handlers
}: {
  bay: Bay;
  colors: string[];
  highlighted: boolean;
  /** This bay's slide is open: its world opens out. */
  active: boolean;
  /** Another bay's slide is open: this one sinks through the floor, out of the way. */
  lowered: boolean;
  reduced: boolean;
} & Handlers) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const y = lowered ? -3.2 : 0;
    g.position.y = reduced ? y : THREE.MathUtils.damp(g.position.y, y, 4, dt);
    g.visible = g.position.y > -3.1;
  });

  const wall = bay.mood.wall;
  const form = <DressForm position={[0, 0.06, BAY.z]} colors={colors} highlighted={highlighted} />;
  return (
    <group ref={group} position={[bay.x, 0, 0]} {...handlers}>
      <Proscenium active={active} color={wall} reduced={reduced} />
      {bay.set === 'cairo-door' && (
        <>
          <CairoDoor wall={wall} />
          {form}
        </>
      )}
      {bay.set === 'mashrabiya' && (
        <>
          <MashrabiyaWall colors={colors} wall={wall} />
          <DressForm position={[-0.25, 0.06, BAY.z]} colors={colors} highlighted={highlighted} />
          {/* Mother and daughter: the capsule is designed as a pair */}
          <group position={[0.38, 0.06, BAY.z + 0.15]} scale={0.7}>
            <DressForm position={[0, 0, 0]} colors={colors} highlighted={highlighted} />
          </group>
        </>
      )}
      {bay.set === 'banners' && <BannerInstallation colors={colors} wall={wall} highlighted={highlighted} />}
      {bay.set === 'ice' && (
        <>
          <IceWall wall={wall} active={active} reduced={reduced} />
          {form}
        </>
      )}
      {bay.set === 'hoop' && (
        <>
          <HoopWall wall={wall} reduced={reduced} />
          {form}
        </>
      )}
      {bay.set !== 'banners' && (
        <mesh position={[0, 0.03, BAY.z]} receiveShadow>
          <cylinderGeometry args={[0.55, 0.58, 0.06, 40]} />
          <meshStandardMaterial color={bay.set === 'ice' ? '#e9f4fc' : '#e4c9a6'} roughness={bay.set === 'ice' ? 0.12 : 0.8} />
        </mesh>
      )}
    </group>
  );
}

/**
 * When a bay's slide opens (and the other bays have sunk away), its world opens out: wings in the
 * work's colour slide out along the back wall on either side of the set, and the floor ahead takes
 * the same tint. With the scene background easing to that colour, the bay becomes its own room.
 */
function Proscenium({ active, color, reduced }: { active: boolean; color: string; reduced: boolean }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const lintel = useRef<THREE.Group>(null);
  const floor = useRef<THREE.Mesh>(null);
  const shade = useMemo(() => new THREE.Color(color).multiplyScalar(0.93).getStyle(), [color]);
  const WING = 4.2;
  const INNER = BAY.width / 2;
  const Z = BAY.backdropZ;

  useFrame((_, dt) => {
    const target = active ? 1 : 0.0001;
    for (const g of [left.current, right.current]) {
      if (!g) continue;
      g.scale.x = reduced ? target : THREE.MathUtils.damp(g.scale.x, target, 5, dt);
      g.visible = g.scale.x > 0.01;
    }
    if (lintel.current) {
      const s = lintel.current.scale;
      s.y = reduced ? target : THREE.MathUtils.damp(s.y, target, 5, dt);
      lintel.current.visible = s.y > 0.01;
    }
    if (floor.current) {
      const m = floor.current.material as THREE.MeshStandardMaterial;
      m.opacity = reduced ? (active ? 1 : 0) : THREE.MathUtils.damp(m.opacity, active ? 1 : 0, 5, dt);
      floor.current.visible = m.opacity > 0.01;
    }
  });

  const wing = (
    <mesh position={[WING / 2, 2.3, 0]} receiveShadow>
      <boxGeometry args={[WING, 4.6, 0.04]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );

  return (
    <>
      <group ref={lintel} position={[0, BAY.height, Z]} scale={[1, 0.0001, 1]} visible={false}>
        <mesh position={[0, (ROOM_H - BAY.height) / 2, 0]}>
          <boxGeometry args={[BAY.width, ROOM_H - BAY.height, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      </group>
      <group ref={right} position={[INNER, 0, Z]} scale={[0.0001, 1, 1]} visible={false}>
        {wing}
      </group>
      <group ref={left} position={[-INNER, 0, Z]} rotation={[0, Math.PI, 0]} scale={[0.0001, 1, 1]} visible={false}>
        {wing}
      </group>
      <mesh ref={floor} position={[0, 0.004, Z + 3.2]} rotation={[-Math.PI / 2, 0, 0]} visible={false} receiveShadow>
        <planeGeometry args={[2 * (INNER + WING), 6.4]} />
        <meshStandardMaterial color={shade} roughness={0.95} transparent opacity={0} />
      </mesh>
    </>
  );
}

/** Backdrop flat for a bay, flush with the back wall. */
function Backdrop({ color, roughness = 0.9 }: { color: string; roughness?: number }) {
  return (
    <mesh position={[0, BAY.height / 2, BAY.backdropZ]} receiveShadow>
      <boxGeometry args={[BAY.width, BAY.height, 0.06]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

const front = BAY.backdropZ + 0.035;
const ROOM_H = 4.6;

// ---------------------------------------------------------------- Cultural Echoes

/** The turquoise pointed-arch doors of old Cairo, set in a stone wall. */
function CairoDoor({ wall }: { wall: string }) {
  const { door, frame } = useMemo(() => {
    const arch = (w: number, h: number, peak: number) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2, 0);
      s.lineTo(-w / 2, h);
      s.quadraticCurveTo(-w / 2, h + peak * 0.75, 0, h + peak);
      s.quadraticCurveTo(w / 2, h + peak * 0.75, w / 2, h);
      s.lineTo(w / 2, 0);
      s.closePath();
      return s;
    };
    const opts = { depth: 0.05, bevelEnabled: false };
    return {
      door: new THREE.ExtrudeGeometry(arch(0.86, 1.45, 0.55), opts),
      frame: new THREE.ExtrudeGeometry(arch(1.08, 1.5, 0.66), opts),
    };
  }, []);

  return (
    <group>
      <Backdrop color={wall} />
      {/* Stone courses */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 0.38 * (i + 1), front]}>
          <boxGeometry args={[BAY.width, 0.012, 0.004]} />
          <meshStandardMaterial color="#b89a70" />
        </mesh>
      ))}
      <mesh geometry={frame} position={[0, 0, front]} castShadow receiveShadow>
        <meshStandardMaterial color="#c4a273" roughness={0.9} />
      </mesh>
      <mesh geometry={door} position={[0, 0, front + 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#1d8a96" roughness={0.6} />
      </mesh>
      {/* The seam between the two leaves, and a grid of studs */}
      <mesh position={[0, 1, front + 0.105]}>
        <boxGeometry args={[0.02, 2.0, 0.01]} />
        <meshStandardMaterial color="#0f4b52" />
      </mesh>
      {Array.from({ length: 4 }, (_, r) =>
        [-0.28, -0.14, 0.14, 0.28].map((x) => (
          <mesh key={`${r}${x}`} position={[x, 0.35 + r * 0.32, front + 0.11]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
          </mesh>
        )),
      )}
    </group>
  );
}

// ---------------------------------------------------------------- Carina Arabesque

/** A plaster wall with a backlit mashrabiya and an arabesque rosette in the capsule's colours. */
function MashrabiyaWall({ colors, wall }: { colors: string[]; wall: string }) {
  return (
    <group>
      <Backdrop color={wall} />
      {/* Warm light behind the lattice */}
      <mesh position={[0, 1.55, front + 0.002]}>
        <planeGeometry args={[1.18, 1.48]} />
        <meshBasicMaterial color="#fff2d2" toneMapped={false} />
      </mesh>
      <group position={[0, 1.55, front + 0.04]}>
        <Lattice width={1.2} height={1.5} step={0.2} color={WOOD} />
      </group>
      <Rosette position={[0, 2.5, front + 0.03]} colors={colors} />
    </group>
  );
}

function Rosette({ position, colors }: { position: [number, number, number]; colors: string[] }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.14, 0.018, 8, 40]} />
        <meshStandardMaterial color={colors[3] ?? colors[0]} roughness={0.6} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0]} rotation={[0, 0, a]} scale={[1.6, 0.8, 0.5]}>
            <sphereGeometry args={[0.04, 12, 8]} />
            <meshStandardMaterial color={colors[i % 2 ? 0 : 4] ?? colors[0]} roughness={0.6} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.05, 16, 12]} />
        <meshStandardMaterial color={colors[1] ?? colors[0]} roughness={0.6} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------- In Honor of Our Women

/** The textile installation: an embroidered banner between strips of archive photographs. */
function BannerInstallation({ colors, wall, highlighted }: { colors: string[]; wall: string; highlighted: boolean }) {
  const [base, accent] = colors;
  return (
    <group>
      <Backdrop color={wall} />
      <Banner position={[0, 2.6, BAY.backdropZ + 0.25]} base={base} accent={accent} highlighted={highlighted} />
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, 2.5, BAY.backdropZ + 0.12]}>
          <mesh position={[0, -0.85, 0]} castShadow>
            <boxGeometry args={[0.24, 1.7, 0.01]} />
            <meshStandardMaterial color="#2b2526" roughness={0.9} />
          </mesh>
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} position={[0, -0.2 - i * 0.32, 0.007]}>
              <planeGeometry args={[0.18, 0.24]} />
              <meshStandardMaterial color={i % 2 ? '#8d8580' : '#bdb5ae'} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Banner({ position, base, accent, highlighted }: { position: [number, number, number]; base: string; accent: string; highlighted: boolean }) {
  const cloth = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (cloth.current) cloth.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * (highlighted ? 0.06 : 0.025);
  });
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.95, 10]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
      </mesh>
      <group ref={cloth}>
        <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.66, 1.9, 0.01]} />
          <meshStandardMaterial color={base} roughness={0.95} />
        </mesh>
        {[-0.36, 0.36].map((x) => (
          <mesh key={x} position={[x, -1.0, 0]} castShadow>
            <boxGeometry args={[0.1, 1.9, 0.012]} />
            <meshStandardMaterial color={accent} roughness={0.8} />
          </mesh>
        ))}
        {/* Stand-ins for the embroidered line portraits */}
        {[-0.55, -1.35].map((y) => (
          <mesh key={y} position={[-0.08, y, 0.008]}>
            <ringGeometry args={[0.12, 0.13, 40]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        ))}
        {[-0.5, -0.6, -0.7, -1.3, -1.4, -1.5].map((y) => (
          <mesh key={y} position={[0.14, y, 0.008]}>
            <planeGeometry args={[0.16, 0.012]} />
            <meshBasicMaterial color="#2b1a1d" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- Glacier

/** Seeded random, so the cracks and snow look the same on every load. */
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** A cracked ice wall with snowflakes, and snow falling while the slide is open. */
function IceWall({ wall, active, reduced }: { wall: string; active: boolean; reduced: boolean }) {
  const cracks = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 6 }, () => {
      let x = (r() - 0.5) * 1.2;
      let y = 0.3 + r() * 2.1;
      const pts: [number, number, number][] = [[x, y, front + 0.01]];
      for (let i = 0; i < 6; i++) {
        x += (r() - 0.5) * 0.35;
        y += (r() - 0.5) * 0.4;
        pts.push([Math.max(-0.78, Math.min(0.78, x)), Math.max(0.05, Math.min(2.65, y)), front + 0.01]);
      }
      return pts;
    });
  }, []);

  return (
    <group>
      <Backdrop color={wall} roughness={0.25} />
      {cracks.map((pts, i) => (
        <Line key={i} points={pts} color="#ffffff" lineWidth={1.4} transparent opacity={0.9} />
      ))}
      {[
        [-0.45, 2.2, 0.16],
        [0.5, 1.75, 0.12],
        [-0.55, 1.1, 0.09],
        [0.35, 2.45, 0.08],
      ].map(([x, y, s]) => (
        <Snowflake key={`${x}${y}`} position={[x, y, front + 0.012]} size={s} />
      ))}
      <Snow active={active} reduced={reduced} />
    </group>
  );
}

function Snowflake({ position, size }: { position: [number, number, number]; size: number }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <planeGeometry args={[size * 2, size * 0.18]} />
          <meshBasicMaterial color="#5fb9d6" />
        </mesh>
      ))}
    </group>
  );
}

function Snow({ active, reduced }: { active: boolean; reduced: boolean }) {
  const count = 160;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const r = rng(11);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (r() - 0.5) * 1.8;
      p[i * 3 + 1] = r() * 2.8;
      p[i * 3 + 2] = BAY.backdropZ + 0.1 + r() * 1.4;
    }
    return p;
  }, []);

  useFrame(({ clock }, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const mat = pts.material as THREE.PointsMaterial;
    mat.opacity = THREE.MathUtils.damp(mat.opacity, active ? 0.9 : 0.25, 4, dt);
    if (reduced) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= dt * (0.18 + (i % 5) * 0.03);
      arr[i * 3] += Math.sin(t + i) * dt * 0.03;
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 2.8;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.035} transparent opacity={0.25} depthWrite={false} />
    </points>
  );
}

// ---------------------------------------------------------------- Into Her Skin

/** Lavender wall with the booklet's golden ring, and an aerial hoop turning slowly. */
function HoopWall({ wall, reduced }: { wall: string; reduced: boolean }) {
  const hoop = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (hoop.current && !reduced) hoop.current.rotation.y += dt * 0.35;
  });
  return (
    <group>
      <Backdrop color={wall} />
      <mesh position={[0, 1.55, front + 0.005]}>
        <ringGeometry args={[0.66, 0.7, 64]} />
        <meshStandardMaterial color="#d4a63a" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Rope from the ceiling, and the hoop */}
      <mesh position={[0, 3.77, BAY.z - 0.35]}>
        <cylinderGeometry args={[0.008, 0.008, 1.66, 6]} />
        <meshStandardMaterial color="#3e3a6e" />
      </mesh>
      <group ref={hoop} position={[0, 2.56, BAY.z - 0.35]}>
        <mesh castShadow>
          <torusGeometry args={[0.38, 0.02, 12, 64]} />
          <meshStandardMaterial color="#1f1d33" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
