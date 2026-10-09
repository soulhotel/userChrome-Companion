import { useState } from "react";
import Modal from ".";

export default function CreatePresetModal({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) { setError("A name is required."); return; }
    onCreate(trimmed);
    onClose();
  }

  return (
    <Modal
      title="Create a Preset"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleCreate}>Create</button>
        </>
      }
    >
      <p className="note">Note: This preset will be generated using your current options list and currently toggled options.</p>
      <flex-column>
        <label>Preset Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </flex-column>
      {error && <div className="modal-error">{error}</div>}
    </Modal>
  );
}