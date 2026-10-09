import { useAppState, useAppDispatch, useConfig } from "../../config/state";
import { useDraggable, useDropZone } from "../utils/dragDrop";
import { useTooltip } from "../../shared/components/Tooltip";
import { getConflictTargets } from "../../shared/utils/conflictResolver";
import { CircleIcon } from "../../shared/assets/Svg";

export default function OptionCard({ item, onContextMenu, onEditRequest }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [config] = useConfig();
  const drag = useDraggable(item.id);
  const drop = useDropZone(item.id, "split");
  const { showTooltip, hideTooltip } = useTooltip();
  const opt = state.optionsByPref[item.pref];
  const isSelected = state.selectedId === item.id;
  const isOn = opt.on && !state.toggleAllOff;

  if (!opt) return null;

  function handleToggle(e) {
    e.stopPropagation();
    const turningOn = !opt.on;
    if (turningOn) {
      const { tracked, untracked } = getConflictTargets(state, item.pref);
      const allTargets = [...tracked, ...untracked];
      if (config.conflictHandling === "notify" && allTargets.length) {
        if (!window.confirm(`Turning this on will turn off: ${allTargets.join(", ")}. Continue?`)) return;
      }
      if (untracked.length) {
        const changes = Object.fromEntries(untracked.map((p) => [p, false]));
        document.dispatchEvent(new CustomEvent("uccSetPrefs", { detail: { changes }, bubbles: true }));
      }
    }
    dispatch({ type: "TOGGLE_OPTION", payload: { pref: item.pref } });
  }

  function handleClick() {
    dispatch({ type: "SET_SELECTED", payload: { id: item.id } });
    handleToggle({ stopPropagation() {} });
  }

  const hasConflicts = opt.conflicts && opt.conflicts.length > 0;

  return (
    <div
      className={`tree-item option-card${isSelected ? " selected" : ""}${drag.isDragging ? " dragging" : ""}`}
      data-on={isOn}
      draggable={drag.draggable}
      data-id={item.id}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, item)}
      onDragStart={drag.onDragStart}
      onDragEnd={drag.onDragEnd}
      onDragOver={drop.onDragOver}
      onDrop={drop.onDrop}
    >
      <div className="option-desc">{opt.description || "title preface option"}</div>
      <div className="option-bottom-row">
        <span className="option-pref">{item.pref}</span>
        {hasConflicts && (
          <span
            className="conflict-indicator"
            onMouseEnter={(e) => {
              const resolved = opt.conflicts.flatMap((c) => {
                if (c === "folder") return ["every other option in this folder"];
                if (c.endsWith("*")) {
                  const prefix = c.slice(0, -1);
                  return Object.keys(state.optionsByPref).filter((p) => p !== item.pref && p.startsWith(prefix));
                }
                return [c];
              });
              showTooltip(e, `Conflicts with: ${resolved.join(", ")}`);
            }}
            onMouseLeave={hideTooltip}
          >C
          </span>
        )}
      </div>
      {isOn && (
        <span className="toggle-indicator"><CircleIcon/></span>
      )}
    </div>
  );
}