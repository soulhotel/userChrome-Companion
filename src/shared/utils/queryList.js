export function collectDescendantIds(state, id) {
  const item = state.itemsById[id];
  if (!item || item.type !== "folder") return [];
  let ids = [];
  for (const childId of item.children) {
    ids.push(childId);
    ids = ids.concat(collectDescendantIds(state, childId));
  }
  return ids;
}

export function isDescendantOf(state, ancestorId, candidateId) {
  const ancestor = state.itemsById[ancestorId];
  if (!ancestor || ancestor.type !== "folder") return false;
  for (const childId of ancestor.children) {
    if (childId === candidateId) return true;
    if (isDescendantOf(state, childId, candidateId)) return true;
  }
  return false;
}

export function getPrefsOrphanedByDeletion(state, id) {
  const item = state.itemsById[id];
  if (!item) return [];
  const idsToDelete = item.type === "folder" ? [id, ...collectDescendantIds(state, id)] : [id];
  const removedPrefs = idsToDelete
    .map((did) => state.itemsById[did])
    .filter((i) => i?.type === "optionRef")
    .map((i) => i.pref);
  const remaining = new Set(
    Object.values(state.itemsById)
      .filter((i) => i.type === "optionRef" && !idsToDelete.includes(i.id))
      .map((i) => i.pref)
  );
  return [...new Set(removedPrefs)].filter((p) => !remaining.has(p));
}