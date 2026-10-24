import { createContext, useContext, useState, useCallback } from "react";
import { useAppState, useAppDispatch } from "../../config/state";
import { useSearch } from "./search";

const DragContext = createContext(null);

function findParentId(state, id) {
  if (state.rootOrder.includes(id)) return null;
  for (const item of Object.values(state.itemsById)) {
    if (item.type === "folder" && item.children.includes(id)) return item.id;
  }
  return null;
}

function isDescendant(state, ancestorId, candidateId) {
  const ancestor = state.itemsById[ancestorId];
  if (!ancestor || ancestor.type !== "folder") return false;
  for (const childId of ancestor.children) {
    if (childId === candidateId) return true;
    if (isDescendant(state, childId, candidateId)) return true;
  }
  return false;
}

function computeToIndex(state, draggedId, parentId, beforeId) {
  const siblings = (parentId === null ? state.rootOrder : state.itemsById[parentId].children)
    .filter((id) => id !== draggedId);
  if (beforeId === null) return siblings.length;
  const idx = siblings.indexOf(beforeId);
  return idx === -1 ? siblings.length : idx;
}

export function DragProvider({ children }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [draggedId, setDraggedId] = useState(null);
  const [placeholder, setPlaceholder] = useState(null); // { parentId, beforeId } — beforeId null = end of list

  const startDrag = useCallback((id) => {
    setDraggedId(id);
    const parentId = findParentId(state, id);
    const siblings = parentId === null ? state.rootOrder : state.itemsById[parentId].children;
    const idx = siblings.indexOf(id);
    const nextId = siblings[idx + 1] ?? null;
    setPlaceholder({ parentId, beforeId: nextId });
  }, [state]);

  const clearDrag = useCallback(() => {
    setDraggedId(null);
    setPlaceholder(null);
  }, []);

  const setPlaceholderNear = useCallback((targetId, position) => {
    if (!draggedId || targetId === draggedId) return;
    if (isDescendant(state, draggedId, targetId)) return;

    const parentId = findParentId(state, targetId);
    const siblings = parentId === null ? state.rootOrder : state.itemsById[parentId].children;
    const idx = siblings.indexOf(targetId);

    if (position === "before") {
      setPlaceholder({ parentId, beforeId: targetId });
    } else {
      const nextId = siblings[idx + 1] ?? null;
      setPlaceholder({ parentId, beforeId: nextId });
    }
  }, [draggedId, state]);

  const setPlaceholderInside = useCallback((folderId) => {
    if (!draggedId || folderId === draggedId) return;
    if (isDescendant(state, draggedId, folderId)) return;
    const folder = state.itemsById[folderId];
    if (!folder || folder.type !== "folder") return;
    setPlaceholder({ parentId: folderId, beforeId: null });
  }, [draggedId, state]);

  const commitDrop = useCallback(() => {
    if (!draggedId || !placeholder) { clearDrag(); return; }
    const toIndex = computeToIndex(state, draggedId, placeholder.parentId, placeholder.beforeId);
    dispatch({
      type: "MOVE_ITEM",
      payload: { id: draggedId, toParentId: placeholder.parentId, toIndex },
    });
    clearDrag();
  }, [draggedId, placeholder, state, dispatch, clearDrag]);

  return (
    <DragContext.Provider
      value={{ draggedId, placeholder, startDrag, setPlaceholderNear, setPlaceholderInside, commitDrop, clearDrag }}
    >
      {children}
    </DragContext.Provider>
  );
}

export const useDragDrop = () => useContext(DragContext);

export function useDraggable(id) {
  const { draggedId, startDrag, clearDrag } = useDragDrop();
  const { isSearching } = useSearch();
  if (isSearching) {
    return { draggable: false, isDragging: false, onDragStart: undefined, onDragEnd: undefined };
  }
  return {
    draggable: true,
    isDragging: draggedId === id,
    onDragStart: (e) => {
      e.stopPropagation();
      e.dataTransfer.setDragImage(e.currentTarget, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      requestAnimationFrame(() => startDrag(id));
    },
    onDragEnd: clearDrag,
  };
}

export function useDropZone(id, mode = "split") {
  const { setPlaceholderNear, setPlaceholderInside, commitDrop } = useDragDrop();
  const { isSearching } = useSearch();
  if (isSearching) return { onDragOver: undefined, onDrop: undefined };
  
  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = (e.clientY - rect.top) / rect.height;
    if (mode === "split") {
      setPlaceholderNear(id, offset < 0.5 ? "before" : "after");
    } else {
      if (offset < 0.25) setPlaceholderNear(id, "before");
      else if (offset > 0.75) setPlaceholderNear(id, "after");
      else setPlaceholderInside(id);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    commitDrop();
  }

  return { onDragOver, onDrop };
}

export function DragPlaceholder() {
  return <div className="drag-placeholder" />;
}