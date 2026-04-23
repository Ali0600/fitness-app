import { useMemo } from 'react';
import { useAppState } from './useAppState';
import {
  hoursSinceLastWorked,
  lastWorkedAt,
  sortedMuscleGroups,
  longestRestedMuscleId,
  mostTrainedMuscle,
  mostNeglectedMuscle,
  longestDailyStreak,
  workoutsPerWeek,
  avgRestIntervalHours,
  longestRestHours,
  totalWorkouts,
  adherence,
  timestampsFor,
} from '../utils/statsUtils';

export function useMuscleStats(refreshTick = 0) {
  const { workoutLog, muscleGroups } = useAppState();

  return useMemo(() => {
    const sorted = sortedMuscleGroups(workoutLog, muscleGroups);
    const longestRestedId = longestRestedMuscleId(workoutLog, muscleGroups);

    const perMuscle = new Map();
    for (const mg of muscleGroups) {
      perMuscle.set(mg.id, {
        lastWorkedAt: lastWorkedAt(workoutLog, mg.id),
        hoursSince: hoursSinceLastWorked(workoutLog, mg.id),
        totalWorkouts: totalWorkouts(workoutLog, mg.id),
        avgRestHours: avgRestIntervalHours(workoutLog, mg.id),
        longestRestHours: longestRestHours(workoutLog, mg.id),
        adherence: adherence(workoutLog, mg.id, mg.recommendedRestHours),
      });
    }

    return {
      sortedMuscles: sorted,
      longestRestedId,
      perMuscle,
      mostTrained: mostTrainedMuscle(workoutLog, muscleGroups, 30),
      mostNeglected: mostNeglectedMuscle(workoutLog, muscleGroups),
      longestStreak: longestDailyStreak(workoutLog),
      workoutsPerWeek: workoutsPerWeek(workoutLog, 4),
      totalWorkouts: workoutLog.length,
    };
  }, [workoutLog, muscleGroups, refreshTick]);
}

export function useMuscleHistory(muscleId) {
  const { workoutLog } = useAppState();
  return useMemo(() => {
    return workoutLog
      .filter((e) => e.muscleGroupIds?.includes(muscleId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [workoutLog, muscleId]);
}

export function useMuscleTimestamps(muscleId) {
  const { workoutLog } = useAppState();
  return useMemo(() => timestampsFor(workoutLog, muscleId), [workoutLog, muscleId]);
}
