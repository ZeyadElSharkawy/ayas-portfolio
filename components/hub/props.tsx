'use client';

// Grey-box props for the atelier. Primitives only: proportions, light and interaction come first;
// real models replace these in Phase 3.

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Site palette, in 3D.
export const CLAY = '#d9be9c';
export const WOOD = '#6b3a2a';
export const THREAD = '#9e4f2e';
export const FOREST = '#2f5643';
export const ORANGE = '#e69e52';
export const BURGUNDY = '#572530';
export const BRASS = '#b08d57';

export type Handlers = {
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
};

// ---------------------------------------------------------------- room

export const ROOM = { halfX: 7, halfZ: 5, height: 4.6 };
export const WINDOW = { z: -1.4, y: 2.3, w: 2.6, h: 2.8 };

export function Room() {
  const { halfX, halfZ, height } = ROOM;
  const wallT = 0.2;
  // Left wall is four boxes around the window opening.
  const wz0 = WINDOW.z - WINDOW.w / 2;
  const wz1 = WINDOW.z + WINDOW.w / 2;
  const wy0 = WINDOW.y - WINDOW.h / 2;
  const wy1 = WINDOW.y + WINDOW.h / 2;
  const wall = <meshStandardMaterial color="#efdcc2" roughness={0.95} />;

  return (
    <group>
      {/* Floor slab, a diorama base */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[halfX * 2, 0.3, halfZ * 2]} />
        <meshStandardMaterial color="#e8d2b6" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -halfZ - wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[halfX * 2 + wallT * 2, height, wallT]} />
        {wall}
      </mesh>
      {/* Left wall around the window */}
      <group position={[-halfX - wallT / 2, 0, 0]}>
        <mesh position={[0, height / 2, (-halfZ + wz0) / 2]} receiveShadow castShadow>
          <boxGeometry args={[wallT, height, wz0 + halfZ]} />
          {wall}
        </mesh>
        <mesh position={[0, height / 2, (wz1 + halfZ) / 2]} receiveShadow castShadow>
          <boxGeometry args={[wallT, height, halfZ - wz1]} />
          {wall}
        </mesh>
        <mesh position={[0, wy0 / 2, WINDOW.z]} receiveShadow castShadow>
          <boxGeometry args={[wallT, wy0, WINDOW.w]} />
          {wall}
        </mesh>
        <mesh position={[0, (wy1 + height) / 2, WINDOW.z]} receiveShadow castShadow>
          <boxGeometry args={[wallT, height - wy1, WINDOW.w]} />
          {wall}
        </mesh>
      </group>
      {/* The window's mashrabiya: its shadow falls across the floor */}
      <group position={[-halfX - 0.1, WINDOW.y, WINDOW.z]} rotation={[0, Math.PI / 2, 0]}>
        <Lattice width={WINDOW.w} height={WINDOW.h} />
      </group>
      {/* Bright sky behind the window so the opening reads as daylight */}
      <mesh position={[-halfX - 1.2, WINDOW.y, WINDOW.z]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[WINDOW.w + 1.5, WINDOW.h + 1.5]} />
        <meshBasicMaterial color="#fff1dc" toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * A mashrabiya lattice of turned spindles, centred on its group's origin in the local XY plane.
 * Used in the window and in the Carina Arabesque set.
 */
export function Lattice({ width, height, step = 0.26, color = WOOD }: { width: number; height: number; step?: number; color?: string }) {
  const { bars, beads } = useMemo(() => {
    const cols = Math.max(1, Math.floor(width / step));
    const rows = Math.max(1, Math.floor(height / step));
    const bars: THREE.Matrix4[] = [];
    const beads: THREE.Matrix4[] = [];
    const m = () => new THREE.Matrix4();
    const bead = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 4));
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c * width) / cols;
      bars.push(m().compose(new THREE.Vector3(x, 0, 0), new THREE.Quaternion(), new THREE.Vector3(0.035, height, 0.05)));
    }
    for (let r = 0; r <= rows; r++) {
      const y = -height / 2 + (r * height) / rows;
      bars.push(m().compose(new THREE.Vector3(0, y, 0), new THREE.Quaternion(), new THREE.Vector3(width, 0.035, 0.05)));
      for (let c = 0; c <= cols; c++) {
        const x = -width / 2 + (c * width) / cols;
        beads.push(m().compose(new THREE.Vector3(x, y, 0), bead, new THREE.Vector3(0.09, 0.09, 0.07)));
      }
    }
    return { bars, beads };
  }, [width, height, step]);

  return (
    <>
      <InstancedBoxes matrices={bars} color={color} />
      <InstancedBoxes matrices={beads} color={color} />
    </>
  );
}

function InstancedBoxes({ matrices, color }: { matrices: THREE.Matrix4[]; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]} castShadow>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.8} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------- shared

/** Dashed thread ellipse on the floor; fades in when `active`. */
export function StitchRing({ radii, active, position }: { radii: [number, number]; active: boolean; position: [number, number, number] }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radii[0], 0, Math.sin(a) * radii[1]]);
    }
    return pts;
  }, [radii]);
  const ref = useRef<{ material: THREE.Material & { opacity: number } }>(null);

  useFrame((_, dt) => {
    const mat = ref.current?.material;
    if (mat) mat.opacity = THREE.MathUtils.damp(mat.opacity, active ? 0.95 : 0, 8, dt);
  });

  return (
    <Line
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      points={points}
      position={[position[0], 0.012, position[2]]}
      color={THREAD}
      lineWidth={2}
      dashed
      dashSize={0.14}
      gapSize={0.09}
      transparent
      opacity={0}
    />
  );
}

/** Eases a group's lift towards a hovered state. */
export function useLift(active: boolean, amount = 0.06) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.y = THREE.MathUtils.damp(g.position.y, active ? amount : 0, 10, dt);
  });
  return ref;
}

// ---------------------------------------------------------------- dress form

let torsoGeometry: THREE.LatheGeometry | null = null;
export function getTorso() {
  // Profile of a dress form: hip, waist, bust, shoulders, neck (radius, height).
  torsoGeometry ??= new THREE.LatheGeometry(
    [
      [0.001, 0],
      [0.17, 0.01],
      [0.2, 0.12],
      [0.17, 0.27],
      [0.145, 0.36],
      [0.19, 0.5],
      [0.19, 0.58],
      [0.15, 0.68],
      [0.07, 0.74],
      [0.05, 0.8],
      [0.001, 0.81],
    ].map(([r, y]) => new THREE.Vector2(r, y)),
    40,
  );
  return torsoGeometry;
}

/** A dress form wearing a skirt and sash in its project's colours. */
export function DressForm({
  position,
  rotation = 0,
  colors,
  highlighted,
  ...handlers
}: { position: [number, number, number]; rotation?: number; colors: string[]; highlighted: boolean } & Handlers) {
  const lift = useLift(highlighted);
  const skirt = colors[0];
  const sash = colors[2] ?? colors[1] ?? colors[0];
  return (
    <group position={position} rotation={[0, rotation, 0]} {...handlers}>
      <group ref={lift}>
        <mesh geometry={getTorso()} position={[0, 0.98, 0]} scale={[1, 1, 0.78]} castShadow receiveShadow>
          <meshStandardMaterial color={CLAY} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.86, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.36, 0.5, 32, 1, true]} />
          <meshStandardMaterial color={skirt} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.34, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.78, 1]} castShadow>
          <torusGeometry args={[0.155, 0.03, 10, 40]} />
          <meshStandardMaterial color={sash} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.83, 0]} castShadow>
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.28} />
        </mesh>
      </group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.95, 12]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.03, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.5]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------- digital lab

export function DigitalLab({ highlighted, reduced }: { highlighted: boolean; reduced: boolean }) {
  const holo = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  const lift = useLift(highlighted);
  useFrame((_, dt) => {
    if (holo.current && !reduced) holo.current.rotation.y += dt * 0.5;
    if (orbit.current && !reduced) orbit.current.rotation.y -= dt * 0.22;
  });
  return (
    <group>
      {/* A holographic fitting pod with orbit rings and a projected garment. */}
      <group position={[4.0, 0, -3.3]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.5, 0.9, 40]} />
          <meshStandardMaterial color="#17263d" metalness={0.72} roughness={0.28} emissive="#071528" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.905, 0]}>
          <ringGeometry args={[0.34, 0.39, 64]} />
          <meshBasicMaterial color="#36d9e8" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.91, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.3, 48]} />
          <meshBasicMaterial color="#36d9e8" transparent opacity={0.12} toneMapped={false} />
        </mesh>
        <group ref={lift}>
          <mesh ref={holo} geometry={getTorso()} position={[0, 1.05, 0]} scale={[1.3, 1.3, 1]}>
            <meshBasicMaterial color="#48e5f1" wireframe transparent opacity={0.78} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <group ref={orbit} position={[0, 1.35, 0]}>
            {[0.54, 0.69].map((radius, i) => (
              <mesh key={radius} rotation={[Math.PI / 2 + i * 0.45, i * 0.35, 0]}>
                <torusGeometry args={[radius, 0.008, 6, 72]} />
                <meshBasicMaterial color={i === 0 ? '#48e5f1' : '#9a8cff'} transparent opacity={0.72} toneMapped={false} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, 1.45, 0]}>
            <cylinderGeometry args={[0.42, 0.24, 1.2, 40, 1, true]} />
            <meshBasicMaterial
              color="#36d9e8"
              transparent
              opacity={0.11}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
      {/* Dark workstation with a luminous interface. */}
      <group position={[5.6, 0, -4.15]}>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.05, 0.7]} />
          <meshStandardMaterial color="#17263d" metalness={0.6} roughness={0.32} />
        </mesh>
        {[
          [-0.6, -0.3],
          [0.6, -0.3],
          [-0.6, 0.3],
          [0.6, 0.3],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.37, z]} castShadow>
            <boxGeometry args={[0.04, 0.74, 0.04]} />
            <meshStandardMaterial color={WOOD} />
          </mesh>
        ))}
        <mesh position={[0, 1.1, -0.15]} castShadow>
          <boxGeometry args={[0.9, 0.55, 0.04]} />
          <meshStandardMaterial color="#0b1526" metalness={0.45} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.1, -0.128]}>
          <planeGeometry args={[0.84, 0.49]} />
          <meshBasicMaterial color="#0c2538" toneMapped={false} />
        </mesh>
        <group position={[0, 1.1, -0.12]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[-0.26 + (i % 2) * 0.2, 0.11 - Math.floor(i / 2) * 0.18, 0.003]}>
              <planeGeometry args={[0.13, 0.035]} />
              <meshBasicMaterial color={i === 0 ? '#48e5f1' : '#9a8cff'} toneMapped={false} />
            </mesh>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={`line-${i}`} position={[0.13, 0.12 - i * 0.11, 0.003]}>
              <planeGeometry args={[0.2, 0.012]} />
              <meshBasicMaterial color="#48e5f1" transparent opacity={0.72} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- styling room

export function StylingRoom({ highlighted, colors }: { highlighted: boolean; colors: string[] }) {
  const lift = useLift(highlighted, 0.04);
  return (
    <group position={[5.1, 0, 2.0]} rotation={[0, -0.35, 0]}>
      {/* Clothing rail */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.7, 10]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 1.84, 10]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.28} />
      </mesh>
      <group ref={lift}>
        {colors.map((c, i) => (
          <mesh key={c + i} position={[-0.65 + i * 0.32, 1.22, 0]} rotation={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.36, 0.9, 0.05]} />
            <meshStandardMaterial color={c} roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* Standing mirror */}
      <group position={[1.5, 0, 0.4]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.7, 1.9, 0.05]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.95, 0.028]}>
          <planeGeometry args={[0.6, 1.8]} />
          <meshStandardMaterial color="#e4e8e6" metalness={0.95} roughness={0.06} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------- desk

export function Desk({ highlighted }: { highlighted: boolean }) {
  const lift = useLift(highlighted, 0.04);
  return (
    <group position={[-4.3, 0, 1.7]} rotation={[0, 0.35, 0]}>
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color="#8c5a3c" roughness={0.7} />
      </mesh>
      {[
        [-0.82, -0.38],
        [0.82, -0.38],
        [-0.82, 0.38],
        [0.82, 0.38],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.38, z]} castShadow>
          <boxGeometry args={[0.05, 0.76, 0.05]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
      ))}
      <group ref={lift}>
        {/* Open sketchbook */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.19 - 0.25, 0.81, 0.1]} rotation={[0, 0, s * -0.08]} castShadow>
            <boxGeometry args={[0.38, 0.015, 0.5]} />
            <meshStandardMaterial color="#fbf4ea" roughness={0.95} />
          </mesh>
        ))}
        {/* Sewing machine */}
        <group position={[0.45, 0.79, -0.1]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.55, 0.12, 0.22]} />
            <meshStandardMaterial color="#f3e9db" roughness={0.5} />
          </mesh>
          <mesh position={[0.2, 0.22, 0]} castShadow>
            <boxGeometry args={[0.12, 0.3, 0.18]} />
            <meshStandardMaterial color="#f3e9db" roughness={0.5} />
          </mesh>
          <mesh position={[-0.02, 0.33, 0]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.16]} />
            <meshStandardMaterial color="#f3e9db" roughness={0.5} />
          </mesh>
          <mesh position={[-0.05, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.07, 16]} />
            <meshStandardMaterial color={THREAD} roughness={0.8} />
          </mesh>
        </group>
      </group>
      {/* Stool */}
      <mesh position={[0, 0.25, 0.8]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 24]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
    </group>
  );
}
