import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from './r3f';

const COLOR_RESTED = '#2ecc71';
const COLOR_RECOVERING = '#e74c3c';
const COLOR_UNKNOWN = '#7a8590';
const COLOR_SKIN = '#d4b8a0';

const PULSE_SPEED = 2.2;
const HALO_SCALE = 1.18;

function makeGeometry(geom) {
  const [type, a, b] = geom;
  if (type === 'capsule') return <capsuleGeometry args={[a, b, 12, 24]} />;
  if (type === 'sphere') return <sphereGeometry args={[a, 32, 32]} />;
  return null;
}

function Halo({ position, rotation, scale, geom, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = (Math.sin(state.clock.elapsedTime * PULSE_SPEED) + 1) * 0.5;
    meshRef.current.material.opacity = 0.2 + pulse * 0.5;
  });
  const haloScale = scale.map((s) => s * HALO_SCALE);
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
          emissive={isTarget ? baseColor : '#000000'}
          emissiveIntensity={0}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>
      {isTarget ? (
        <Halo position={position} rotation={rotation} scale={scale} geom={geom} color={baseColor} />
      ) : null}
    </>
  );
}

const MUSCLES = [
  // Decorative head + neck
  { muscleId: '__head', position: [0, 2.55, 0], scale: [1, 1.1, 1], geom: ['sphere', 0.34] },
  { muscleId: '__neck', position: [0, 2.12, 0], geom: ['capsule', 0.12, 0.06] },

  // Traps — flattened above shoulders, slightly back
  { muscleId: 'traps', position: [0, 1.97, -0.05], scale: [1.0, 0.42, 0.5], geom: ['sphere', 0.4] },

  // Shoulders (deltoids) L/R
  { muscleId: 'shoulders', position: [-0.65, 1.83, 0], geom: ['sphere', 0.27] },
  { muscleId: 'shoulders', position: [0.65, 1.83, 0], geom: ['sphere', 0.27] },

  // Chest — flattened sphere on front upper torso
  { muscleId: 'chest', position: [0, 1.5, 0.16], scale: [1.1, 0.65, 0.4], geom: ['sphere', 0.5] },

  // Upper back — flattened sphere on rear upper torso
  { muscleId: 'upper_back', position: [0, 1.5, -0.18], scale: [1.1, 0.75, 0.42], geom: ['sphere', 0.5] },

  // Abs — flattened on front lower torso
  { muscleId: 'abs', position: [0, 0.95, 0.18], scale: [0.85, 0.78, 0.4], geom: ['sphere', 0.45] },

  // Lower back
  { muscleId: 'lower_back', position: [0, 0.95, -0.2], scale: [0.95, 0.65, 0.4], geom: ['sphere', 0.45] },

  // Biceps — front of upper arms
  { muscleId: 'biceps', position: [-0.7, 1.4, 0.08], geom: ['capsule', 0.15, 0.3] },
  { muscleId: 'biceps', position: [0.7, 1.4, 0.08], geom: ['capsule', 0.15, 0.3] },

  // Triceps — back of upper arms
  { muscleId: 'triceps', position: [-0.7, 1.4, -0.08], geom: ['capsule', 0.15, 0.3] },
  { muscleId: 'triceps', position: [0.7, 1.4, -0.08], geom: ['capsule', 0.15, 0.3] },

  // Forearms
  { muscleId: 'forearms', position: [-0.72, 0.82, 0], geom: ['capsule', 0.13, 0.32] },
  { muscleId: 'forearms', position: [0.72, 0.82, 0], geom: ['capsule', 0.13, 0.32] },

  // Glutes
  { muscleId: 'glutes', position: [-0.2, 0.5, -0.15], geom: ['sphere', 0.27] },
  { muscleId: 'glutes', position: [0.2, 0.5, -0.15], geom: ['sphere', 0.27] },

  // Quads — front of thighs
  { muscleId: 'quads', position: [-0.22, 0.05, 0.06], geom: ['capsule', 0.19, 0.5] },
  { muscleId: 'quads', position: [0.22, 0.05, 0.06], geom: ['capsule', 0.19, 0.5] },

  // Hamstrings — back of thighs
  { muscleId: 'hamstrings', position: [-0.22, 0.05, -0.1], geom: ['capsule', 0.19, 0.5] },
  { muscleId: 'hamstrings', position: [0.22, 0.05, -0.1], geom: ['capsule', 0.19, 0.5] },

  // Calves — back of lower legs
  { muscleId: 'calves', position: [-0.22, -0.7, -0.04], geom: ['capsule', 0.16, 0.45] },
  { muscleId: 'calves', position: [0.22, -0.7, -0.04], geom: ['capsule', 0.16, 0.45] },
];

export default function BodyModel({ targetMuscleId, muscleStatus, autoRotate = true }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
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
