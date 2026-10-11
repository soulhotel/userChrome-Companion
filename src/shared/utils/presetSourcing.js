import { parsePreset, mergePreset } from "./presetSchema";
import { parseUserJs } from "./userjsParser";

const LOCAL_TESTING_REDIRECTS = {
  "https://raw.githubusercontent.com/soulhotel/FF-ULTIMA/main/ucc.json": "data/ucc.json",
};
const USE_LOCAL_TESTING = false;

export function resolvePresetUrl(link) {
  if (USE_LOCAL_TESTING && LOCAL_TESTING_REDIRECTS[link]) {
    return browser.runtime.getURL(LOCAL_TESTING_REDIRECTS[link]);
  }
  return link;
}

export function parseImportedSource(text) {
  try { return JSON.parse(text); } 
  catch { return parseUserJs(text); }
}

export function isCustomLink(link) {
  return typeof link === "string" && /^custom-\d+$/.test(link);
}

export function generateCustomLabel(savedPresets) {
  const nums = savedPresets
    .map((p) => /^custom-(\d+)$/.exec(p.link))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `custom-${next}`;
}

export function registerSavedPreset(config, patchConfig, { link, name, snapshot }) {
  const already = config.savedPresets.find((p) => p.link === link);
  const nextSaved = already
    ? config.savedPresets.map((p) => (p.link === link ? { ...p, name, snapshot } : p))
    : [...config.savedPresets, { name, link, snapshot }];
  patchConfig({ savedPresets: nextSaved });
}

// saved snapshot vs newly fetched JSON
export function diffTwoPresets(oldJson, newJson) {
  const oldParsed = parsePreset(oldJson);
  const newParsed = parsePreset(newJson);
  const oldPrefs = new Set(Object.keys(oldParsed.optionsByPref));
  const newPrefs = new Set(Object.keys(newParsed.optionsByPref));
  const addedPrefs = [...newPrefs].filter((p) => !oldPrefs.has(p));
  const removedPrefs = [...oldPrefs].filter((p) => !newPrefs.has(p));

  const folderNames = (itemsById) =>
    new Set(Object.values(itemsById).filter((i) => i.type === "folder").map((i) => i.name));
  const oldFolders = folderNames(oldParsed.itemsById);
  const newFolders = folderNames(newParsed.itemsById);
  const addedFolders = [...newFolders].filter((f) => !oldFolders.has(f));
  const removedFolders = [...oldFolders].filter((f) => !newFolders.has(f));

  return { addedPrefs, removedPrefs, addedFolders, removedFolders };
}

function pruneChildFromFolders(itemsById, id) {
  const next = { ...itemsById };
  for (const key of Object.keys(next)) {
    const item = next[key];
    if (item.type === "folder" && item.children.includes(id)) {
      next[key] = { ...item, children: item.children.filter((c) => c !== id) };
    }
  }
  return next;
}

export function applyPresetDelta(state, newJson, delta) {
  const afterAdd = mergePreset(state, newJson, { syncExisting: false });

  let optionsByPref = { ...afterAdd.optionsByPref };
  let itemsById = { ...afterAdd.itemsById };
  let rootOrder = [...afterAdd.rootOrder];

  const removedPrefSet = new Set(delta.removedPrefs);
  const removedFolderSet = new Set(delta.removedFolders);

  const removedFolderIds = Object.values(itemsById)
    .filter((i) => i.type === "folder" && removedFolderSet.has(i.name))
    .map((i) => i.id);

  for (const folderId of removedFolderIds) {
    const folder = itemsById[folderId];
    if (!folder) continue;
    for (const childId of folder.children) {
      const child = itemsById[childId];
      if (!child) continue;
      const isBeingRemoved =
        (child.type === "optionRef" && removedPrefSet.has(child.pref)) ||
        (child.type === "folder" && removedFolderSet.has(child.name));
      if (!isBeingRemoved) {
        rootOrder.push(childId); // survivors are relocated to root since new/old placement can't be identified
      }
    }
  }

  for (const folderId of removedFolderIds) {
    rootOrder = rootOrder.filter((id) => id !== folderId);
    itemsById = pruneChildFromFolders(itemsById, folderId);
    const next = { ...itemsById };
    delete next[folderId];
    itemsById = next;
  }

  for (const pref of removedPrefSet) {
    if (optionsByPref[pref]) {
      const next = { ...optionsByPref };
      delete next[pref];
      optionsByPref = next;
    }
  }

  const removedRefIds = Object.values(itemsById)
    .filter((i) => i.type === "optionRef" && removedPrefSet.has(i.pref))
    .map((i) => i.id);
  for (const id of removedRefIds) {
    rootOrder = rootOrder.filter((x) => x !== id);
    itemsById = pruneChildFromFolders(itemsById, id);
    const next = { ...itemsById };
    delete next[id];
    itemsById = next;
  }

  return { optionsByPref, itemsById, rootOrder };
}