export const DEFAULT_MUSCLE_GROUPS = [
  { id: 'chest',       name: 'Chest',                     recommendedRestHours: 72 },
  { id: 'upper_back',  name: 'Upper Back',                recommendedRestHours: 72 },
  { id: 'lower_back',  name: 'Lower Back',                recommendedRestHours: 72 },
  { id: 'shoulders',   name: 'Shoulders',                 recommendedRestHours: 48 },
  { id: 'traps',       name: 'Traps',                     recommendedRestHours: 48 },
  { id: 'biceps',      name: 'Biceps',                    recommendedRestHours: 48 },
  { id: 'triceps',     name: 'Triceps',                   recommendedRestHours: 48 },
  { id: 'forearms',    name: 'Forearms',                  recommendedRestHours: 48 },
  { id: 'quads',       name: 'Quads',                     recommendedRestHours: 72 },
  { id: 'hamstrings',  name: 'Hamstrings',                recommendedRestHours: 72 },
  { id: 'glutes',      name: 'Glutes',                    recommendedRestHours: 72 },
  { id: 'calves',      name: 'Calves',                    recommendedRestHours: 48 },
  { id: 'abs',         name: 'Abs / Core',                recommendedRestHours: 24 },
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
