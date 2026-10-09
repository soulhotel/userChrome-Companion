import { useState } from "react";
import { useAppState, useAppDispatch } from "../../config/state";
import Modal from ".";

export default function FolderModal({ target, onClose }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const isEdit = target?.type === "folder";
  const [name, setName] = useState(isEdit ? target.name : "");
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Name is required."); return; }
    if (isEdit) {
      dispatch({ type: "EDIT_FOLDER", payload: { id: target.id, name: trimmed } });
    } else {
      dispatch({ type: "ADD_FOLDER", payload: { name: trimmed, afterId: state.selectedId } });
    }
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit Folder" : "New Folder"}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose}>Cancel</button>
          <button class="primary" onClick={handleSubmit}>{isEdit ? "Save" : "Create"}</button>
        </>
      }
    > <flex-row>
        <span>Name</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Folder name" autoFocus />
      </flex-row>
      {error && <div className="modal-error">{error}</div>}
    </Modal>
  );
}