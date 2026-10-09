const genId = () => crypto.randomUUID();

export function parsePreset(json) {
  const optionsByPref = {};
  const itemsById = {};
  const rootOrder = [];

  function walk(entries, targetList) {
    for (const entry of entries) {
      if (entry.separator) {
        const id = genId();
        itemsById[id] = { id, type: "separator" };
        targetList.push(id);
        continue;
      }
      if (entry.folder) {
        const id = genId();
        const children = [];
        itemsById[id] = { id, type: "folder", name: entry.folder, children };
        targetList.push(id);
        walk(entry.options || [], children);
        continue;
      }
      const { pref, description = "", conflicts = [], on = false } = entry;
      if (!optionsByPref[pref]) optionsByPref[pref] = { description, conflicts, on };
      const id = genId();
      itemsById[id] = { id, type: "optionRef", pref };
      targetList.push(id);
    }
  }

  walk(json.options || [], rootOrder);
  return {
    name: json.preset || "Untitled Preset",
    link: json.link || null,
    optionsByPref,
    itemsById,
    rootOrder,
  };
}

export function buildPreset(state, name = "My Preset", link = null) {
  function serializeList(idList) {
    return idList.map((id) => {
      const item = state.itemsById[id];
      if (item.type === "separator") return { separator: true };
      if (item.type === "folder") return { folder: item.name, options: serializeList(item.children) };
      const opt = state.optionsByPref[item.pref];
      return { pref: item.pref, description: opt?.description || "", conflicts: opt?.conflicts || [], on: !!opt?.on };
    });
  }
  const preset = { preset: name, options: serializeList(state.rootOrder) };
  if (link) preset.link = link;
  return preset;
}

export function diffPreset(state, json) {
  const incoming = parsePreset(json);
  const currentPrefs = new Set(Object.keys(state.optionsByPref));
  const incomingPrefs = new Set(Object.keys(incoming.optionsByPref));
  const addedPrefs = [...incomingPrefs].filter((p) => !currentPrefs.has(p));
  const removedPrefs = [...currentPrefs].filter((p) => !incomingPrefs.has(p));

  const folderNames = (itemsById) =>
    new Set(Object.values(itemsById).filter((i) => i.type === "folder").map((i) => i.name));
  const currentFolders = folderNames(state.itemsById);
  const incomingFolders = folderNames(incoming.itemsById);
  const addedFolders = [...incomingFolders].filter((f) => !currentFolders.has(f));
  const removedFolders = [...currentFolders].filter((f) => !incomingFolders.has(f));

  return { addedPrefs, removedPrefs, addedFolders, removedFolders };
}

export function mergePreset(state, json, { syncExisting = false } = {}) {
  const incoming = parsePreset(json);
  const incomingPrefs = new Set(Object.keys(incoming.optionsByPref));
  const incomingFolderNames = new Set(
    Object.values(incoming.itemsById).filter((i) => i.type === "folder").map((i) => i.name)
  );

  let optionsByPref = { ...state.optionsByPref };
  let itemsById = { ...state.itemsById };
  let rootOrder = [...state.rootOrder];

  for (const [pref, data] of Object.entries(incoming.optionsByPref)) {
    if (!optionsByPref[pref]) {
      optionsByPref[pref] = data;
    } else if (syncExisting) {
      optionsByPref[pref] = { ...optionsByPref[pref], description: data.description, conflicts: data.conflicts };
    }
  }

  const placedPrefs = new Set(
    Object.values(itemsById).filter((i) => i.type === "optionRef").map((i) => i.pref)
  );
  const genIdLocal = () => crypto.randomUUID();

  function findOrCreateFolder(name, targetList) {
    for (const id of targetList) {
      if (itemsById[id]?.type === "folder" && itemsById[id].name === name) return itemsById[id];
    }
    const id = genIdLocal();
    const folder = { id, type: "folder", name, children: [] };
    itemsById = { ...itemsById, [id]: folder };
    targetList.push(id);
    return folder;
  }

  function addNewFromIncoming(entries, targetList) {
    for (const entry of entries) {
      if (entry.separator) continue;
      if (entry.folder) {
        addNewFromIncoming(entry.options || [], findOrCreateFolder(entry.folder, targetList).children);
        continue;
      }
      if (placedPrefs.has(entry.pref)) continue;
      const id = genIdLocal();
      itemsById = { ...itemsById, [id]: { id, type: "optionRef", pref: entry.pref } };
      targetList.push(id);
      placedPrefs.add(entry.pref);
    }
  }

  addNewFromIncoming(json.options || [], rootOrder);

  if (syncExisting) {
    for (const pref of Object.keys(optionsByPref)) {
      if (!incomingPrefs.has(pref)) delete optionsByPref[pref];
    }

    function pruneList(idList) {
      const kept = [];
      for (const id of idList) {
        const item = itemsById[id];
        if (!item) continue;
        if (item.type === "separator") { kept.push(id); continue; }
        if (item.type === "optionRef") {
          if (optionsByPref[item.pref]) kept.push(id);
          else delete itemsById[id];
          continue;
        }
        if (item.type === "folder") {
          const prunedChildren = pruneList(item.children);
          itemsById = { ...itemsById, [id]: { ...item, children: prunedChildren } };
          if (prunedChildren.length > 0 || incomingFolderNames.has(item.name)) {
            kept.push(id);
          } else {
            delete itemsById[id];
          }
        }
      }
      return kept;
    }

    rootOrder = pruneList(rootOrder);
  }

  return { optionsByPref, itemsById, rootOrder };
}