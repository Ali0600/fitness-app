import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from './r3f';

const COLOR_RESTED = '#2ecc71';
const COLOR_RECOVERING = '#e74c3c';
// "Unknown" (never logged): darker skin tone so muscles read as sculpted
// bulges on the body instead of gray blotches. Slightly darker than the
// base skin so segmentation lines are visible between muscles.
const COLOR_UNKNOWN = '#b88560';
const COLOR_SKIN = '#f2c89a';
const COLOR_HAIR = '#2a1a12';
const COLOR_EYE = '#1a1410';
const COLOR_SHORTS = '#1a2a44';

const PULSE_SPEED = 2.2;
const HALO_SCALE = 1.14;

function makeGeometry(geom) {
  const type = geom[0];
  if (type === 'capsule') return <capsuleGeometry args={[geom[1], geom[2], 12, 24]} />;
  if (type === 'sphere') return <sphereGeometry args={[geom[1], 28, 20]} />;
  if (type === 'cylinder') return <cylinderGeometry args={[geom[1], geom[2], geom[3], 24, 1]} />;
  if (type === 'box') return <boxGeometry args={[geom[1], geom[2], geom[3]]} />;
  return null;
}

// Primary torso shape — a V-taper lathe profile sculpted as (radius, y) pairs.
// Shoulders are broad, ribcage descends to a narrow waist, then hip flare.
function Torso() {
  const geometry = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.18, 2.04),   // base of neck / top of shoulder yoke
      new THREE.Vector2(0.54, 1.98),   // shoulder shelf
      new THREE.Vector2(0.66, 1.80),   // top of lats (widest)
      new THREE.Vector2(0.68, 1.58),   // mid-lats
      new THREE.Vector2(0.60, 1.34),   // below lats
      new THREE.Vector2(0.48, 1.08),   // ribcage base
      new THREE.Vector2(0.36, 0.82),   // waist (narrowest)
      new THREE.Vector2(0.42, 0.55),   // hip flare start
      new THREE.Vector2(0.52, 0.30),   // hip crown
      new THREE.Vector2(0.46, 0.08),   // pelvis underside
    ];
    return new THREE.LatheGeometry(pts, 56);
  }, []);

  // Z-scale: torso is wider than deep (~1.8:1). This flattens the lathe so
  // viewed from the front the figure looks human, not cylindrical.
  return (
    <mesh geometry={geometry} scale={[1, 1, 0.6]}>
      <meshStandardMaterial
        color={COLOR_SKIN}
        emissive={COLOR_SKIN}
        emissiveIntensity={0.18}
        roughness={0.62}
        metalness={0.04}
      />
    </mesh>
  );
}

function SkinBase({ position, rotation, scale, geom, color = COLOR_SKIN, emissiveIntensity = 0.18 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {makeGeometry(geom)}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.62}
        metalness={0.04}
      />
    </mesh>
  );
}

function Halo({ position, rotation, scale, geom, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = (Math.sin(state.clock.elapsedTime * PULSE_SPEED) + 1) * 0.5;
    meshRef.current.material.opacity = 0.2 + pulse * 0.5;
  });
  const haloScale = (scale || [1, 1, 1]).map((s) => s * HALO_SCALE);
  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={haloScale}>
      {makeGeometry(geom)}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Muscle({ muscleId, position, rotation = [0, 0, 0], scale = [1, 1, 1], geom, targetMuscleId, muscleStatus }) {
  const meshRef = useRef();
  const isTarget = targetMuscleId === muscleId;

  const status = muscleStatus?.get(muscleId);
  let baseColor = COLOR_SKIN;
  if (status === 'rested') baseColor = COLOR_RESTED;
  else if (status === 'recovering') baseColor = COLOR_RECOVERING;
  else if (status === 'unknown') baseColor = COLOR_UNKNOWN;

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isTarget) {
      const pulse = (Math.sin(state.clock.elapsedTime * PULSE_SPEED) + 1) * 0.5;
      meshRef.current.material.emissiveIntensity = 0.35 + pulse * 0.65;
    } else {
      meshRef.current.material.emissiveIntensity = 0;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} userData={{ muscleId }}>
        {makeGeometry(geom)}
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={isTarget ? 0 : 0.12}
          roughness={0.5}
          metalness={0.06}
        />
      </mesh>
      {isTarget ? (
        <Halo position={position} rotation={rotation} scale={scale} geom={geom} color={baseColor} />
      ) : null}
    </>
  );
}

// =============== HEAD + FACE ===============
// Head is a slightly-elongated sphere. On top of it sits a dark "hair" cap.
// Two tiny dark orbs suggest eyes — enough to make the silhouette read as a
// face rather than a sphere.
const HEAD_PARTS = [
  // Skull
  { position: [0, 2.56, 0], scale: [0.88, 1.0, 0.92], geom: ['sphere', 0.34], color: COLOR_SKIN },
  // Hair (top-back cap)
  { position: [0, 2.70, -0.04], scale: [0.90, 0.56, 0.95], geom: ['sphere', 0.34], color: COLOR_HAIR, emissiveIntensity: 0.04 },
  // Jaw mass (chin volume)
  { position: [0, 2.34, 0.08], scale: [0.78, 0.48, 0.78], geom: ['sphere', 0.24], color: COLOR_SKIN },
  // Ears
  { position: [-0.29, 2.54, 0], scale: [0.45, 1.0, 0.7], geom: ['sphere', 0.07], color: COLOR_SKIN },
  { position: [0.29, 2.54, 0], scale: [0.45, 1.0, 0.7], geom: ['sphere', 0.07], color: COLOR_SKIN },
  // Brow ridge (subtle horizontal bulge above eyes)
  { position: [0, 2.62, 0.28], scale: [1.5, 0.25, 0.5], geom: ['sphere', 0.14], color: COLOR_SKIN },
  // Eyebrows
  { position: [-0.11, 2.60, 0.30], scale: [1.4, 0.3, 0.5], geom: ['sphere', 0.05], color: COLOR_HAIR, emissiveIntensity: 0 },
  { position: [0.11, 2.60, 0.30], scale: [1.4, 0.3, 0.5], geom: ['sphere', 0.05], color: COLOR_HAIR, emissiveIntensity: 0 },
  // Eye whites (small off-white orbs) to make eyes visible from distance
  { position: [-0.11, 2.55, 0.30], scale: [1, 0.75, 0.4], geom: ['sphere', 0.055], color: '#f5f0e6', emissiveIntensity: 0.05 },
  { position: [0.11, 2.55, 0.30], scale: [1, 0.75, 0.4], geom: ['sphere', 0.055], color: '#f5f0e6', emissiveIntensity: 0.05 },
  // Pupils (dark) on top of eye whites
  { position: [-0.11, 2.55, 0.33], geom: ['sphere', 0.025], color: COLOR_EYE, emissiveIntensity: 0 },
  { position: [0.11, 2.55, 0.33], geom: ['sphere', 0.025], color: COLOR_EYE, emissiveIntensity: 0 },
  // Nose bridge
  { position: [0, 2.48, 0.33], scale: [0.35, 1.4, 1.0], geom: ['sphere', 0.05], color: COLOR_SKIN },
  // Mouth hint (small dark horizontal line)
  { position: [0, 2.38, 0.30], scale: [1.8, 0.25, 0.4], geom: ['sphere', 0.04], color: '#7a3a2a', emissiveIntensity: 0 },
];

// =============== BODY SILHOUETTE ===============
// Non-interactive skin-colored pieces that form the continuous human outline.
const BASE_PARTS = [
  // Neck — tapered cylinder, wider at base
  { position: [0, 2.12, 0], geom: ['cylinder', 0.14, 0.18, 0.22] },
  // Sternocleidomastoid hints — two subtle bulges on the sides of the neck
  { position: [-0.10, 2.10, 0.08], scale: [0.4, 1.2, 0.5], geom: ['sphere', 0.1] },
  { position: [0.10, 2.10, 0.08], scale: [0.4, 1.2, 0.5], geom: ['sphere', 0.1] },

  // Shoulder caps — bridge the torso to the upper arm smoothly
  { position: [-0.58, 1.94, 0], scale: [1.0, 0.9, 1.0], geom: ['sphere', 0.22] },
  { position: [0.58, 1.94, 0], scale: [1.0, 0.9, 1.0], geom: ['sphere', 0.22] },

  // Upper arms (shoulder → elbow), slight outward angle like relaxed stance
  { position: [-0.70, 1.48, 0], rotation: [0, 0, 0.08], geom: ['cylinder', 0.18, 0.14, 0.80] },
  { position: [0.70, 1.48, 0], rotation: [0, 0, -0.08], geom: ['cylinder', 0.18, 0.14, 0.80] },
  // Elbows
  { position: [-0.77, 1.05, 0], geom: ['sphere', 0.14] },
  { position: [0.77, 1.05, 0], geom: ['sphere', 0.14] },
  // Forearms (elbow → wrist)
  { position: [-0.81, 0.65, 0], rotation: [0, 0, 0.06], geom: ['cylinder', 0.14, 0.09, 0.76] },
  { position: [0.81, 0.65, 0], rotation: [0, 0, -0.06], geom: ['cylinder', 0.14, 0.09, 0.76] },
  // Wrists
  { position: [-0.84, 0.28, 0], geom: ['sphere', 0.09] },
  { position: [0.84, 0.28, 0], geom: ['sphere', 0.09] },
  // Hands (flat fists)
  { position: [-0.85, 0.12, 0], scale: [1, 1.5, 0.55], geom: ['sphere', 0.12] },
  { position: [0.85, 0.12, 0], scale: [1, 1.5, 0.55], geom: ['sphere', 0.12] },

  // Hip crown — blends pelvis to thighs
  { position: [-0.22, -0.06, 0], scale: [1.0, 0.75, 0.95], geom: ['sphere', 0.28] },
  { position: [0.22, -0.06, 0], scale: [1.0, 0.75, 0.95], geom: ['sphere', 0.28] },

  // Thighs (hip → knee)
  { position: [-0.22, -0.36, 0], rotation: [0, 0, -0.02], geom: ['cylinder', 0.24, 0.16, 0.86] },
  { position: [0.22, -0.36, 0], rotation: [0, 0, 0.02], geom: ['cylinder', 0.24, 0.16, 0.86] },
  // Knees
  { position: [-0.22, -0.82, 0.02], geom: ['sphere', 0.15] },
  { position: [0.22, -0.82, 0.02], geom: ['sphere', 0.15] },
  // Shins (knee → ankle)
  { position: [-0.23, -1.24, 0], geom: ['cylinder', 0.14, 0.08, 0.82] },
  { position: [0.23, -1.24, 0], geom: ['cylinder', 0.14, 0.08, 0.82] },
  // Ankles
  { position: [-0.23, -1.68, 0], geom: ['sphere', 0.09] },
  { position: [0.23, -1.68, 0], geom: ['sphere', 0.09] },
  // Feet (flat, extended forward)
  { position: [-0.23, -1.72, 0.18], scale: [1, 0.42, 2.3], geom: ['sphere', 0.13] },
  { position: [0.23, -1.72, 0.18], scale: [1, 0.42, 2.3], geom: ['sphere', 0.13] },
];

// Shorts / waistband — small dark band around pelvis so the figure doesn't
// look "naked"; mirrors a fitness-model illustration style.
const SHORTS = [
  { position: [0, 0.10, 0], scale: [1.05, 0.45, 1.02], geom: ['sphere', 0.42], color: COLOR_SHORTS, emissiveIntensity: 0.02 },
];

// =============== MUSCLE OVERLAYS ===============
// Sit ON TOP of the base skin; color-coded by status, pulse when targeted.

// 6-pack grid — two columns, three rows on front of abdomen.
const ABS_GRID = [
  [-0.09, 1.28, 0.36], [0.09, 1.28, 0.36],   // upper
  [-0.09, 1.11, 0.32], [0.09, 1.11, 0.32],   // middle
  [-0.09, 0.94, 0.26], [0.09, 0.94, 0.26],   // lower (torso narrows)
];

const MUSCLES = [
  // Traps — yoke across top of shoulders and back of neck
  { muscleId: 'traps', position: [0, 2.04, -0.04], scale: [1.7, 0.42, 0.80], geom: ['sphere', 0.28] },

  // Deltoids — 3 lobes per shoulder (front + side + rear) for a capped look
  { muscleId: 'shoulders', position: [-0.62, 1.92, 0.10], scale: [1, 1, 0.95], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [-0.72, 1.90, 0], scale: [1, 1, 1], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [-0.62, 1.89, -0.10], scale: [1, 1, 0.95], geom: ['sphere', 0.21] },
  { muscleId: 'shoulders', position: [0.62, 1.92, 0.10], scale: [1, 1, 0.95], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [0.72, 1.90, 0], scale: [1, 1, 1], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [0.62, 1.89, -0.10], scale: [1, 1, 0.95], geom: ['sphere', 0.21] },

  // Pecs — two rounded slabs separated by a visible sternum gap
  { muscleId: 'chest', position: [-0.21, 1.64, 0.42], rotation: [0.10, 0, -0.28], scale: [1.25, 0.95, 0.65], geom: ['sphere', 0.27] },
  { muscleId: 'chest', position: [0.21, 1.64, 0.42], rotation: [0.10, 0, 0.28], scale: [1.25, 0.95, 0.65], geom: ['sphere', 0.27] },

  // Upper back — rhomboid/mid-trap center mass + lat wings (tucked behind
  // the torso so they don't protrude through the chest from the front)
  { muscleId: 'upper_back', position: [0, 1.62, -0.40], scale: [1.45, 1.05, 0.5], geom: ['sphere', 0.27] },
  { muscleId: 'upper_back', position: [-0.44, 1.42, -0.22], scale: [0.5, 1.4, 0.55], geom: ['sphere', 0.28] },
  { muscleId: 'upper_back', position: [0.44, 1.42, -0.22], scale: [0.5, 1.4, 0.55], geom: ['sphere', 0.28] },

  // Abs — 6-pack
  ...ABS_GRID.map((p) => ({ muscleId: 'abs', position: p, scale: [0.85, 0.75, 0.55], geom: ['sphere', 0.11] })),

  // Lower back — lumbar/erector mass
  { muscleId: 'lower_back', position: [0, 0.85, -0.32], scale: [1.35, 0.95, 0.45], geom: ['sphere', 0.22] },

  // Biceps — prominent bulge on front of upper arm
  { muscleId: 'biceps', position: [-0.64, 1.52, 0.20], rotation: [0, 0, 0.08], scale: [0.95, 1.05, 0.95], geom: ['capsule', 0.11, 0.26] },
  { muscleId: 'biceps', position: [0.64, 1.52, 0.20], rotation: [0, 0, -0.08], scale: [0.95, 1.05, 0.95], geom: ['capsule', 0.11, 0.26] },

  // Triceps — long head on back of upper arm
  { muscleId: 'triceps', position: [-0.76, 1.42, -0.18], rotation: [0, 0, 0.08], scale: [0.85, 1.2, 0.9], geom: ['capsule', 0.10, 0.28] },
  { muscleId: 'triceps', position: [0.76, 1.42, -0.18], rotation: [0, 0, -0.08], scale: [0.85, 1.2, 0.9], geom: ['capsule', 0.10, 0.28] },

  // Forearms — brachioradialis/flexor bulge near the elbow
  { muscleId: 'forearms', position: [-0.78, 0.82, 0.08], rotation: [0, 0, 0.06], scale: [0.9, 1.1, 0.9], geom: ['capsule', 0.12, 0.22] },
  { muscleId: 'forearms', position: [0.78, 0.82, 0.08], rotation: [0, 0, -0.06], scale: [0.9, 1.1, 0.9], geom: ['capsule', 0.12, 0.22] },

  // Glutes — two rounded mounds at the rear of the pelvis
  { muscleId: 'glutes', position: [-0.18, 0.06, -0.26], scale: [1, 1, 0.85], geom: ['sphere', 0.22] },
  { muscleId: 'glutes', position: [0.18, 0.06, -0.26], scale: [1, 1, 0.85], geom: ['sphere', 0.22] },

  // Quads — big bulge on front of thigh (rectus femoris + vastus heads)
  { muscleId: 'quads', position: [-0.22, -0.34, 0.17], scale: [1.15, 1.35, 0.9], geom: ['capsule', 0.12, 0.34] },
  { muscleId: 'quads', position: [0.22, -0.34, 0.17], scale: [1.15, 1.35, 0.9], geom: ['capsule', 0.12, 0.34] },
  // Inner quad teardrop (vastus medialis) — subtle extra bulge low-inside
  { muscleId: 'quads', position: [-0.14, -0.62, 0.15], scale: [0.7, 0.85, 0.6], geom: ['sphere', 0.12] },
  { muscleId: 'quads', position: [0.14, -0.62, 0.15], scale: [0.7, 0.85, 0.6], geom: ['sphere', 0.12] },

  // Hamstrings — back of thigh
  { muscleId: 'hamstrings', position: [-0.22, -0.38, -0.16], scale: [1.05, 1.3, 0.75], geom: ['capsule', 0.11, 0.32] },
  { muscleId: 'hamstrings', position: [0.22, -0.38, -0.16], scale: [1.05, 1.3, 0.75], geom: ['capsule', 0.11, 0.32] },

  // Calves — diamond bulge on back of shin (gastrocnemius)
  { muscleId: 'calves', position: [-0.23, -1.14, -0.13], scale: [1.1, 1.35, 0.85], geom: ['capsule', 0.11, 0.26] },
  { muscleId: 'calves', position: [0.23, -1.14, -0.13], scale: [1.1, 1.35, 0.85], geom: ['capsule', 0.11, 0.26] },
];

export default function BodyModel({ targetMuscleId, muscleStatus, autoRotate = true }) {
  const groupRef = useRef();

  useEffect(() => {
    if (!autoRotate && groupRef.current) {
      groupRef.current.rotation.y = 0;
    }
  }, [autoRotate]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]} scale={[0.78, 0.78, 0.78]} rotation={[0, 0, 0]}>
      <Torso />
      {HEAD_PARTS.map((p, i) => (
        <SkinBase
          key={`head-${i}`}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          geom={p.geom}
          color={p.color}
          emissiveIntensity={p.emissiveIntensity}
        />
      ))}
      {BASE_PARTS.map((p, i) => (
        <SkinBase
          key={`base-${i}`}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          geom={p.geom}
        />
      ))}
      {SHORTS.map((p, i) => (
        <SkinBase
          key={`shorts-${i}`}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          geom={p.geom}
          color={p.color}
          emissiveIntensity={p.emissiveIntensity}
        />
      ))}
      {MUSCLES.map((m, i) => (
        <Muscle
          key={`${m.muscleId}-${i}`}
          muscleId={m.muscleId}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          geom={m.geom}
          targetMuscleId={targetMuscleId}
          muscleStatus={muscleStatus}
        />
      ))}
    </group>
  );
}
