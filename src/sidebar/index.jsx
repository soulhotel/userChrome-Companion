import { useState, useEffect } from "react";
import { useAppState, useAppDispatch, useConfig } from "../config/state";
import { useConnection } from "../global/useConnection";
import ConnectionModal from "../shared/modal/ConnectionModal";
import OnboardingModal from "../shared/modal/OnboardingModal";
import SyncPresetModal from "../shared/modal/SyncPresetModal";
import SelectPresetModal from "../shared/modal/SelectPresetModal";
import OptionModal from "../shared/modal/OptionModal";
import FolderModal from "../shared/modal/FolderModal";
import OptionsList from "./components/OptionsList";
import Toolbar from "./components/Toolbar";
import SearchList from "./components/SearchList";
import { useSearch } from "./utils/search";
import ContextMenu from "../shared/components/ContextMenu";
import { applyPresetDelta } from "../shared/utils/presetSourcing";
import { checkLinkedPresets } from "../shared/utils/syncPreset";
import { parsePreset } from "../shared/utils/presetSchema";

export default function Sidebar() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [config, patchConfig] = useConfig();
  const { connected, dismissed, retryConnection, dismissConnection } = useConnection();

  const [contextMenu, setContextMenu] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [syncPrompts, setSyncPrompts] = useState([]);

  const [showPresetModal, setShowPresetModal] = useState(false);
  const { isSearching } = useSearch();

  useEffect(() => {
    if (!config.hasOnboarded || connected !== true) return;
    checkLinkedPresets(state, config).then(setSyncPrompts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.hasOnboarded, config.monitorLinkedPresets, connected]);
  if (connected === false && !dismissed) return <ConnectionModal onRetry={retryConnection} onDismiss={dismissConnection} />;
  if (connected !== true && !dismissed) return null;
  if (!config.hasOnboarded) return <OnboardingModal />;

  function handleContextMenu(e, item) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  }

  function handleSyncConfirm(prompt) {
    if (config.presetSyncMode === "sync-overwrite") {
      dispatch({ type: "APPLY_PRESET", payload: parsePreset(prompt.json) });
    } else {
      const updated = applyPresetDelta(state, prompt.json, prompt.diff);
      dispatch({ type: "MERGE_PRESET", payload: updated });
    }
    const nextSaved = config.savedPresets.map((p) =>
      p.link === prompt.source.url ? { ...p, snapshot: prompt.json } : p
    );
    patchConfig({ savedPresets: nextSaved });
    setSyncPrompts((prev) => prev.filter((p) => p !== prompt));
  }

  function handleSyncDismiss(prompt) {
    setSyncPrompts((prev) => prev.filter((p) => p !== prompt));
  }

  const showOptionModal = editTarget?.type === "new-option" || editTarget?.type === "optionRef";
  const showFolderModal = editTarget?.type === "new-folder" || editTarget?.type === "folder";

  return (
    <div className="sidebar" onClick={() => setContextMenu(null)} onContextMenu={(e) => e.preventDefault()}>
      {isSearching ? (
        <SearchList onContextMenu={handleContextMenu} onEditRequest={setEditTarget} />
      ) : (
        <OptionsList onContextMenu={handleContextMenu} onEditRequest={setEditTarget} />
      )}
      <Toolbar
        onNewOption={() => setEditTarget({ type: "new-option" })}
        onNewFolder={() => setEditTarget({ type: "new-folder" })}
        onSelectPreset={() => setShowPresetModal(true)}
        onOpenSettings={() => browser.runtime.openOptionsPage()}
      />
      {showPresetModal && <SelectPresetModal onClose={() => setShowPresetModal(false)} />}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onEditRequest={setEditTarget}
          onClose={() => setContextMenu(null)}
        />
      )}
      {showOptionModal && <OptionModal target={editTarget} onClose={() => setEditTarget(null)} />}
      {showFolderModal && <FolderModal target={editTarget} onClose={() => setEditTarget(null)} />}
      {syncPrompts.map((prompt) => (
        <SyncPresetModal
          key={prompt.source.url}
          prompt={prompt}
          onOkay={() => handleSyncDismiss(prompt)}
          onSync={() => handleSyncConfirm(prompt)}
        />
      ))}
    </div>
  );
}