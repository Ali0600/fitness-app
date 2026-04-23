import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import StorageService from '../services/storageService';
import {
  DEFAULT_STATE,
  DEFAULT_SETTINGS,
  DEFAULT_MUSCLE_GROUPS,
  DEFAULT_WORKOUTS,
} from '../data/muscleGroups';

export const AppStateContext = createContext();

function mergeWithDefaults(loaded) {
  if (!loaded || typeof loaded !== 'object') return DEFAULT_STATE;
  const mgById = new Map(DEFAULT_MUSCLE_GROUPS.map((m) => [m.id, m]));
  const loadedMgById = new Map((loaded.muscleGroups || []).map((m) => [m.id, m]));
  const muscleGroups = DEFAULT_MUSCLE_GROUPS.map((dm) => ({
    ...dm,
    ...(loadedMgById.get(dm.id) || {}),
  }));
  // Preserve any custom muscles the user added beyond defaults
  for (const [id, m] of loadedMgById) {
    if (!mgById.has(id)) muscleGroups.push(m);
  }
  return {
    version: loaded.version ?? 1,
    muscleGroups,
    workoutLog: Array.isArray(loaded.workoutLog) ? loaded.workoutLog : [],
    workouts: Array.isArray(loaded.workouts) ? loaded.workouts : DEFAULT_WORKOUTS,
    settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) },
  };
}

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loaded = await StorageService.getState();
        if (loaded) {
          setState(mergeWithDefaults(loaded));
        } else {
          setState(DEFAULT_STATE);
          await StorageService.saveState(DEFAULT_STATE);
        }
      } catch (err) {
        console.error('Error loading app state:', err);
        setError('Failed to load app data. Please restart the app.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      StorageService.saveState(state).catch((err) => {
        console.error('Error saving state:', err);
        setError('Failed to save changes. Please try again.');
      });
    }, 100);
    return () => clearTimeout(t);
  }, [state, isLoading]);

  const logWorkout = useCallback(
    (muscleGroupIds, { notes = '', exercises = [], timestamp, workoutId } = {}) => {
      if (!muscleGroupIds?.length) return;
      setState((prev) => ({
        ...prev,
        workoutLog: [
          ...prev.workoutLog,
          {
            id: `w-${Date.now()}`,
            muscleGroupIds: [...muscleGroupIds],
            timestamp: timestamp || new Date().toISOString(),
            notes,
            exercises,
            ...(workoutId ? { workoutId } : {}),
          },
        ],
      }));
    },
    []
  );

  const deleteLogEntry = useCallback((entryId) => {
    setState((prev) => ({
      ...prev,
      workoutLog: prev.workoutLog.filter((e) => e.id !== entryId),
    }));
  }, []);

  const updateLogEntry = useCallback((entryId, updates) => {
    setState((prev) => ({
      ...prev,
      workoutLog: prev.workoutLog.map((e) => (e.id === entryId ? { ...e, ...updates } : e)),
    }));
  }, []);

  const addWorkout = useCallback((workout) => {
    setState((prev) => ({
      ...prev,
      workouts: [
        {
          id: workout.id || `custom-${Date.now()}`,
          name: workout.name,
          muscleGroupIds: [...(workout.muscleGroupIds || [])],
          defaultSets: (workout.defaultSets || []).map((s) => ({ ...s })),
          isSeed: false,
        },
        ...prev.workouts,
      ],
    }));
  }, []);

  const updateWorkout = useCallback((workoutId, patch) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.map((w) => (w.id === workoutId ? { ...w, ...patch } : w)),
    }));
  }, []);

  const deleteWorkout = useCallback((workoutId) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== workoutId),
    }));
  }, []);

  const setRecommendedRestHours = useCallback((muscleId, hours) => {
    setState((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.map((m) =>
        m.id === muscleId ? { ...m, recommendedRestHours: hours } : m
      ),
    }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const setScheduledNotification = useCallback((muscleId, notifId) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        scheduledNotificationIds: {
          ...(prev.settings.scheduledNotificationIds || {}),
          [muscleId]: notifId,
        },
      },
    }));
  }, []);

  const resetAll = useCallback(async () => {
    setState(DEFAULT_STATE);
    await StorageService.saveState(DEFAULT_STATE);
  }, []);

  const replaceState = useCallback(async (nextState) => {
    const merged = mergeWithDefaults(nextState);
    setState(merged);
    await StorageService.saveState(merged);
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      muscleGroups: state.muscleGroups,
      workoutLog: state.workoutLog,
      workouts: state.workouts || [],
      settings: state.settings,
      isLoading,
      error,
      logWorkout,
      deleteLogEntry,
      updateLogEntry,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      setRecommendedRestHours,
      updateSettings,
      setScheduledNotification,
      resetAll,
      replaceState,
    }),
    [
      state,
      isLoading,
      error,
      logWorkout,
      deleteLogEntry,
      updateLogEntry,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      setRecommendedRestHours,
      updateSettings,
      setScheduledNotification,
      resetAll,
      replaceState,
    ]
  );

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};
