import { useEffect, useRef, useState } from "react";
import { getPrefStates, requestPrefValues } from "./events";

export function usePrefBridge({ state, dispatch, loaded, hydratedTreeRef }) {
  const [prefsSynced, setPrefsSynced] = useState(false);
  const prevPrefNamesRef = useRef(new Set());
  const stateRef = useRef(state);
  stateRef.current = state;

  async function reconcile(names) {
    if (!names.length) return;
    const values = await requestPrefValues(names);
    if (values) dispatch({ type: "RECONCILE_PREF_STATES", payload: { values } });
  }

  useEffect(() => {
    if (!loaded) return;
    const names = Object.keys(hydratedTreeRef.current?.optionsByPref || {});
    prevPrefNamesRef.current = new Set(names);
    reconcile(names).then(() => setPrefsSynced(true));
  }, [loaded]);

  // live mirroring while this page stays open, from our source
  useEffect(() => {
    function onPrefChanged(e) {
      dispatch({ type: "EXTERNAL_PREF_CHANGE", payload: { pref: e.detail.name, value: e.detail.value } });
    }
    function onConnected() {
      reconcile(Object.keys(stateRef.current.optionsByPref));
    }
    document.addEventListener("uccPrefChanged", onPrefChanged);
    document.addEventListener("uccSupportConnected", onConnected);
    return () => {
      document.removeEventListener("uccPrefChanged", onPrefChanged);
      document.removeEventListener("uccSupportConnected", onConnected);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !prefsSynced) return;
    const currentPrefs = getPrefStates(state);
    const currentNames = new Set(Object.keys(currentPrefs));
    const removed = [...prevPrefNamesRef.current].filter((n) => !currentNames.has(n));

    if (currentNames.size) {
      document.dispatchEvent(new CustomEvent("uccSetPrefs", { detail: { changes: currentPrefs }, bubbles: true }));
    }
    if (removed.length) {
      document.dispatchEvent(new CustomEvent("uccDeletePrefs", { detail: { names: removed }, bubbles: true }));
    }
    prevPrefNamesRef.current = currentNames;
  }, [state.optionsByPref, state.toggleAllOff, loaded, prefsSynced]);

  return { prefsSynced };
}