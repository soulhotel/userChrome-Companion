// these queries relate to data

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

// these queries relate to search 

export function tokenizeQuery(query) {
  return String(query || "").toLowerCase().split(/[\s.\-_]+/).filter(Boolean);
}

// we are tiered searching, prefs first, description second, and split results third
export function searchOptions(state, terms) {
  if (!terms.length) return [];
  const entries = new Map();
  (function walk(ids, path) {
    for (const id of ids) {
      const item = state.itemsById[id];
      if (!item) continue;
      if (item.type === "folder") { walk(item.children, [...path, item.name]); continue; }
      if (item.type !== "optionRef") continue;
      let entry = entries.get(item.pref);
      if (!entry) { entry = { item, folders: [] }; entries.set(item.pref, entry); }
      if (path.length) {
        const label = path.join(" / ");
        if (!entry.folders.includes(label)) entry.folders.push(label);
      }
    }
  })(state.rootOrder, []);
  const tiers = [[], [], []];
  for (const entry of entries.values()) {
    const pref = entry.item.pref.toLowerCase();
    const desc = (state.optionsByPref[entry.item.pref]?.description || "").toLowerCase();
    const both = `${pref} ${desc}`;
    if (terms.every((t) => pref.includes(t))) tiers[0].push(entry);
    else if (terms.every((t) => desc.includes(t))) tiers[1].push(entry);
    else if (terms.every((t) => both.includes(t))) tiers[2].push(entry);
  }
  return tiers.flat();
}