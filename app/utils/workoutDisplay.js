export function buildTargetSummary(workout, muscleGroups) {
  if (!workout || !workout.muscleGroupIds?.length) return '';

  const parentIdSet = new Set((muscleGroups || []).map((m) => m.id));
  const parentNameById = new Map((muscleGroups || []).map((m) => [m.id, m.name]));
  const subInfoById = new Map();
  for (const mg of muscleGroups || []) {
    for (const sg of mg.subGroups || []) {
      subInfoById.set(sg.id, {
        parentId: mg.id,
        name: sg.name.replace(/\s*\([^)]*\)\s*$/, ''),
      });
    }
  }

  const subsByParent = new Map();
  const parentOrder = [];
  for (const id of workout.muscleGroupIds) {
    if (parentIdSet.has(id)) {
      if (!subsByParent.has(id)) {
        subsByParent.set(id, []);
        parentOrder.push(id);
      }
    } else {
      const info = subInfoById.get(id);
      if (!info) continue;
      if (!subsByParent.has(info.parentId)) {
        subsByParent.set(info.parentId, []);
        parentOrder.push(info.parentId);
      }
      subsByParent.get(info.parentId).push(info.name);
    }
  }
  return parentOrder
    .map((pid) => {
      const subs = subsByParent.get(pid) || [];
      const parentName = parentNameById.get(pid);
      return subs.length > 0 ? `${parentName} (${subs.join(', ')})` : parentName;
    })
    .join(' · ');
}
