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

export const DEFAULT_SETTINGS = {
  bodyView: 'front',
  notificationsEnabled: true,
  scheduledNotificationIds: {},
};

export const DEFAULT_STATE = {
  version: 1,
  muscleGroups: DEFAULT_MUSCLE_GROUPS,
  workoutLog: [],
  settings: DEFAULT_SETTINGS,
};
