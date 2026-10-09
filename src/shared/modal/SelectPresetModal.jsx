import { useConfig, useAppDispatch } from "../../config/state";
import { parsePreset } from "../utils/presetSchema";
import { PresetCard, CreatePresetCard } from "../components/PresetCard";
import Modal from ".";

export default function SelectPresetModal({ onClose }) {
  const [config, patchConfig] = useConfig();
  const dispatch = useAppDispatch();

  function handleSelect(preset) {
    if (!preset.snapshot) return;
    dispatch({ type: "APPLY_PRESET", payload: parsePreset(preset.snapshot) });
    patchConfig({ selectedPreset: preset.link });
    onClose();
  }

  function handleCreateClick() {
    const url = browser.runtime.getURL("settings.html") + "#toolbar/presets/create";
    browser.tabs.create({ url });
    onClose();
  }

  return (
    <Modal title="Select a Preset" onClose={onClose}>
      <div className="preset-list">
        {config.savedPresets.map((preset) => (
          <PresetCard
            key={preset.link}
            name={preset.name}
            link={preset.link}
            selected={preset.link === config.selectedPreset}
            onSelect={() => handleSelect(preset)}
          />
        ))}
        <CreatePresetCard onClick={handleCreateClick} />
      </div>
    </Modal>
  );
}