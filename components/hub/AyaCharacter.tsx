'use client';

// Aya at her desk in a more expressive, oversized-head cartoon style, with a teal hijab, pale
// abaya, graphic face and white heels. She waves when a conversation starts and nods while she talks.

import { useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ayaLook } from '@/content/about';
import type { Handlers } from './props';

// The inner dress, hem to neck (radius, height).
const DRESS_PROFILE: [number, number][] = [
  [0.001, 0.05],
  [0.27, 0.06],
  [0.25, 0.35],
  [0.2, 0.8],
  [0.155, 0.98],
  [0.15, 1.05],
  [0.17, 1.18],
  [0.19, 1.3],
  [0.11, 1.38],
  [0.05, 1.42],
  [0.001, 1.43],
];
// The open abaya: a little wider than the dress, from just above the hem to the shoulders.
const ABAYA_PROFILE: [number, number][] = [
  [0.305, 0.08],
  [0.28, 0.35],
  [0.225, 0.8],
  [0.18, 1.0],
  [0.185, 1.18],
  [0.205, 1.3],
  [0.13, 1.39],
];
/** Half-width of the abaya's front opening, in radians around the body. */
const OPENING = 0.36;

const lathe = (profile: [number, number][], phiStart = 0, phiLength = Math.PI * 2) =>
  new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    40,
    phiStart,
    phiLength,
  );

export function AyaCharacter({
  position,
  yaw,
  talking,
  waveKey,
  highlighted,
  reduced,
  ...handlers
}: {
  position: [number, number, number];
  yaw: number;
  /** True while a line is being typed out: she nods and her mouth moves. */
  talking: boolean;
  /** Change this number to make her wave (e.g. when a conversation starts). */
  waveKey: number;
  highlighted: boolean;
  reduced: boolean;
} & Handlers) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const waveArm = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const smile = useRef<THREE.Mesh>(null);
  const wave = useRef({ key: waveKey, start: -10 });

  const geometry = useMemo(() => {
    // In a lathe, the front (+z) is at phi = 0; leave the abaya open there.
    const abaya = lathe(ABAYA_PROFILE, OPENING, Math.PI * 2 - OPENING * 2);
    // The embroidered trim follows each front edge of the abaya, hem to shoulder.
    const trim = [-1, 1].map((side) => {
      const points = ABAYA_PROFILE.map(
        ([r, y]) => new THREE.Vector3(Math.sin(side * OPENING) * (r + 0.006), y, Math.cos(OPENING) * (r + 0.006)),
      );
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 0.016, 6, false);
    });
    return { dress: lathe(DRESS_PROFILE), abaya, trim };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (wave.current.key !== waveKey) wave.current = { key: waveKey, start: t };
    const motion = reduced ? 0 : 1;

    if (body.current) {
      body.current.rotation.z = Math.sin(t * 0.8) * 0.015 * motion;
      body.current.scale.y = 1 + Math.sin(t * 1.6) * 0.006 * motion;
      body.current.position.y = THREE.MathUtils.damp(body.current.position.y, highlighted ? 0.04 : 0, 10, dt);
    }
    if (head.current) {
      head.current.rotation.x = talking ? Math.sin(t * 7) * 0.05 * motion : THREE.MathUtils.damp(head.current.rotation.x, 0, 6, dt);
      head.current.rotation.z = Math.sin(t * 0.6) * 0.04 * motion;
    }
    if (eyes.current) {
      // A quick blink every few seconds.
      eyes.current.scale.y = t % 3.7 < 0.12 ? 0.15 : 1;
    }
    if (mouth.current && smile.current) {
      mouth.current.visible = talking;
      smile.current.visible = !talking;
      if (talking) mouth.current.scale.y = 0.35 + Math.abs(Math.sin(t * 13)) * 0.9 * (reduced ? 0.4 : 1);
    }
    if (waveArm.current) {
      const since = t - wave.current.start;
      // The right arm (+x) raises outward with a positive z-rotation.
      const target = since < 1.9 ? 2.55 + Math.sin(since * 11) * 0.28 * (reduced ? 0 : 1) : 0.14;
      waveArm.current.rotation.z = THREE.MathUtils.damp(waveArm.current.rotation.z, target, 9, dt);
    }
  });

  const skin = <meshStandardMaterial color={ayaLook.skin} roughness={0.65} />;
  const sleeve = <meshStandardMaterial color={ayaLook.abaya} roughness={0.85} />;
  const trim = <meshStandardMaterial color={ayaLook.trim} roughness={0.7} />;
  const hijab = <meshStandardMaterial color={ayaLook.hijab} roughness={0.85} side={THREE.DoubleSide} />;

  return (
    <group position={position} rotation={[0, yaw, 0]} {...handlers}>
      <group ref={body}>
        <mesh geometry={geometry.dress} scale={[1, 1, 0.78]} castShadow receiveShadow>
          <meshStandardMaterial color={ayaLook.dress} roughness={0.85} />
        </mesh>
        <group scale={[1, 1, 0.8]}>
          <mesh geometry={geometry.abaya} castShadow receiveShadow>
            <meshStandardMaterial color={ayaLook.abaya} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
          {geometry.trim.map((g, i) => (
            <mesh key={i} geometry={g} castShadow>
              {trim}
            </mesh>
          ))}
        </group>

        {/* White heels peeking out under the hem */}
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.035, 0.2]} scale={[0.7, 0.45, 1.3]} castShadow>
            <sphereGeometry args={[0.045, 16, 10]} />
            <meshStandardMaterial color={ayaLook.shoes} roughness={0.3} />
          </mesh>
        ))}

        {/* Arms: the left one hangs, the right one waves */}
        <group position={[-0.21, 1.29, 0]} rotation={[0, 0, -0.14]}>
          <Arm skin={skin} sleeve={sleeve} trim={trim} />
        </group>
        <group ref={waveArm} position={[0.21, 1.29, 0]} rotation={[0, 0, 0.14]}>
          <Arm skin={skin} sleeve={sleeve} trim={trim} />
        </group>

        {/* The hijab falls to a point on the chest */}
        <mesh position={[0, 1.31, 0.135]} rotation={[-0.25, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.13, 0.2, 3, 1, true]} />
          {hijab}
        </mesh>

        <group ref={head} position={[0, 1.61, 0]} scale={[1.42, 1.42, 1.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.12, 32, 24]} />
            {skin}
          </mesh>
          <Face eyes={eyes} mouth={mouth} smile={smile} />
          <Hijab material={hijab} />
        </group>
      </group>
    </group>
  );
}

function Arm({ skin, sleeve, trim }: { skin: ReactNode; sleeve: ReactNode; trim: ReactNode }) {
  return (
    <>
      <mesh position={[0, -0.27, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.43, 6, 12]} />
        {sleeve}
      </mesh>
      {/* Embroidered cuff */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.052, 0.014, 8, 20]} />
        {trim}
      </mesh>
      <mesh position={[0, -0.57, 0]} castShadow>
        <sphereGeometry args={[0.042, 12, 10]} />
        {skin}
      </mesh>
    </>
  );
}

/** Large expressive eyes, soft brows, cheek colour and a small smile give the face a cartoon feel. */
function Face({
  eyes,
  mouth,
  smile,
}: {
  eyes: RefObject<THREE.Group | null>;
  mouth: RefObject<THREE.Mesh | null>;
  smile: RefObject<THREE.Mesh | null>;
}) {
  return (
    <>
      <group ref={eyes} position={[0, 0.014, 0.108]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.043, 0, 0]} rotation={[0, s * 0.28, 0]}>
            <mesh scale={[1.3, 0.95, 0.42]}>
              <sphereGeometry args={[0.026, 16, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.002, 0.007]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.0155, 14, 10]} />
              <meshStandardMaterial color={ayaLook.eyes} roughness={0.3} />
            </mesh>
            {/* Upper liner with a wing at the outer corner */}
            <mesh position={[0, 0.02, 0.006]} rotation={[0, 0, s * -0.12]}>
              <boxGeometry args={[0.058, 0.005, 0.004]} />
              <meshStandardMaterial color={ayaLook.liner} />
            </mesh>
            <mesh position={[s * 0.031, 0.024, 0.004]} rotation={[0, 0, s * 0.6]}>
              <boxGeometry args={[0.014, 0.004, 0.004]} />
              <meshStandardMaterial color={ayaLook.liner} />
            </mesh>
            {/* Brow */}
            <mesh position={[0, 0.045, 0.002]} rotation={[0, 0, s * -0.08]}>
              <boxGeometry args={[0.045, 0.006, 0.004]} />
              <meshStandardMaterial color="#5a3a26" />
            </mesh>
          </group>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.066, -0.034, 0.099]} scale={[1, 0.55, 0.2]}>
          <sphereGeometry args={[0.035, 16, 10]} />
          <meshStandardMaterial color="#d98183" roughness={0.75} transparent opacity={0.45} />
        </mesh>
      ))}
      <mesh position={[0, -0.015, 0.11]} scale={[0.52, 0.7, 0.45]}>
        <sphereGeometry args={[0.018, 12, 8]} />
        <meshStandardMaterial color={ayaLook.skin} roughness={0.65} />
      </mesh>
      <mesh ref={smile} position={[0, -0.047, 0.11]} rotation={[0, 0, Math.PI]} scale={[1, 0.8, 1]}>
        <torusGeometry args={[0.022, 0.0055, 8, 20, Math.PI]} />
        <meshStandardMaterial color={ayaLook.lips} roughness={0.4} />
      </mesh>
      <mesh ref={mouth} position={[0, -0.05, 0.106]} scale={[1, 0.6, 0.4]} visible={false}>
        <sphereGeometry args={[0.02, 12, 8]} />
        <meshStandardMaterial color="#8a2f3f" />
      </mesh>
    </>
  );
}

// The face opening in the hijab: an arc of this many radians, centred on the front (+z).
const FACE = 1.9;
// Where the cap ends and the opening begins, measured down from the crown (radians).
const BROW = 0.62;

/**
 * The hijab: a cap and a band around the head that leave the face open, the white underscarf
 * showing at the forehead, and a wrap over the neck and under the chin.
 */
function Hijab({ material }: { material: ReactNode }) {
  // In three's sphere, +z is at phi = π/2.
  const front = Math.PI / 2;
  return (
    <group position={[0, 0.008, -0.008]}>
      <mesh castShadow>
        <sphereGeometry args={[0.138, 32, 10, 0, Math.PI * 2, 0, BROW]} />
        {material}
      </mesh>
      <mesh castShadow>
        <sphereGeometry args={[0.138, 32, 20, front + FACE / 2, Math.PI * 2 - FACE, BROW, Math.PI - BROW]} />
        {material}
      </mesh>
      <mesh>
        <sphereGeometry args={[0.132, 24, 4, front - FACE / 2, FACE, BROW - 0.08, 0.26]} />
        <meshStandardMaterial color={ayaLook.underscarf} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.14, 0.004]} castShadow>
        <cylinderGeometry args={[0.098, 0.145, 0.12, 32, 1, true]} />
        {material}
      </mesh>
    </group>
  );
}
