import { useConfig } from "../../config/state";

export default function AppBehavior() {
  const [config, patchConfig] = useConfig();

  return (
    <div className="app-behavior-section section-inner">
      <flex-row>
        <span>
          Where should userChrome Companion open
          <b className="muted" title="Note: To open userChrome Companion as a page, you should visit/bookmark the url, or click the Extension Button in the Nav Bar."> 🛈 </b>
        </span>
        <select value={config.openMode} onChange={(e) => patchConfig({ openMode: e.target.value })}>
          <option value="sidebar">In Sidebar</option>
          <option value="page">As Page</option>
        </select>
      </flex-row>

      <flex-row>
        <span>How to handle conflicting options</span>
        <select value={config.conflictHandling} onChange={(e) => patchConfig({ conflictHandling: e.target.value })}>
          <option value="auto-off">Toggle off</option>
          <option value="notify">Notify me</option>
        </select>
      </flex-row>

      <flex-row>
        <input
          type="checkbox"
          checked={config.persistExpandedFolders}
          onChange={(e) => patchConfig({ persistExpandedFolders: e.target.checked })}
        />
        <span>Remember & restore open folders on exit</span>
      </flex-row>

      <flex-row>
        <span>How should presets be applied</span>
        <select value={config.presetSyncMode} onChange={(e) => patchConfig({ presetSyncMode: e.target.value })}>
          <option value="sync-additions">Only add new prefs</option>
          <option value="sync-overwrite">Overwrite my prefs</option>
        </select>
      </flex-row>

      <flex-row>
        <span>What to do when a Preset Update is detected</span>
        <select value={config.monitorLinkedPresets} onChange={(e) => patchConfig({ monitorLinkedPresets: e.target.value })}>
          <option value="notify">Notify me</option>
          <option value="ignore">Ignore</option>
        </select>
      </flex-row>
    </div>
  );
}