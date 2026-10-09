import { useAppState } from "../../config/state";
import { useDragDrop, DragPlaceholder } from "../utils/dragDrop";
import OptionCard from "./OptionCard";
import FolderCard from "./FolderCard";
import Separator from "./Separator";
import { Fragment } from "react";

export default function OptionsList({ onContextMenu, onEditRequest }) {
  const state = useAppState();
  const { placeholder, commitDrop } = useDragDrop();

  const items = state.rootOrder.map((id) => state.itemsById[id]).filter(Boolean);
  const hereActive = placeholder && placeholder.parentId === null;

  return (
    <div
      className="option-list option-tree"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); commitDrop(); }}
    >
      {items.map((item) => (
        <Fragment key={item.id}>
          {hereActive && placeholder.beforeId === item.id && <DragPlaceholder />}
          {item.type === "separator" && <Separator item={item} />}
          {item.type === "folder" && <FolderCard item={item} onContextMenu={onContextMenu} onEditRequest={onEditRequest} />}
          {item.type === "optionRef" && <OptionCard item={item} onContextMenu={onContextMenu} onEditRequest={onEditRequest} />}
        </Fragment>
      ))}
      {hereActive && placeholder.beforeId === null && <DragPlaceholder />}
    </div>
  );
}