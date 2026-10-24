import { useAppState, useAppDispatch } from "../../config/state";
import { PlusIcon, FolderIcon, GearIcon, CircleIcon, BackIcon, ForwardIcon, SearchIcon, HamburgerIcon } from "../../shared/assets/Svg";
import SearchBar from "./SearchBar";
import { useSearch } from "../utils/search";

export default function Toolbar({ onNewOption, onNewFolder, onSelectPreset, onOpenSettings }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { isOpen, closeSearch, toggleSearch } = useSearch();

  const act = (fn) => () => {
    closeSearch();
    fn();
  };

  return (
    <div className="toolbar">
      {/* search-container toolbar-container */}
      <SearchBar />
      {/*  */}
      <div className="btn-container toolbar-container">
        <button className={`toolbar-btn ${state.toggleAllOff ? "" : " active"}`} title="Toggle all" aria-label="Toggle userChrome" onClick={act(() => dispatch({ type: "TOGGLE_ALL" }))}>
          <CircleIcon />
        </button>
        <button className="toolbar-btn" title="Create a New Option" aria-label="New Option" onClick={act(onNewOption)}>
          <PlusIcon />
        </button>
        <button className="toolbar-btn" title="Create a New Folder" aria-label="New Folder" onClick={act(onNewFolder)}>
          <FolderIcon />
        </button>
        <button className="toolbar-btn" title="Undo last toggle" aria-label="Undo" disabled={!state.history.length} onClick={act(() => dispatch({ type: "UNDO" }))}>
          <BackIcon />
        </button>
        <button className="toolbar-btn" title="Redo last toggle" aria-label="Redo" disabled={!state.future.length} onClick={act(() => dispatch({ type: "REDO" }))}>
          <ForwardIcon />
        </button>
        <button className="toolbar-btn" title="Select a Preset" aria-label="Select Preset" onClick={act(onSelectPreset)}>
          <HamburgerIcon />
        </button>
        <button className={`toolbar-btn${isOpen ? " active" : ""}`} title="Search through list" aria-label="Search" aria-pressed={isOpen} onClick={toggleSearch}>
          <SearchIcon />
        </button>
        <button className="toolbar-btn" title="Open Settings" aria-label="Settings" onClick={act(onOpenSettings)}>
          <GearIcon />
        </button>
        </div>
    </div>
  );
}