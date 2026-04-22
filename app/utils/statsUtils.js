const MS_PER_HOUR = 3600 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function lastWorkedAt(workoutLog, muscleId) {
  let max = null;
  for (const entry of workoutLog) {
    if (!entry.muscleGroupIds?.includes(muscleId)) continue;
    const t = new Date(entry.timestamp).getTime();
    if (Number.isNaN(t)) continue;
    if (max === null || t > max) max = t;
  }
  return max === null ? null : new Date(max).toISOString();
}

export function hoursSinceLastWorked(workoutLog, muscleId) {
  const last = lastWorkedAt(workoutLog, muscleId);
  if (!last) return Infinity;
  return (Date.now() - new Date(last).getTime()) / MS_PER_HOUR;
}

export function timestampsFor(workoutLog, muscleId) {
  return workoutLog
    .filter((e) => e.muscleGroupIds?.includes(muscleId))
    .map((e) => new Date(e.timestamp).getTime())
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => a - b);
}

export function avgRestIntervalHours(workoutLog, muscleId) {
  const ts = timestampsFor(workoutLog, muscleId);
  if (ts.length < 2) return null;
  let sum = 0;
  for (let i = 1; i < ts.length; i++) sum += ts[i] - ts[i - 1];
  return sum / (ts.length - 1) / MS_PER_HOUR;
}

export function longestRestHours(workoutLog, muscleId) {
  const ts = timestampsFor(workoutLog, muscleId);
  if (ts.length < 2) return null;
  let max = 0;
  for (let i = 1; i < ts.length; i++) max = Math.max(max, ts[i] - ts[i - 1]);
  return max / MS_PER_HOUR;
}

export function totalWorkouts(workoutLog, muscleId) {
  if (muscleId === undefined) return workoutLog.length;
  return workoutLog.filter((e) => e.muscleGroupIds?.includes(muscleId)).length;
}

export function adherence(workoutLog, muscleId, recommendedRestHours) {
  const ts = timestampsFor(workoutLog, muscleId);
  if (ts.length < 2) return null;
  let ok = 0;
  let total = 0;
  for (let i = 1; i < ts.length; i++) {
    const gap = (ts[i] - ts[i - 1]) / MS_PER_HOUR;
    total++;
    if (gap >= recommendedRestHours) ok++;
  }
  return total === 0 ? null : ok / total;
}

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function longestDailyStreak(workoutLog) {
  if (workoutLog.length === 0) return 0;
  const days = new Set(
    workoutLog.map((e) => ymd(new Date(e.timestamp)))
  );
  const sorted = Array.from(days).sort();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]).getTime();
    const now = new Date(sorted[i]).getTime();
    if (Math.round((now - prev) / MS_PER_DAY) === 1) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}

export function workoutsPerWeek(workoutLog, weeks = 4) {
  const now = Date.now();
  const buckets = Array(weeks).fill(0);
  for (const entry of workoutLog) {
    const t = new Date(entry.timestamp).getTime();
    if (Number.isNaN(t)) continue;
    const ageWeeks = Math.floor((now - t) / (7 * MS_PER_DAY));
    if (ageWeeks >= 0 && ageWeeks < weeks) buckets[ageWeeks]++;
  }
  return buckets;
}

export function mostTrainedMuscle(workoutLog, muscleGroups, lookbackDays = 30) {
  const cutoff = Date.now() - lookbackDays * MS_PER_DAY;
  const counts = {};
  for (const entry of workoutLog) {
    const t = new Date(entry.timestamp).getTime();
    if (Number.isNaN(t) || t < cutoff) continue;
    for (const id of entry.muscleGroupIds || []) {
      counts[id] = (counts[id] || 0) + 1;
    }
  }
  let bestId = null;
  let bestCount = 0;
  for (const mg of muscleGroups) {
    const c = counts[mg.id] || 0;
    if (c > bestCount) {
      bestCount = c;
      bestId = mg.id;
    }
  }
  return { muscleId: bestId, count: bestCount };
}

export function mostNeglectedMuscle(workoutLog, muscleGroups) {
  let bestId = null;
  let bestOverdue = -Infinity;
  for (const mg of muscleGroups) {
    const hours = hoursSinceLastWorked(workoutLog, mg.id);
    const overdue = hours - mg.recommendedRestHours;
    if (overdue > bestOverdue) {
      bestOverdue = overdue;
      bestId = mg.id;
    }
  }
  return { muscleId: bestId, overdueHours: bestOverdue };
}

export function longestRestedMuscleId(workoutLog, muscleGroups) {
  let bestId = null;
  let bestHours = -Infinity;
  for (const mg of muscleGroups) {
    const hours = hoursSinceLastWorked(workoutLog, mg.id);
    if (hours > bestHours) {
      bestHours = hours;
      bestId = mg.id;
    }
  }
  return bestId;
}

export function sortedMuscleGroups(workoutLog, muscleGroups) {
  return [...muscleGroups].sort((a, b) => {
    const ha = hoursSinceLastWorked(workoutLog, a.id);
    const hb = hoursSinceLastWorked(workoutLog, b.id);
    return hb - ha;
  });
}
