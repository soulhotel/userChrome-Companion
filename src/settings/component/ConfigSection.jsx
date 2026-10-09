import { useState, useEffect } from "react";
import { useConfig } from "../../config/state";
import { useConnection } from "../../global/useConnection";
import { getExtensionVersion, fetchLatestExtensionVersion } from "../../shared/utils/versionCheck";
import ConnectionModal from "../../shared/modal/ConnectionModal";

export default function ConfigSection() {
  const [config, patchConfig] = useConfig();
  const { connected, retryConnection } = useConnection();
  const [latestVersion, setLatestVersion] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const currentVersion = getExtensionVersion();

  useEffect(() => {
    fetchLatestExtensionVersion().then(setLatestVersion);
  }, []);

  const versionStatus = !latestVersion ? "unknown" : currentVersion === latestVersion ? "current" : "outdated";

  function handleConnectionClick() {
    if (connected) return;
    retryConnection();
    setShowConnectionModal(true);
  }

  return (
    <div className="config-section section-inner">
      <p className="muted bold">userChrome Companion Status</p>
      <flex-row class="button-row extension-status">
        <button className={`status-btn ${versionStatus}`}>Extension Version: {currentVersion}</button>
        <button className={`status-btn ${connected ? "connected" : "disconnected"}`} onClick={handleConnectionClick}>
          userChromeJS Bridge: {connected ? "Connected" : "Disconnected"}
        </button>
      </flex-row>
      {showConnectionModal && <ConnectionModal onRetry={retryConnection} onDismiss={() => setShowConnectionModal(false)} />}
      <p className="muted bold">User Settings</p>
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
          <option value="sync-additions">Sync & only add new prefs</option>
          <option value="sync-overwrite">Sync & overwrite my prefs</option>
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