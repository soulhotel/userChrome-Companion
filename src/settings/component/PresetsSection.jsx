import { useState, useRef, useEffect } from "react";
import { useAppState, useAppDispatch, useConfig } from "../../config/state";
import { downloadJSON, copyToClipboard } from "../utils/ioMethods";
import { buildPreset, parsePreset, mergePreset } from "../../shared/utils/presetSchema";
import { isCustomLink, generateCustomLabel, registerSavedPreset, parseImportedSource } from "../../shared/utils/presetSourcing";
import { PresetCard, CreatePresetCard } from "../../shared/components/PresetCard";
import ImportPresetModal from "../../shared/modal/ImportPresetModal";
import CreatePresetModal from "../../shared/modal/CreatePresetModal";

export default function PresetsSection({ openCreatePresetModal, onCreatePresetModalHandled }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [config, patchConfig] = useConfig();
  const fileInputRef = useRef(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (openCreatePresetModal) {
      setShowCreateModal(true);
      onCreatePresetModalHandled();
    }
  }, [openCreatePresetModal]);

  function handleExportCurrent(dest) {
    const selected = config.savedPresets.find((p) => p.link === config.selectedPreset);
    const exportLink = selected && !isCustomLink(selected.link) ? selected.link : null;
    const preset = buildPreset(state, selected?.name || "My Options", exportLink);
    dest === "file" ? downloadJSON(preset, "ucc.json") : copyToClipboard(preset);
  }

  function handleFileChosen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = parseImportedSource(ev.target.result);
        setPendingImport({ json, sourceUrl: null });
        setError("");
      } catch {
        setError("Couldn't parse that file as a *.json or user.js");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleLinkSubmit() {
    const url = linkUrl.trim();
    if (!url) return;
    setError("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch failed");
      const text = await res.text();
      const json = parseImportedSource(text);
      setPendingImport({ json, sourceUrl: url });
      setLinkUrl("");
    } catch {
      setError("Can't load this file. Bad link? Syntax Errors?");
    }
  }

  function handleLinkKeyDown(e) {
    if (e.key === "Enter") handleLinkSubmit();
  }

  function saveOnly() {
    if (!pendingImport) return;
    const { json, sourceUrl } = pendingImport;
    const link = json.link || sourceUrl || generateCustomLabel(config.savedPresets);
    registerSavedPreset(config, patchConfig, { link, name: json.preset || "Imported Preset", snapshot: json });
    setPendingImport(null);
  }

  function importOptions() {
    if (!pendingImport) return;
    const { json, sourceUrl } = pendingImport;
    const link = json.link || sourceUrl || generateCustomLabel(config.savedPresets);
    dispatch({ type: "MERGE_PRESET", payload: mergePreset(state, json, { syncExisting: false }) });
    registerSavedPreset(config, patchConfig, { link, name: json.preset || "Imported Preset", snapshot: json });
    setPendingImport(null);
  }

  function syncAndImport() {
    // first save - nothing to diff against yet
    importOptions();
  }

  function handleSelectPreset(preset) {
    if (!preset.snapshot) return;
    dispatch({ type: "APPLY_PRESET", payload: parsePreset(preset.snapshot) });
    patchConfig({ selectedPreset: preset.link });
  }

  function handleDeletePreset(preset, e) {
    e.stopPropagation();
    const nextSaved = config.savedPresets.filter((p) => p.link !== preset.link);
    const patch = { savedPresets: nextSaved };
    if (config.selectedPreset === preset.link) patch.selectedPreset = null;
    patchConfig(patch);
  }

  function handleCreatePreset(name) {
    const link = generateCustomLabel(config.savedPresets);
    const built = buildPreset(state, name, null);
    registerSavedPreset(config, patchConfig, { link, name, snapshot: built });
  }

  return (
    <div className="presets-section section-inner">
      <p className="muted bold">Import/Export</p>

      <flex-row class="settings-link-import">
        <span>Import preset from link (url)</span>
        <input
          type="text"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={handleLinkKeyDown}
          placeholder="https://github.com/.../ucc.json"
        />
      </flex-row>

      <flex-row class="settings-import-export">
        <span>Import preset from</span>
        <button onClick={() => fileInputRef.current?.click()}>File</button>
        <input ref={fileInputRef} type="file" accept="application/json,.js,text/javascript" hidden onChange={handleFileChosen} />
      </flex-row>

      <flex-row class="settings-import-export">
        <span>Export preset to</span>
        <flex-row class="button-row">
          <button onClick={() => handleExportCurrent("file")}>File</button>
          <button onClick={() => handleExportCurrent("clipboard")}>Clipboard</button>
        </flex-row>
      </flex-row>

      {error && <div className="modal-error">{error}</div>}

      <flex-row class="preset-list-section">
        <span>Select a Preset</span>
        <div className="preset-list">
          {config.savedPresets.map((preset) => (
            <PresetCard
              key={preset.link}
              name={preset.name}
              link={preset.link}
              selected={preset.link === config.selectedPreset}
              onSelect={() => handleSelectPreset(preset)}
              onDelete={(e) => handleDeletePreset(preset, e)}
            />
          ))}
          <CreatePresetCard onClick={() => setShowCreateModal(true)} />
        </div>
      </flex-row>
  
      {pendingImport && (
        <ImportPresetModal
          pendingImport={pendingImport} 
          onSaveOnly={saveOnly} 
          onImportOptions={importOptions} 
          onSyncOverwrite={syncAndImport} 
          onClose={() => setPendingImport(null)}
        />
      )}

      {showCreateModal && (
        <CreatePresetModal onCreate={handleCreatePreset} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}