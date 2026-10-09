import { diffTwoPresets, isCustomLink } from "./presetSourcing";

export async function checkLinkedPresets(state, config) {
  if (config.monitorLinkedPresets !== "notify") return [];
  const selected = config.savedPresets.find((p) => p.link === config.selectedPreset);
  if (!selected || isCustomLink(selected.link) || !selected.snapshot) return [];

  try {
    const res = await fetch(selected.link);
    if (!res.ok) return [];
    const newJson = await res.json();
    const delta = diffTwoPresets(selected.snapshot, newJson);
    const hasChanges =
      delta.addedPrefs.length || delta.removedPrefs.length || delta.addedFolders.length || delta.removedFolders.length;
    if (!hasChanges) return [];
    return [{ source: { url: selected.link, presetName: selected.name }, json: newJson, diff: delta }];
  } catch (ex) {
    console.warn(`syncPreset: couldn't check ${selected.link}`, ex);
    return [];
  }
}

export function getViewSourceUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "raw.githubusercontent.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `https://github.com/${parts[0]}/${parts[1]}`;
    }
    if (u.hostname === "gitlab.com" && u.pathname.includes("/-/raw/")) {
      return `https://gitlab.com${u.pathname.split("/-/raw/")[0]}`;
    }
    return url;
  } catch {
    return url;
  }
}