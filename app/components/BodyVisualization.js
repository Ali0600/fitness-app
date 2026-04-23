import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
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
        camera={{ position: [0, 0.6, 5], fov: 40 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} />
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
