import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from './r3f';

const COLOR_RESTED = '#2ecc71';
const COLOR_RECOVERING = '#e74c3c';
// "Unknown" (never logged): slightly shaded skin tone so muscles read as
// sculpted bulges on the body instead of as gray blotches.
const COLOR_UNKNOWN = '#d2a078';
const COLOR_SKIN = '#f2c89a';

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

function Torso() {
  const geometry = useMemo(() => {
    // V-taper profile (radius, y) — top (shoulder yoke) → waist (narrow) → hip flare
    const pts = [
      new THREE.Vector2(0.12, 2.02),   // top of shoulder yoke (near neck base)
      new THREE.Vector2(0.55, 1.94),   // shoulder girdle
      new THREE.Vector2(0.62, 1.74),   // top of lats
      new THREE.Vector2(0.64, 1.50),   // widest point (mid-lats)
      new THREE.Vector2(0.57, 1.28),   // below lats
      new THREE.Vector2(0.47, 1.04),   // ribcage
      new THREE.Vector2(0.36, 0.80),   // waist (narrowest)
      new THREE.Vector2(0.42, 0.55),   // hip flare start
      new THREE.Vector2(0.50, 0.32),   // hip crown
      new THREE.Vector2(0.40, 0.12),   // under pelvis
    ];
    return new THREE.LatheGeometry(pts, 48);
  }, []);

  // Flatten Z to get realistic front-back depth (torso is wider than it is deep)
  return (
    <mesh geometry={geometry} scale={[1, 1, 0.62]}>
      <meshStandardMaterial
        color={COLOR_SKIN}
        emissive={COLOR_SKIN}
        emissiveIntensity={0.18}
        roughness={0.6}
        metalness={0.04}
      />
    </mesh>
  );
}

function SkinBase({ position, rotation, scale, geom }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {makeGeometry(geom)}
      <meshStandardMaterial
        color={COLOR_SKIN}
        emissive={COLOR_SKIN}
        emissiveIntensity={0.18}
        roughness={0.6}
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
          emissiveIntensity={isTarget ? 0 : 0.15}
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>
      {isTarget ? (
        <Halo position={position} rotation={rotation} scale={scale} geom={geom} color={baseColor} />
      ) : null}
    </>
  );
}

// =============== STATIC SKIN SILHOUETTE ===============
// Non-interactive skin-colored pieces that establish the human outline.
// Torso is the lathe above; these cover head, neck, limbs, extremities.
const BASE_PARTS = [
  // Head (slightly tall oval)
  { position: [0, 2.52, 0], scale: [0.85, 1.0, 0.9], geom: ['sphere', 0.32] },
  // Jaw bulge (under cheekbones)
  { position: [0, 2.32, 0.08], scale: [0.78, 0.45, 0.72], geom: ['sphere', 0.23] },
  // Neck — tapered cylinder wider at bottom
  { position: [0, 2.08, 0], geom: ['cylinder', 0.14, 0.18, 0.24] },

  // Pelvis base — seats under hip flare
  { position: [0, 0.10, 0], scale: [1.0, 0.72, 0.88], geom: ['sphere', 0.38] },

  // Upper arms (shoulder → elbow), slight outward angle
  { position: [-0.70, 1.48, 0], rotation: [0, 0, 0.07], geom: ['cylinder', 0.17, 0.13, 0.74] },
  { position: [0.70, 1.48, 0], rotation: [0, 0, -0.07], geom: ['cylinder', 0.17, 0.13, 0.74] },
  // Elbows
  { position: [-0.76, 1.08, 0], geom: ['sphere', 0.13] },
  { position: [0.76, 1.08, 0], geom: ['sphere', 0.13] },
  // Forearms (elbow → wrist)
  { position: [-0.80, 0.68, 0], rotation: [0, 0, 0.05], geom: ['cylinder', 0.13, 0.09, 0.72] },
  { position: [0.80, 0.68, 0], rotation: [0, 0, -0.05], geom: ['cylinder', 0.13, 0.09, 0.72] },
  // Wrists
  { position: [-0.83, 0.32, 0], geom: ['sphere', 0.09] },
  { position: [0.83, 0.32, 0], geom: ['sphere', 0.09] },
  // Hands (flat fists)
  { position: [-0.84, 0.16, 0], scale: [1, 1.4, 0.55], geom: ['sphere', 0.12] },
  { position: [0.84, 0.16, 0], scale: [1, 1.4, 0.55], geom: ['sphere', 0.12] },

  // Thighs (hip → knee), slight inward angle (femur)
  { position: [-0.21, -0.30, 0], rotation: [0, 0, -0.02], geom: ['cylinder', 0.23, 0.16, 0.85] },
  { position: [0.21, -0.30, 0], rotation: [0, 0, 0.02], geom: ['cylinder', 0.23, 0.16, 0.85] },
  // Knees
  { position: [-0.21, -0.76, 0.02], geom: ['sphere', 0.15] },
  { position: [0.21, -0.76, 0.02], geom: ['sphere', 0.15] },
  // Shins (knee → ankle)
  { position: [-0.22, -1.18, 0], geom: ['cylinder', 0.14, 0.08, 0.80] },
  { position: [0.22, -1.18, 0], geom: ['cylinder', 0.14, 0.08, 0.80] },
  // Ankles
  { position: [-0.22, -1.60, 0], geom: ['sphere', 0.09] },
  { position: [0.22, -1.60, 0], geom: ['sphere', 0.09] },
  // Feet (flat, extended forward)
  { position: [-0.22, -1.64, 0.18], scale: [1, 0.42, 2.3], geom: ['sphere', 0.13] },
  { position: [0.22, -1.64, 0.18], scale: [1, 0.42, 2.3], geom: ['sphere', 0.13] },
];

// =============== MUSCLE OVERLAYS ===============
// Sit ON TOP of the base skin; color-coded by status, pulse when targeted.

// 6-pack grid — two columns, three rows on front of abdomen.
// z values sit on the torso surface so the back half is hidden inside
// the body and only the rounded bulge pokes out.
const ABS_GRID = [
  [-0.09, 1.23, 0.34], [0.09, 1.23, 0.34],   // upper
  [-0.09, 1.06, 0.30], [0.09, 1.06, 0.30],   // middle
  [-0.09, 0.89, 0.25], [0.09, 0.89, 0.25],   // lower (torso narrows)
];

const MUSCLES = [
  // Traps — yoke across top of shoulders and back of neck
  { muscleId: 'traps', position: [0, 2.00, -0.04], scale: [1.6, 0.40, 0.75], geom: ['sphere', 0.28] },

  // Deltoids — 3 lobes per shoulder (front + side + rear) for a capped look
  { muscleId: 'shoulders', position: [-0.64, 1.88, 0.08], scale: [1, 1, 0.95], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [-0.70, 1.86, 0], scale: [1, 1, 1], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [-0.64, 1.85, -0.08], scale: [1, 1, 0.95], geom: ['sphere', 0.21] },
  { muscleId: 'shoulders', position: [0.64, 1.88, 0.08], scale: [1, 1, 0.95], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [0.70, 1.86, 0], scale: [1, 1, 1], geom: ['sphere', 0.22] },
  { muscleId: 'shoulders', position: [0.64, 1.85, -0.08], scale: [1, 1, 0.95], geom: ['sphere', 0.21] },

  // Pecs — two rounded slabs separated by a visible sternum gap
  { muscleId: 'chest', position: [-0.23, 1.60, 0.40], rotation: [0.12, 0, -0.28], scale: [1.15, 0.9, 0.65], geom: ['sphere', 0.26] },
  { muscleId: 'chest', position: [0.23, 1.60, 0.40], rotation: [0.12, 0, 0.28], scale: [1.15, 0.9, 0.65], geom: ['sphere', 0.26] },

  // Upper back — rhomboid/mid-trap center mass + lat wings flaring out on the sides
  { muscleId: 'upper_back', position: [0, 1.58, -0.39], scale: [1.4, 1.0, 0.5], geom: ['sphere', 0.26] },
  { muscleId: 'upper_back', position: [-0.56, 1.40, -0.04], scale: [0.45, 1.35, 0.6], geom: ['sphere', 0.28] },
  { muscleId: 'upper_back', position: [0.56, 1.40, -0.04], scale: [0.45, 1.35, 0.6], geom: ['sphere', 0.28] },

  // Abs — 6-pack
  ...ABS_GRID.map((p) => ({ muscleId: 'abs', position: p, scale: [0.85, 0.7, 0.55], geom: ['sphere', 0.11] })),

  // Lower back — lumbar/erector mass
  { muscleId: 'lower_back', position: [0, 0.82, -0.32], scale: [1.3, 0.95, 0.45], geom: ['sphere', 0.22] },

  // Biceps — prominent bulge on front of upper arm
  { muscleId: 'biceps', position: [-0.64, 1.52, 0.18], rotation: [0, 0, 0.07], scale: [0.9, 1.0, 0.95], geom: ['capsule', 0.10, 0.24] },
  { muscleId: 'biceps', position: [0.64, 1.52, 0.18], rotation: [0, 0, -0.07], scale: [0.9, 1.0, 0.95], geom: ['capsule', 0.10, 0.24] },

  // Triceps — long head on back of upper arm
  { muscleId: 'triceps', position: [-0.75, 1.43, -0.17], rotation: [0, 0, 0.07], scale: [0.85, 1.2, 0.9], geom: ['capsule', 0.10, 0.28] },
  { muscleId: 'triceps', position: [0.75, 1.43, -0.17], rotation: [0, 0, -0.07], scale: [0.85, 1.2, 0.9], geom: ['capsule', 0.10, 0.28] },

  // Forearms — brachioradialis/flexor bulge near the elbow
  { muscleId: 'forearms', position: [-0.76, 0.85, 0.07], rotation: [0, 0, 0.05], scale: [0.9, 1.05, 0.9], geom: ['capsule', 0.11, 0.22] },
  { muscleId: 'forearms', position: [0.76, 0.85, 0.07], rotation: [0, 0, -0.05], scale: [0.9, 1.05, 0.9], geom: ['capsule', 0.11, 0.22] },

  // Glutes — two rounded mounds at the rear of the pelvis
  { muscleId: 'glutes', position: [-0.17, 0.08, -0.25], scale: [1, 1, 0.85], geom: ['sphere', 0.22] },
  { muscleId: 'glutes', position: [0.17, 0.08, -0.25], scale: [1, 1, 0.85], geom: ['sphere', 0.22] },

  // Quads — big bulge on front of thigh (rectus femoris + vastus heads)
  { muscleId: 'quads', position: [-0.21, -0.28, 0.15], scale: [1.1, 1.3, 0.9], geom: ['capsule', 0.11, 0.32] },
  { muscleId: 'quads', position: [0.21, -0.28, 0.15], scale: [1.1, 1.3, 0.9], geom: ['capsule', 0.11, 0.32] },
  // Inner quad teardrop (vastus medialis) — subtle extra bulge low-inside
  { muscleId: 'quads', position: [-0.13, -0.55, 0.14], scale: [0.7, 0.85, 0.6], geom: ['sphere', 0.12] },
  { muscleId: 'quads', position: [0.13, -0.55, 0.14], scale: [0.7, 0.85, 0.6], geom: ['sphere', 0.12] },

  // Hamstrings — back of thigh
  { muscleId: 'hamstrings', position: [-0.21, -0.32, -0.15], scale: [1.0, 1.3, 0.75], geom: ['capsule', 0.10, 0.30] },
  { muscleId: 'hamstrings', position: [0.21, -0.32, -0.15], scale: [1.0, 1.3, 0.75], geom: ['capsule', 0.10, 0.30] },

  // Calves — diamond bulge on back of shin (gastrocnemius)
  { muscleId: 'calves', position: [-0.22, -1.08, -0.12], scale: [1.05, 1.3, 0.85], geom: ['capsule', 0.10, 0.24] },
  { muscleId: 'calves', position: [0.22, -1.08, -0.12], scale: [1.05, 1.3, 0.85], geom: ['capsule', 0.10, 0.24] },
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
      {BASE_PARTS.map((p, i) => (
        <SkinBase
          key={`base-${i}`}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
          geom={p.geom}
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
