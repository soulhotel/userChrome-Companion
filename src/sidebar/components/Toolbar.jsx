import { useAppState, useAppDispatch } from "../../config/state";
import { PlusIcon, FolderIcon, GearIcon, CircleIcon, BackIcon, ForwardIcon, HamburgerIcon } from "../../shared/assets/Svg";

export default function Toolbar({ onNewOption, onNewFolder, onSelectPreset, onOpenSettings }) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div className="toolbar">
      <div className="toolbar-container">
        <button className={`toolbar-btn ${state.toggleAllOff ? "" : " active"}`} title="Toggle all" aria-label="Toggle userChrome" onClick={() => dispatch({ type: "TOGGLE_ALL" })}>
          <CircleIcon />
        </button>
        <button className="toolbar-btn" title="Create a New Option" aria-label="New Option" onClick={onNewOption}>
          <PlusIcon />
        </button>
        <button className="toolbar-btn" title="Create a New Folder" aria-label="New Folder" onClick={onNewFolder}>
          <FolderIcon />
        </button>
        <button className="toolbar-btn" title="Undo last toggle" aria-label="Undo" disabled={!state.history.length} onClick={() => dispatch({ type: "UNDO" })}>
          <BackIcon />
        </button>
        <button className="toolbar-btn" title="Redo last toggle" aria-label="Redo" disabled={!state.future.length} onClick={() => dispatch({ type: "REDO" })}>
          <ForwardIcon />
        </button>
        <button className="toolbar-btn" title="Select a Preset" aria-label="Select Preset" onClick={onSelectPreset}>
          <HamburgerIcon />
        </button>
        <button className="toolbar-btn" title="Open Settings" aria-label="Settings" onClick={onOpenSettings}>
          <GearIcon />
        </button>
        </div>
    </div>
  );
}