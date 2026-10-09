import { Fragment } from "react";
import { useAppState, useAppDispatch } from "../../config/state";
import { useDragDrop, useDraggable, useDropZone, DragPlaceholder } from "../utils/dragDrop";
import { ChevronDownIcon } from "../../shared/assets/Svg";
import OptionCard from "./OptionCard";
import Separator from "./Separator";

export default function FolderCard({ item, onContextMenu, onEditRequest }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { placeholder, setPlaceholderInside, commitDrop } = useDragDrop();
  const drag = useDraggable(item.id);
  const drop = useDropZone(item.id, "thirds");
  const isOpen = state.expandedFolders.includes(item.id);
  const isSelected = state.selectedId === item.id;

  const children = item.children.map((id) => state.itemsById[id]).filter(Boolean);
  const hereActive = placeholder && placeholder.parentId === item.id;

  return (
    <div
      className={`tree-item folder-card${isSelected ? " selected" : ""}${drag.isDragging ? " dragging" : ""}`}
      data-id={item.id}
      data-open={isOpen}
      draggable={drag.draggable}
      data-drop-inside={hereActive}
      onDragStart={drag.onDragStart}
      onDragEnd={drag.onDragEnd}
      onDragOver={drop.onDragOver}
      onDrop={drop.onDrop}
    >
      <div
        className="folder-title"
        onClick={() => {
          dispatch({ type: "SET_SELECTED", payload: { id: item.id } });
          dispatch({ type: "TOGGLE_FOLDER_OPEN", payload: { id: item.id } });
        }}
        onContextMenu={(e) => onContextMenu(e, item)}
      >
        <span>{item.name}</span>
        <button className="folder-chevron" onClick={(e) => e.stopPropagation()}>
          <ChevronDownIcon width={14} height={14} />
        </button>
      </div>
      {isOpen && (
        <div
          className="folder-children"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!hereActive) {
              setPlaceholderInside(item.id);
            }
          }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); commitDrop(); }}
        >
          {children.map((child) => (
            <Fragment key={child.id}>
              {hereActive && placeholder.beforeId === child.id && <DragPlaceholder />}
              {child.type === "separator" && <Separator item={child} />}
              {child.type === "folder" && (
                <FolderCard item={child} onContextMenu={onContextMenu} onEditRequest={onEditRequest} />
              )}
              {child.type === "optionRef" && (
                <OptionCard item={child} onContextMenu={onContextMenu} onEditRequest={onEditRequest} />
              )}
            </Fragment>
          ))}
          {hereActive && placeholder.beforeId === null && <DragPlaceholder />}
        </div>
      )}
    
    </div>
  );
}