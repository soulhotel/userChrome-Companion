import Modal from ".";
import { getViewSourceUrl } from "../utils/syncPreset";

export default function SyncPresetModal({ prompt, onOkay, onSync }) {
  const { source, diff } = prompt;
  const viewSourceUrl = getViewSourceUrl(source.url);

  return (
    <Modal
      title="Preset Update"
      onClose={onOkay}
      footer={
        <>
          <button onClick={onOkay}>Okay</button>
          <button onClick={() => window.open(viewSourceUrl, "_blank")}>View Source</button>
          <button onClick={onSync}>Sync</button>
        </>
      }
    >
      <p>{source.presetName} just got a new update.</p>
      <ul className="sync-diff">
        {diff.addedFolders.map((f) => <li key={`af-${f}`} className="diff-added">+ {f} (folder)</li>)}
        {diff.addedPrefs.map((p) => <li key={`ap-${p}`} className="diff-added">+ {p}</li>)}
        {diff.removedFolders.map((f) => <li key={`rf-${f}`} className="diff-removed">- {f} (folder)</li>)}
        {diff.removedPrefs.map((p) => <li key={`rp-${p}`} className="diff-removed">- {p}</li>)}
      </ul>
    </Modal>
  );
}