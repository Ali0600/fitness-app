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

export const DEFAULT_WORKOUTS = [
  {
    id: 'bench_press',
    name: 'Bench Press',
    muscleGroupIds: [
      'chest', 'chest_middle', 'chest_lower',
      'triceps', 'triceps_lateral', 'triceps_medial',
      'shoulders', 'delt_anterior',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'incline_bench_press',
    name: 'Incline Bench Press',
    muscleGroupIds: [
      'chest', 'chest_upper',
      'shoulders', 'delt_anterior',
      'triceps', 'triceps_long',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'dip',
    name: 'Dip',
    muscleGroupIds: [
      'chest', 'chest_lower',
      'triceps', 'triceps_medial', 'triceps_lateral',
      'shoulders', 'delt_anterior',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    muscleGroupIds: [
      'shoulders', 'delt_anterior', 'delt_lateral',
      'triceps', 'triceps_long', 'triceps_lateral',
      'traps', 'traps_upper',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    muscleGroupIds: ['shoulders', 'delt_lateral'],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    muscleGroupIds: [
      'shoulders', 'delt_posterior',
      'upper_back', 'rhomboids', 'mid_traps',
      'traps', 'traps_middle',
    ],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'triceps_pushdown',
    name: 'Triceps Pushdown',
    muscleGroupIds: ['triceps', 'triceps_lateral', 'triceps_medial'],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'skullcrusher',
    name: 'Skullcrusher',
    muscleGroupIds: ['triceps', 'triceps_long', 'triceps_medial'],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'pull_up',
    name: 'Pull-Up',
    muscleGroupIds: [
      'upper_back', 'lats', 'rhomboids', 'mid_traps', 'teres',
      'biceps', 'biceps_long',
      'forearms', 'forearm_flexors',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'barbell_row',
    name: 'Barbell Row',
    muscleGroupIds: [
      'upper_back', 'lats', 'rhomboids', 'mid_traps',
      'traps', 'traps_middle',
      'biceps', 'biceps_long',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'barbell_curl',
    name: 'Barbell Curl',
    muscleGroupIds: ['biceps', 'biceps_long', 'biceps_short', 'brachialis'],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    muscleGroupIds: [
      'biceps', 'brachialis', 'biceps_long',
      'forearms', 'brachioradialis',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'shrug',
    name: 'Shrug',
    muscleGroupIds: ['traps', 'traps_upper'],
    defaultSets: setsOf(3, 12),
    isSeed: true,
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroupIds: [
      'lower_back', 'erector_spinae', 'multifidus',
      'glutes', 'glute_max',
      'hamstrings', 'biceps_femoris', 'semitendinosus', 'semimembranosus',
      'upper_back', 'lats',
      'forearms', 'forearm_flexors',
      'traps', 'traps_upper', 'traps_middle',
    ],
    defaultSets: setsOf(3, 5),
    isSeed: true,
  },
  {
    id: 'back_squat',
    name: 'Back Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 5),
    isSeed: true,
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_medialis', 'vastus_lateralis', 'vastus_intermedius',
      'glutes', 'glute_max',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 6),
    isSeed: true,
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    muscleGroupIds: [
      'hamstrings', 'biceps_femoris', 'semitendinosus', 'semimembranosus',
      'glutes', 'glute_max',
      'lower_back', 'erector_spinae',
    ],
    defaultSets: setsOf(3, 8),
    isSeed: true,
  },
  {
    id: 'hip_thrust',
    name: 'Hip Thrust',
    muscleGroupIds: [
      'glutes', 'glute_max', 'glute_med',
      'hamstrings', 'biceps_femoris',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    muscleGroupIds: [
      'quads', 'rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius',
      'glutes', 'glute_max',
    ],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'calf_raise',
    name: 'Calf Raise',
    muscleGroupIds: ['calves', 'gastrocnemius', 'soleus'],
    defaultSets: setsOf(3, 15),
    isSeed: true,
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroupIds: ['abs', 'rectus_abdominis', 'transverse_abdominis', 'obliques'],
    defaultSets: setsOf(3, 30),
    isSeed: true,
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    muscleGroupIds: ['abs', 'rectus_abdominis', 'obliques'],
    defaultSets: setsOf(3, 10),
    isSeed: true,
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    muscleGroupIds: ['abs', 'obliques', 'rectus_abdominis'],
    defaultSets: setsOf(3, 20),
    isSeed: true,
  },
];

export const DEFAULT_SETTINGS = {
  bodyView: 'front',
  notificationsEnabled: true,
  scheduledNotificationIds: {},
};

export const DEFAULT_STATE = {
  version: 1,
  muscleGroups: DEFAULT_MUSCLE_GROUPS,
  workoutLog: [],
  workouts: DEFAULT_WORKOUTS,
  settings: DEFAULT_SETTINGS,
};
