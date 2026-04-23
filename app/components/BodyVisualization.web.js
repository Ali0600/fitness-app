import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as THREE from 'three';
import { Canvas } from './r3f';
import BodyModel from './BodyModel';
import { isRested } from '../utils/timeUtils';
import { lastWorkedAt } from '../utils/statsUtils';
import { useAppState } from '../hooks/useAppState';

export default function BodyVisualization({ targetMuscleId }) {
  const { workoutLog, muscleGroups } = useAppState();

  const muscleStatus = useMemo(() => {
    const m = new Map();
    for (const mg of muscleGroups) {
      const last = lastWorkedAt(workoutLog, mg.id);
      if (!last) {
        m.set(mg.id, 'unknown');
      } else {
        m.set(mg.id, isRested(last, mg.recommendedRestHours) ? 'rested' : 'recovering');
      }
    }
    return m;
  }, [workoutLog, muscleGroups]);

  return (
    <View style={styles.container}>
      <Canvas
        camera={{ position: [0, 0.3, 5.2], fov: 38 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#fff0d8', '#1a2030', 0.65]} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff1d8" />
        <directionalLight position={[-4, 3, 3]} intensity={0.5} color="#a8c8ff" />
        <directionalLight position={[-2, 2, -5]} intensity={0.8} color="#f0e0ff" />
        <BodyModel targetMuscleId={targetMuscleId} muscleStatus={muscleStatus} autoRotate />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
});
