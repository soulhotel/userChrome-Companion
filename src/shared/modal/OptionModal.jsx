import { useState } from "react";
import { useAppState, useAppDispatch } from "../../config/state";
import Modal from ".";

export default function OptionModal({ target, onClose }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const isEdit = target?.type === "optionRef";
  const existingOpt = isEdit ? state.optionsByPref[target.pref] : null;

  const [pref, setPref] = useState(isEdit ? target.pref : "");
  const [description, setDescription] = useState(existingOpt?.description || "");
  const [conflicts, setConflicts] = useState(existingOpt?.conflicts || []);
  const [conflictInput, setConflictInput] = useState("");
  const [on, setOn] = useState(existingOpt?.on || false);
  const [error, setError] = useState("");

  const conflictsFolder = conflicts.includes("folder");
  const conflictPrefs = conflicts.filter((c) => c !== "folder");

  function toggleFolderConflict() {
    setConflicts((prev) =>
      prev.includes("folder") ? prev.filter((c) => c !== "folder") : [...prev, "folder"]
    );
  }

  function addConflictPref() {
    const trimmed = conflictInput.trim();
    if (!trimmed || trimmed === "folder" || trimmed === pref) { setConflictInput(""); return; }
    if (!conflicts.includes(trimmed)) {
      setConflicts((prev) => [...prev, trimmed]);
    }
    setConflictInput("");
  }

  function removeConflictPref(p) {
    setConflicts((prev) => prev.filter((c) => c !== p));
  }

  function handleConflictKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addConflictPref();
    }
  }

  function handleSubmit() {
    const trimmed = pref.trim();
    if (!trimmed) { setError("Pref is required."); return; }

    if (!isEdit && state.optionsByPref[trimmed]) {
      const proceed = window.confirm(
        `"${trimmed}" already exists. Do you really want to create this option again?`
      );
      if (!proceed) return;
      dispatch({ type: "ADD_OPTION", payload: { pref: trimmed, afterId: state.selectedId } });
      onClose();
      return;
    }

    if (isEdit) {
      if (trimmed !== target.pref) {
        if (state.optionsByPref[trimmed]) {
          const proceed = window.confirm(
            `"${trimmed}" already exists as a separate option. Merge this into it? Every placement of "${target.pref}" will now point to "${trimmed}".`
          );
          if (!proceed) return;
        }
        dispatch({ type: "RENAME_OPTION_PREF", payload: { oldPref: target.pref, newPref: trimmed } });
      }
      dispatch({ type: "EDIT_OPTION", payload: { pref: trimmed, patch: { description, conflicts, on } } });
    } else {
      dispatch({ type: "ADD_OPTION", payload: { pref: trimmed, description, conflicts, on, afterId: state.selectedId } });
    }
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit Option" : "New Option"}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose}>Cancel</button>
          <button class="primary" onClick={handleSubmit}>{isEdit ? "Save" : "Create"}</button>
        </>
      }
    >
      <span className="muted bold">description</span>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="This option hides the nav bar"
      />

      <span className="muted bold">pref</span>
      <input
        type="text"
        value={pref}
        onChange={(e) => setPref(e.target.value)}
        placeholder="navbar.autohide"
      />

      {error && <div className="modal-error">{error}</div>}

      <span className="muted bold">conflicts</span>
      <flex-column className="modal-conflicts">
        <input
          type="text"
          value={conflictInput}
          onChange={(e) => setConflictInput(e.target.value)}
          onKeyDown={handleConflictKeyDown}
          onBlur={addConflictPref}
          placeholder="type a pref, press Enter"
        />
        {conflictPrefs.length > 0 && (
          <div className="conflict-tags">
            {conflictPrefs.map((p) => (
              <span key={p} className="conflict-tag">
                {p}
                <button type="button" onClick={() => removeConflictPref(p)}>×</button>
              </span>
            ))}
          </div>
        )}
      </flex-column>

      <flex-row>
        <input type="checkbox" checked={conflictsFolder} onChange={toggleFolderConflict} />
        <span>conflict with everything in the same folder</span>
      </flex-row>

      <flex-row>
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span>toggle ON</span>
      </flex-row>
    </Modal>
  );
}