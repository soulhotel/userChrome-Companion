import { useEffect, useRef, useState } from "react";
import { defaultConfig } from "./config";

const DB_NAME = "userChromeCompanion";
const DB_VERSION = 1;
export const STORES = { TREE: "tree", CONFIG: "config" };

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      Object.values(STORES).forEach((name) => {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function dbGet(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, "readonly").objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function dbSet(store, key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}


function loadPersistedTree() {
  return dbGet(STORES.TREE, "tree");
}
export function loadPersistedConfig() {
  return dbGet(STORES.CONFIG, "config");
}
function saveTree(treeSlice) {
  return dbSet(STORES.TREE, "tree", treeSlice);
}
function saveConfig(config) {
  return dbSet(STORES.CONFIG, "config", config);
}


export function useHydration({ dispatch, patchConfig, state, config }) {
  const [loaded, setLoaded] = useState(false);
  const hydratedTreeRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [savedTree, savedConfig] = await Promise.all([loadPersistedTree(), loadPersistedConfig()]);
      const resolvedConfig = savedConfig ? { ...defaultConfig, ...savedConfig } : defaultConfig;
      if (savedConfig) patchConfig(savedConfig);
      if (savedTree) {
        dispatch({
          type: "HYDRATE",
          payload: {...savedTree, expandedFolders: resolvedConfig.persistExpandedFolders ? savedTree.expandedFolders : [],},
        });
      }
      hydratedTreeRef.current = savedTree || null;
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveTree({
      optionsByPref: state.optionsByPref,
      itemsById: state.itemsById,
      rootOrder: state.rootOrder,
      expandedFolders: state.expandedFolders,
    });
  }, [loaded, state.optionsByPref, state.itemsById, state.rootOrder, state.expandedFolders]);

  useEffect(() => {
    if (!loaded) return;
    saveConfig(config);
  }, [loaded, config]);

  useEffect(() => {
    if (!loaded) return;
    saveConfig(config);
    try { if (config.openMode) localStorage.setItem("openMode", config.openMode); } catch {}
  }, [loaded, config]);

  return { loaded, hydratedTreeRef };
}