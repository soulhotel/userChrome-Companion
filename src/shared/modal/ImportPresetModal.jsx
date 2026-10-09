import Modal from ".";
import PresetPreview from "../components/PresetPreview";

export default function ImportPresetModal({ pendingImport, onSaveOnly, onImportOptions, onSyncOverwrite, onClose }) {
  const isLinked = !!(pendingImport.sourceUrl || pendingImport.json.link);

  return (
    <Modal
      title="Import Preset"
      onClose={onClose}
      footer={
        <>
          <button onClick={onSaveOnly}>Save Only</button>
          <button onClick={onImportOptions}>Import Options</button>
          <button onClick={onSyncOverwrite}>Sync Preset & Options</button>
        </>
      }
    >
      <PresetPreview json={pendingImport.json} />
      <p>{isLinked ? "This preset has a verified link." : "This preset has no link attached."}</p>
      {isLinked && (
        <p>
          Linked presets can be monitored for changes &amp; synced when updates occur.
          Syncing does not overwrite your modified options, unless configured to do so in Settings.
        </p>
      )}
    </Modal>
  );
}