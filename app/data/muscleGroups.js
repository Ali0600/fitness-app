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
export const DEFAULT_WORKOUTS = [
  // Chest
  {
    id: 'bb_floor_press',
    name: 'Barbell Floor Press',
    muscleGroupIds: [
      'chest', 'chest_middle',
      'shoulders', 'delt_anterior',
      'triceps', 'triceps_lateral', 'triceps_medial',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'db_floor_press',
    name: 'Dumbbell Floor Press',
    muscleGroupIds: [
      'chest', 'chest_middle', 'chest_lower',
      'shoulders', 'delt_anterior',
      'triceps', 'triceps_lateral', 'triceps_medial', 'triceps_long',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Back
  {
    id: 'bb_bent_over_row',
    name: 'Barbell Bent-Over Row',
    muscleGroupIds: [
      'upper_back', 'lats', 'rhomboids', 'mid_traps', 'teres',
      'shoulders', 'delt_posterior',
      'traps', 'traps_middle',
      'biceps', 'biceps_long', 'biceps_short', 'brachialis',
      'forearms', 'forearm_flexors',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'db_bent_over_row',
    name: 'Dumbbell Bent-Over Row',
    muscleGroupIds: [
      'upper_back', 'lats', 'rhomboids', 'mid_traps', 'teres',
      'shoulders', 'delt_posterior',
      'traps', 'traps_middle',
      'biceps', 'biceps_long', 'brachialis',
      'forearms', 'forearm_flexors',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Posterior chain (also covers hamstrings/glutes/lower back/quads/forearms)
  {
    id: 'bb_deadlift',
    name: 'Barbell Deadlift',
    muscleGroupIds: [
      'lower_back', 'erector_spinae', 'multifidus', 'qlumborum',
      'glutes', 'glute_max',
      'hamstrings', 'biceps_femoris', 'semitendinosus', 'semimembranosus',
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'upper_back', 'lats', 'rhomboids',
      'traps', 'traps_upper', 'traps_middle',
      'forearms', 'forearm_flexors',
      'abs', 'rectus_abdominis', 'transverse_abdominis',
    ],
    defaultSets: setsOf(3, 5),
    isSeed: true,
  },

  // Shoulders
  {
    id: 'bb_overhead_press',
    name: 'Barbell Overhead Press',
    muscleGroupIds: [
      'shoulders', 'delt_anterior', 'delt_lateral',
      'triceps', 'triceps_long', 'triceps_lateral',
      'traps', 'traps_upper',
      'chest', 'chest_upper',
    ],
    defaultSets: setsOf(3, 6),
    isSeed: true,
  },
  {
    id: 'db_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroupIds: [
      'shoulders', 'delt_lateral',
      'traps', 'traps_upper',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'db_bent_over_reverse_fly',
    name: 'Bent-Over Dumbbell Reverse Fly',
    muscleGroupIds: [
      'shoulders', 'delt_posterior',
      'upper_back', 'rhomboids', 'mid_traps', 'teres',
      'traps', 'traps_middle', 'traps_lower',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },

  // Traps
  {
    id: 'bb_shrug',
    name: 'Barbell Shrug',
    muscleGroupIds: [
      'traps', 'traps_upper', 'traps_middle',
      'forearms', 'forearm_flexors',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },

  // Biceps
  {
    id: 'bb_curl',
    name: 'Barbell Curl',
    muscleGroupIds: [
      'biceps', 'biceps_long', 'biceps_short', 'brachialis',
      'forearms', 'forearm_flexors', 'brachioradialis',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'db_hammer_curl',
    name: 'Dumbbell Hammer Curl',
    muscleGroupIds: [
      'biceps', 'brachialis', 'biceps_long',
      'forearms', 'brachioradialis', 'forearm_flexors',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Triceps
  {
    id: 'db_lying_triceps_extension',
    name: 'Lying Dumbbell Triceps Extension',
    muscleGroupIds: [
      'triceps', 'triceps_long', 'triceps_medial', 'triceps_lateral',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'db_overhead_extension',
    name: 'Dumbbell Overhead Triceps Extension',
    muscleGroupIds: [
      'triceps', 'triceps_long', 'triceps_medial',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Forearms
  {
    id: 'bb_wrist_curl',
    name: 'Barbell Wrist Curl',
    muscleGroupIds: ['forearms', 'forearm_flexors'],
    defaultSets: setsOf(3, 15),
    isSeed: true,
  },
  {
    id: 'bb_reverse_wrist_curl',
    name: 'Barbell Reverse Wrist Curl',
    muscleGroupIds: ['forearms', 'forearm_extensors', 'brachioradialis'],
    defaultSets: setsOf(3, 15),
    isSeed: true,
  },

  // Quads
  {
    id: 'bb_back_squat',
    name: 'Barbell Back Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max', 'glute_med',
      'hamstrings', 'biceps_femoris',
      'lower_back', 'erector_spinae', 'multifidus',
      'upper_back', 'rhomboids',
      'abs', 'rectus_abdominis', 'transverse_abdominis', 'obliques',
    ],
    defaultSets: setsOf(3, 5),
    isSeed: true,
  },
  {
    id: 'bb_front_squat',
    name: 'Barbell Front Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_medialis', 'vastus_lateralis', 'vastus_intermedius',
      'glutes', 'glute_max',
      'lower_back', 'erector_spinae',
      'upper_back', 'rhomboids', 'mid_traps',
      'traps', 'traps_upper',
      'abs', 'rectus_abdominis', 'transverse_abdominis', 'obliques',
    ],
    defaultSets: setsOf(3, 6),
    isSeed: true,
  },
  {
    id: 'db_goblet_squat',
    name: 'Dumbbell Goblet Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max',
      'abs', 'rectus_abdominis', 'transverse_abdominis', 'obliques',
      'upper_back', 'rhomboids',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'db_lunge',
    name: 'Dumbbell Lunge',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max', 'glute_med',
      'hamstrings', 'biceps_femoris',
      'calves', 'gastrocnemius',
      'abs', 'transverse_abdominis', 'obliques',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Hamstrings
  {
    id: 'bb_romanian_deadlift',
    name: 'Barbell Romanian Deadlift',
    muscleGroupIds: [
      'hamstrings', 'biceps_femoris', 'semitendinosus', 'semimembranosus',
      'glutes', 'glute_max',
      'lower_back', 'erector_spinae', 'multifidus',
      'upper_back', 'lats',
      'traps', 'traps_upper',
      'forearms', 'forearm_flexors',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },

  // Glutes
  {
    id: 'bb_glute_bridge',
    name: 'Barbell Glute Bridge',
    muscleGroupIds: [
      'glutes', 'glute_max', 'glute_med',
      'hamstrings', 'biceps_femoris', 'semitendinosus',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },

  // Calves
  {
    id: 'db_calf_raise',
    name: 'Standing Dumbbell Calf Raise',
    muscleGroupIds: ['calves', 'gastrocnemius', 'soleus'],
    defaultSets: setsOf(3, 15),
    isSeed: true,
  },

  // Abs
  {
    id: 'db_russian_twist',
    name: 'Dumbbell Russian Twist',
    muscleGroupIds: [
      'abs', 'obliques', 'rectus_abdominis', 'transverse_abdominis',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 20),
    isSeed: true,
  },
  {
    id: 'db_sit_up',
    name: 'Weighted Sit-Up',
    muscleGroupIds: [
      'abs', 'rectus_abdominis', 'transverse_abdominis', 'obliques',
      'quads', 'rectus_femoris',
    ],
    defaultSets: setsOf(3, 12),
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
  version: 4,
  muscleGroups: DEFAULT_MUSCLE_GROUPS,
  workoutLog: [],
  workouts: DEFAULT_WORKOUTS,
  settings: DEFAULT_SETTINGS,
};
