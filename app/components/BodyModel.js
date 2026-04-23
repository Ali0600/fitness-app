import React, { useRef, useMemo } from 'react';
import { useFrame } from './r3f';

const COLOR_RESTED = '#2ecc71';
const COLOR_RECOVERING = '#e74c3c';
const COLOR_UNKNOWN = '#7f8c8d';
const COLOR_NEUTRAL_SKIN = '#cfd8dc';

function Muscle({ muscleId, position, rotation, scale, geometry, targetMuscleId, muscleStatus }) {
  const meshRef = useRef();
  const emissiveRef = useRef(0);
  const isTarget = muscleId === targetMuscleId;

  const status = muscleStatus?.get(muscleId);
  let baseColor = COLOR_NEUTRAL_SKIN;
  if (status === 'rested') baseColor = COLOR_RESTED;
  else if (status === 'recovering') baseColor = COLOR_RECOVERING;
  else if (status === 'unknown') baseColor = COLOR_UNKNOWN;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (isTarget) {
      emissiveRef.current = (Math.sin(state.clock.elapsedTime * 2) + 1) * 0.4;
      meshRef.current.material.emissiveIntensity = emissiveRef.current;
    } else {
      meshRef.current.material.emissiveIntensity = 0;
    }
  });

  const emissiveColor = isTarget ? baseColor : '#000000';

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} userData={{ muscleId }}>
      {geometry}
      <meshStandardMaterial
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={0}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function BodyModel({ targetMuscleId, muscleStatus, autoRotate = true }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const boxGeometry = useMemo(() => <boxGeometry args={[1, 1, 1]} />, []);
  const sphereGeometry = useMemo(() => <sphereGeometry args={[0.5, 24, 24]} />, []);
  const cylGeometry = useMemo(() => <cylinderGeometry args={[0.5, 0.5, 1, 20]} />, []);

  const muscles = [
    // Head (decorative, not a muscle group)
    {
      muscleId: '__head',
      position: [0, 2.6, 0],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.35, 24, 24]} />,
    },
    // Neck (decorative)
    {
      muscleId: '__neck',
      position: [0, 2.15, 0],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.18, 0.2, 0.25, 16]} />,
    },
    // Traps — above the shoulders
    {
      muscleId: 'traps',
      position: [0, 2.0, -0.05],
      rotation: [0, 0, 0],
      geometry: <boxGeometry args={[0.8, 0.22, 0.3]} />,
    },
    // Chest — front upper torso
    {
      muscleId: 'chest',
      position: [0, 1.55, 0.22],
      rotation: [0, 0, 0],
      geometry: <boxGeometry args={[1.05, 0.55, 0.25]} />,
    },
    // Upper back — back upper torso
    {
      muscleId: 'upper_back',
      position: [0, 1.55, -0.22],
      rotation: [0, 0, 0],
      geometry: <boxGeometry args={[1.05, 0.7, 0.25]} />,
    },
    // Abs — front lower torso
    {
      muscleId: 'abs',
      position: [0, 1.0, 0.22],
      rotation: [0, 0, 0],
      geometry: <boxGeometry args={[0.75, 0.65, 0.22]} />,
    },
    // Lower back — back lower torso
    {
      muscleId: 'lower_back',
      position: [0, 1.0, -0.22],
      rotation: [0, 0, 0],
      geometry: <boxGeometry args={[0.75, 0.55, 0.22]} />,
    },
    // Deltoid / shoulder cap — rounded dome sitting on top of the arm
    {
      muscleId: 'shoulders',
      position: [-0.72, 1.88, 0],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.24, 20, 20]} />,
    },
    {
      muscleId: 'shoulders',
      position: [0.72, 1.88, 0],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.24, 20, 20]} />,
    },
    // Bicep — front half of upper arm (paired with tricep behind to form one arm tube)
    {
      muscleId: 'biceps',
      position: [-0.74, 1.5, 0.08],
      rotation: [0, 0, 0],
      geometry: <capsuleGeometry args={[0.15, 0.25, 8, 16]} />,
    },
    {
      muscleId: 'biceps',
      position: [0.74, 1.5, 0.08],
      rotation: [0, 0, 0],
      geometry: <capsuleGeometry args={[0.15, 0.25, 8, 16]} />,
    },
    // Tricep — back half of upper arm
    {
      muscleId: 'triceps',
      position: [-0.74, 1.5, -0.08],
      rotation: [0, 0, 0],
      geometry: <capsuleGeometry args={[0.15, 0.25, 8, 16]} />,
    },
    {
      muscleId: 'triceps',
      position: [0.74, 1.5, -0.08],
      rotation: [0, 0, 0],
      geometry: <capsuleGeometry args={[0.15, 0.25, 8, 16]} />,
    },
    // Forearm — tapered tube narrowing at the wrist
    {
      muscleId: 'forearms',
      position: [-0.74, 0.95, 0],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.14, 0.10, 0.55, 16]} />,
    },
    {
      muscleId: 'forearms',
      position: [0.74, 0.95, 0],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.14, 0.10, 0.55, 16]} />,
    },
    // Hand — flattened palm/closed-fist shape (decorative)
    {
      muscleId: '__hand_l',
      position: [-0.74, 0.55, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.6, 0.55],
      geometry: <sphereGeometry args={[0.08, 16, 16]} />,
    },
    {
      muscleId: '__hand_r',
      position: [0.74, 0.55, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.6, 0.55],
      geometry: <sphereGeometry args={[0.08, 16, 16]} />,
    },
    // Thumb — small bump on the inner-front edge of each palm
    {
      muscleId: '__thumb_l',
      position: [-0.66, 0.61, 0.04],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.035, 12, 12]} />,
    },
    {
      muscleId: '__thumb_r',
      position: [0.66, 0.61, 0.04],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.035, 12, 12]} />,
    },
    // Glutes — butt area
    {
      muscleId: 'glutes',
      position: [-0.22, 0.52, -0.15],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.28, 20, 20]} />,
    },
    {
      muscleId: 'glutes',
      position: [0.22, 0.52, -0.15],
      rotation: [0, 0, 0],
      geometry: <sphereGeometry args={[0.28, 20, 20]} />,
    },
    // Quads — front of thighs
    {
      muscleId: 'quads',
      position: [-0.24, 0.1, 0.08],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />,
    },
    {
      muscleId: 'quads',
      position: [0.24, 0.1, 0.08],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />,
    },
    // Hamstrings — back of thighs
    {
      muscleId: 'hamstrings',
      position: [-0.24, 0.1, -0.1],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />,
    },
    {
      muscleId: 'hamstrings',
      position: [0.24, 0.1, -0.1],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />,
    },
    // Calves — back of lower legs
    {
      muscleId: 'calves',
      position: [-0.24, -0.7, -0.05],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.17, 0.13, 0.75, 16]} />,
    },
    {
      muscleId: 'calves',
      position: [0.24, -0.7, -0.05],
      rotation: [0, 0, 0],
      geometry: <cylinderGeometry args={[0.17, 0.13, 0.75, 16]} />,
    },
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={[0.82, 0.82, 0.82]}>
      {muscles.map((m, i) => (
        <Muscle
          key={`${m.muscleId}-${i}`}
          muscleId={m.muscleId}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          geometry={m.geometry}
          targetMuscleId={targetMuscleId}
          muscleStatus={muscleStatus}
        />
      ))}
    </group>
  );
}
