export const DEFAULT_MUSCLE_GROUPS = [
  {
    id: 'chest',
    name: 'Chest',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'chest_upper',  name: 'Upper Chest (clavicular)' },
      { id: 'chest_middle', name: 'Mid Chest (sternal)' },
      { id: 'chest_lower',  name: 'Lower Chest (costal)' },
    ],
  },
  {
    id: 'upper_back',
    name: 'Upper Back',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'lats',       name: 'Lats' },
      { id: 'rhomboids',  name: 'Rhomboids' },
      { id: 'mid_traps',  name: 'Mid Traps' },
      { id: 'teres',      name: 'Teres Major / Minor' },
    ],
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'erector_spinae', name: 'Erector Spinae' },
      { id: 'multifidus',     name: 'Multifidus' },
      { id: 'qlumborum',      name: 'Quadratus Lumborum' },
    ],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'delt_anterior',  name: 'Anterior Deltoid' },
      { id: 'delt_lateral',   name: 'Lateral Deltoid' },
      { id: 'delt_posterior', name: 'Posterior Deltoid' },
    ],
  },
  {
    id: 'traps',
    name: 'Traps',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'traps_upper',  name: 'Upper Traps' },
      { id: 'traps_middle', name: 'Middle Traps' },
      { id: 'traps_lower',  name: 'Lower Traps' },
    ],
  },
  {
    id: 'biceps',
    name: 'Biceps',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'biceps_long',   name: 'Long Head' },
      { id: 'biceps_short',  name: 'Short Head' },
      { id: 'brachialis',    name: 'Brachialis' },
    ],
  },
  {
    id: 'triceps',
    name: 'Triceps',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'triceps_long',    name: 'Long Head' },
      { id: 'triceps_lateral', name: 'Lateral Head' },
      { id: 'triceps_medial',  name: 'Medial Head' },
    ],
  },
  {
    id: 'forearms',
    name: 'Forearms',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'forearm_flexors',   name: 'Flexors' },
      { id: 'forearm_extensors', name: 'Extensors' },
      { id: 'brachioradialis',   name: 'Brachioradialis' },
    ],
  },
  {
    id: 'quads',
    name: 'Quads',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'rectus_femoris',     name: 'Rectus Femoris' },
      { id: 'vastus_lateralis',   name: 'Vastus Lateralis' },
      { id: 'vastus_medialis',    name: 'Vastus Medialis' },
      { id: 'vastus_intermedius', name: 'Vastus Intermedius' },
    ],
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'biceps_femoris',   name: 'Biceps Femoris' },
      { id: 'semitendinosus',   name: 'Semitendinosus' },
      { id: 'semimembranosus',  name: 'Semimembranosus' },
    ],
  },
  {
    id: 'glutes',
    name: 'Glutes',
    recommendedRestHours: 72,
    subGroups: [
      { id: 'glute_max',    name: 'Gluteus Maximus' },
      { id: 'glute_med',    name: 'Gluteus Medius' },
      { id: 'glute_min',    name: 'Gluteus Minimus' },
    ],
  },
  {
    id: 'calves',
    name: 'Calves',
    recommendedRestHours: 48,
    subGroups: [
      { id: 'gastrocnemius', name: 'Gastrocnemius' },
      { id: 'soleus',        name: 'Soleus' },
      { id: 'tibialis_ant',  name: 'Tibialis Anterior' },
    ],
  },
  {
    id: 'abs',
    name: 'Abs / Core',
    recommendedRestHours: 24,
    subGroups: [
      { id: 'rectus_abdominis',    name: 'Rectus Abdominis' },
      { id: 'obliques',            name: 'Obliques' },
      { id: 'transverse_abdominis', name: 'Transverse Abdominis' },
    ],
  },
];

const setsOf = (count, reps) =>
  Array.from({ length: count }, () => ({ reps, weight: 0 }));

// Equipment: barbell + dumbbells only. No bench required.
// User-curated catalog: workouts are added 1-by-1 as the user actually performs them.
export const DEFAULT_WORKOUTS = [
  // Triceps
  {
    id: 'db_triceps_kickback',
    name: 'Dumbbell Triceps Kickback',
    muscleGroupIds: [
      'triceps', 'triceps_lateral', 'triceps_medial', 'triceps_long',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'db_overhead_extension',
    name: 'Overhead Dumbbell Extension',
    muscleGroupIds: [
      'triceps', 'triceps_long', 'triceps_medial',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  // Calves
  {
    id: 'db_calf_raise',
    name: 'Dumbbell Calf Raise',
    muscleGroupIds: [
      'calves', 'gastrocnemius', 'soleus',
    ],
    defaultSets: setsOf(3, 15),
    isSeed: true,
  },
  // Biceps
  {
    id: 'db_bicep_curl',
    name: 'Dumbbell Bicep Curl',
    muscleGroupIds: [
      'biceps', 'biceps_long', 'biceps_short',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'db_bicep_hammer',
    name: 'Dumbbell Hammer Curl',
    muscleGroupIds: [
      'biceps', 'brachialis', 'biceps_long',
      'forearms', 'brachioradialis',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  // Legs
  {
    id: 'bb_squat',
    name: 'Barbell Back Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max', 'glute_med',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
];

export const DEFAULT_SETTINGS = {
  bodyView: 'front',
  bodyVisible: true,
  notificationsEnabled: true,
  scheduledNotificationIds: {},
};

export const DEFAULT_STATE = {
  version: 7,
  muscleGroups: DEFAULT_MUSCLE_GROUPS,
  workoutLog: [],
  workouts: DEFAULT_WORKOUTS,
  dismissedSeedIds: [],
  settings: DEFAULT_SETTINGS,
};
