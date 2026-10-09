import { loadPersistedConfig } from "../config/storage";
import { defaultConfig } from "../config/config";

browser.action.onClicked.addListener(async () => {
  let config;
  try {
    config = await loadPersistedConfig();
  } catch {
    config = null;
  }
  const openMode = config?.openMode || defaultConfig.openMode;
  if (openMode === "page") {
    browser.tabs.create({ url: browser.runtime.getURL("sidebar.html") + "?mode=page" });
  } else {
    browser.sidebarAction.open();
  }
});