export function getConflictTargets(state, pref) {
  const opt = state.optionsByPref[pref];
  if (!opt || !opt.conflicts?.length) return { tracked: [], untracked: [] };
  const targets = new Set();

  for (const conflict of opt.conflicts) {
    if (conflict === "folder") {
      for (const item of Object.values(state.itemsById)) {
        if (item.type !== "folder") continue;
        const placedPrefs = item.children
          .map((cid) => state.itemsById[cid])
          .filter((c) => c?.type === "optionRef")
          .map((c) => c.pref);
        if (placedPrefs.includes(pref)) {
          placedPrefs.forEach((p) => { if (p !== pref) targets.add(p); });
        }
      }
    } else if (conflict.endsWith("*")) {
      const prefix = conflict.slice(0, -1);
      for (const candidate of Object.keys(state.optionsByPref)) {
        if (candidate !== pref && candidate.startsWith(prefix)) targets.add(candidate);
      }
    } else {
      targets.add(conflict);
    }
  }

  const tracked = [];
  const untracked = [];
  for (const p of targets) {
    if (state.optionsByPref[p]) {
      if (state.optionsByPref[p].on) tracked.push(p);
    } else {
      untracked.push(p);
    }
  }
  return { tracked, untracked };
}

export function applyAutoOff(optionsByPref, trackedTargets) {
  let next = optionsByPref;
  trackedTargets.forEach((p) => {
    if (next[p]?.on) next = { ...next, [p]: { ...next[p], on: false } };
  });
  return next;
}