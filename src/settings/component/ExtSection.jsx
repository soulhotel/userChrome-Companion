import { useState, useEffect } from "react";
import { useConnection } from "../../global/useConnection";
import { getExtensionVersion, fetchLatestExtensionVersion } from "../../shared/utils/versionCheck";
import ConnectionModal from "../../shared/modal/ConnectionModal";

export default function ExtSection() {
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
    <div className="ext-section section-inner">
      <flex-row class="button-row extension-status">
        <button className={`status-btn ${versionStatus}`}>Extension Version: {currentVersion}</button>
        <button className={`status-btn ${connected ? "connected" : "disconnected"}`} onClick={handleConnectionClick}>
          userChromeJS Bridge: {connected ? "Connected" : "Disconnected"}
        </button>
      </flex-row>
      {showConnectionModal && <ConnectionModal onRetry={retryConnection} onDismiss={() => setShowConnectionModal(false)} />}
    </div>
  );
}