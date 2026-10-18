import { loadPersistedConfig } from "../config/storage";
import { defaultConfig } from "../config/config";

browser.action.onClicked.addListener(() => {
  let mode = defaultConfig.openMode;
  try { mode = localStorage.getItem("openMode") || mode; } catch {}

  if (mode === "page") {
    browser.tabs.create({ url: browser.runtime.getURL("sidebar.html") + "?mode=page" });
  } else {
    browser.sidebarAction.open();
  }
});