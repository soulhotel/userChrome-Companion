export const defaultConfig = {
  hasOnboarded: false,
  openMode: "sidebar", // sidebar, page
  conflictHandling: "auto-off", // auto-off, notify
  persistExpandedFolders: true,
  monitorLinkedPresets: "notify", // notify, ignore
  presetSyncMode: "sync-additions", // sync-additions, sync-overwrite
  selectedPreset: null, //link
  savedPresets: [
    { name: "FF Ultima", link: "https://raw.githubusercontent.com/soulhotel/FF-ULTIMA/main/ucc.json", snapshot: null },
  ],
};