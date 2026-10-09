import { useState } from "react";
import { useAppState, useAppDispatch, useConfig, useResetEverything } from "../../config/state";
import { downloadJSON, copyToClipboard } from "../utils/ioMethods";
import Modal from "../../shared/modal";

function ConfirmModal({ title, prompt, onClose, onConfirm }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
        </>
      }
    >
      <p>{prompt}</p>
    </Modal>
  );
}

export default function DataSection() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [config] = useConfig();
  const resetEverything = useResetEverything();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  function handleExportConfig(dest) {
    dest === "file" ? downloadJSON(config, "ucc-config.json") : copyToClipboard(config);
  }

  function handleExportUserData(dest) {
    const data = { optionsByPref: state.optionsByPref, itemsById: state.itemsById, rootOrder: state.rootOrder };
    dest === "file" ? downloadJSON(data, "ucc-userdata.json") : copyToClipboard(data);
  }

  return (
    <div className="data-section section-inner">
      <flex-row class="button-row">
        <button onClick={() => handleExportConfig("file")}>Export Config (File)</button>
        <button onClick={() => handleExportConfig("clipboard")}>Export Config (Clipboard)</button>
        <button onClick={() => handleExportUserData("file")}>Export User Data (File)</button>
        <button onClick={() => handleExportUserData("clipboard")}>Export User Data (Clipboard)</button>
        <button onClick={() => setShowDeleteModal(true)}>Delete All Options</button>
        <button onClick={() => setShowResetModal(true)}>Reset userChrome Companion</button>
      </flex-row>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete All Options"
          prompt="This will delete every option and folder you have. Continue?"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => dispatch({ type: "APPLY_PRESET", payload: { optionsByPref: {}, itemsById: {}, rootOrder: [] } })}
        />
      )}

      {showResetModal && (
        <ConfirmModal
          title="Reset userChrome Companion"
          prompt="This wipes everything — options, config, saved presets — and takes you back through onboarding. Continue?"
          onClose={() => setShowResetModal(false)}
          onConfirm={resetEverything}
        />
      )}
    </div>
  );
}