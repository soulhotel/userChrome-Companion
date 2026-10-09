import { useDraggable, useDropZone } from "../utils/dragDrop";

export default function Separator({ item }) {
  const drag = useDraggable(item.id);
  const drop = useDropZone(item.id, "split");

  return (
    <div
      className={`separator${drag.isDragging ? " dragging" : ""}`}
      draggable={drag.draggable}
      onDragStart={drag.onDragStart}
      onDragEnd={drag.onDragEnd}
      onDragOver={drop.onDragOver}
      onDrop={drop.onDrop}
    />
  );
}