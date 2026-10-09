export function getPrefStates(state) {
  const result = {};
  for (const [pref, opt] of Object.entries(state.optionsByPref)) {
    result[pref] = state.toggleAllOff ? false : !!opt.on;
  }
  return result;
}

const PREF_REPLY_TIMEOUT_MS = 2000;

export function requestPrefValues(names) {
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();
    const timeout = setTimeout(() => finish(null), PREF_REPLY_TIMEOUT_MS);
    function handler(e) {
      if (e.detail?.requestId !== requestId) return;
      finish(e.detail.values);
    }
    function finish(values) {
      clearTimeout(timeout);
      document.removeEventListener("uccPrefValues", handler);
      resolve(values);
    }
    document.addEventListener("uccPrefValues", handler);
    document.dispatchEvent(new CustomEvent("uccGetPrefValues", { detail: { requestId, names }, bubbles: true }));
  });
}