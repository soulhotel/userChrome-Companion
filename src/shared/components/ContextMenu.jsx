import { useRef, useState, useLayoutEffect } from "react";
import { useAppDispatch } from "../../config/state";

const MARGIN = 8;

export default function ContextMenu({ x, y, item, onEditRequest, onClose }) {
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = x;
    let top = y;
    if (left + width > viewportW - MARGIN) left = viewportW - width - MARGIN;
    if (top + height > viewportH - MARGIN) top = viewportH - height - MARGIN;
    left = Math.max(MARGIN, left);
    top = Math.max(MARGIN, top);

    setPos({ left, top });
  }, [x, y]);

  function addSeparator() {
    dispatch({ type: "ADD_SEPARATOR", payload: { afterId: item.id } });
    onClose();
  }
  function deleteItem() {
    dispatch({ type: "DELETE_ITEM", payload: { id: item.id } });
    onClose();
  }
  function edit() {
    onEditRequest(item);
    onClose();
  }

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={pos ? { left: pos.left, top: pos.top, visibility: "visible" } : { left: x, top: y, visibility: "hidden" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-item" onClick={edit}>
        {item.type === "folder" ? "Edit Folder" : "Edit Option"}
      </div>
      <div className="context-menu-item" onClick={addSeparator}>Add Separator After</div>
      <div className="context-menu-item" onClick={deleteItem}>
        {item.type === "folder" ? "Delete Folder" : "Delete Option"}
      </div>
    </div>
  );
}