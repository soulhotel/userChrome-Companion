import { getConflictTargets, applyAutoOff } from "../shared/utils/conflictResolver";
import { collectDescendantIds, isDescendantOf } from "../shared/utils/queryList";

const genId = () => crypto.randomUUID();
const HISTORY_LIMIT = 50;

const STRUCTURAL_ACTIONS = new Set([
  "ADD_OPTION", "ADD_FOLDER", "ADD_SEPARATOR",
  "EDIT_OPTION", "EDIT_FOLDER", "DELETE_ITEM", "MOVE_ITEM",
  "TOGGLE_OPTION", "TOGGLE_ALL", "RENAME_OPTION_PREF", "APPLY_PRESET", "MERGE_PRESET",
]);

function snapshot(state) {
  return { optionsByPref: state.optionsByPref, itemsById: state.itemsById, rootOrder: state.rootOrder };
}

function findContainer(state, id) {
  if (state.rootOrder.includes(id)) return { parentId: null, index: state.rootOrder.indexOf(id) };
  for (const item of Object.values(state.itemsById)) {
    if (item.type === "folder" && item.children.includes(id)) {
      return { parentId: item.id, index: item.children.indexOf(id) };
    }
  }
  return null;
}

function insertAfter(state, newId, afterId) {
  let { itemsById, rootOrder } = state;
  if (!afterId) return { itemsById, rootOrder: [...rootOrder, newId] };

  const afterItem = itemsById[afterId];
  if (afterItem?.type === "folder") {
    return {
      itemsById: { ...itemsById, [afterId]: { ...afterItem, children: [...afterItem.children, newId] } },
      rootOrder,
    };
  }

  const loc = findContainer(state, afterId);
  if (!loc) return { itemsById, rootOrder: [...rootOrder, newId] };

  if (loc.parentId === null) {
    const next = [...rootOrder];
    next.splice(loc.index + 1, 0, newId);
    return { itemsById, rootOrder: next };
  }
  const parent = itemsById[loc.parentId];
  const nextChildren = [...parent.children];
  nextChildren.splice(loc.index + 1, 0, newId);
  return { itemsById: { ...itemsById, [loc.parentId]: { ...parent, children: nextChildren } }, rootOrder };
}

function insertAsSibling(state, newId, afterId) {
  let { itemsById, rootOrder } = state;
  if (!afterId) return { itemsById, rootOrder: [...rootOrder, newId] };

  const loc = findContainer(state, afterId);
  if (!loc) return { itemsById, rootOrder: [...rootOrder, newId] };

  if (loc.parentId === null) {
    const next = [...rootOrder];
    next.splice(loc.index + 1, 0, newId);
    return { itemsById, rootOrder: next };
  }
  const parent = itemsById[loc.parentId];
  const nextChildren = [...parent.children];
  nextChildren.splice(loc.index + 1, 0, newId);
  return { itemsById: { ...itemsById, [loc.parentId]: { ...parent, children: nextChildren } }, rootOrder };
}

function removeFromContainer(state, id) {
  const loc = findContainer(state, id);
  if (!loc) return { itemsById: state.itemsById, rootOrder: state.rootOrder };
  if (loc.parentId === null) {
    return { itemsById: state.itemsById, rootOrder: state.rootOrder.filter((x) => x !== id) };
  }
  const parent = state.itemsById[loc.parentId];
  return {
    itemsById: { ...state.itemsById, [loc.parentId]: { ...parent, children: parent.children.filter((x) => x !== id) } },
    rootOrder: state.rootOrder,
  };
}

function applyAction(state, action) {
  switch (action.type) {
    case "ADD_OPTION": {
      const { pref, description = "", conflicts = [], on = false, afterId = state.selectedId } = action.payload;
      const id = genId();
      const { itemsById, rootOrder } = insertAfter(state, id, afterId);
      const optionsByPref = state.optionsByPref[pref]
        ? state.optionsByPref
        : { ...state.optionsByPref, [pref]: { description, conflicts, on } };
      return { ...state, optionsByPref, itemsById: { ...itemsById, [id]: { id, type: "optionRef", pref } }, rootOrder, selectedId: id };
    }

    case "ADD_FOLDER": {
      const { name, afterId = state.selectedId } = action.payload;
      const id = genId();
      const { itemsById, rootOrder } = insertAfter(state, id, afterId);
      return {
        ...state,
        itemsById: { ...itemsById, [id]: { id, type: "folder", name, children: [] } },
        rootOrder,
        selectedId: id,
        expandedFolders: [...state.expandedFolders, id],
      };
    }

    case "ADD_SEPARATOR": {
      const id = genId();
      const { itemsById, rootOrder } = insertAsSibling(state, id, action.payload.afterId ?? state.selectedId);
      return { ...state, itemsById: { ...itemsById, [id]: { id, type: "separator" } }, rootOrder };
    }

    case "EDIT_OPTION": {
      const { pref, patch } = action.payload;
      if (!state.optionsByPref[pref]) return state;
      return { ...state, optionsByPref: { ...state.optionsByPref, [pref]: { ...state.optionsByPref[pref], ...patch } } };
    }

    case "EDIT_FOLDER": {
      const { id, name } = action.payload;
      if (!state.itemsById[id]) return state;
      return { ...state, itemsById: { ...state.itemsById, [id]: { ...state.itemsById[id], name } } };
    }

    case "RENAME_OPTION_PREF": {
      const { oldPref, newPref } = action.payload;
      if (oldPref === newPref) return state;
      if (!state.optionsByPref[oldPref]) return state;

      const merging = !!state.optionsByPref[newPref];
      const optionsByPref = { ...state.optionsByPref };
      if (!merging) {
        optionsByPref[newPref] = optionsByPref[oldPref];
      }
      delete optionsByPref[oldPref];

      for (const key of Object.keys(optionsByPref)) {
        if (optionsByPref[key].conflicts?.includes(oldPref)) {
          const updated = optionsByPref[key].conflicts.map((c) => (c === oldPref ? newPref : c));
          optionsByPref[key] = { ...optionsByPref[key], conflicts: [...new Set(updated)] };
        }
      }

      const itemsById = { ...state.itemsById };
      for (const id of Object.keys(itemsById)) {
        if (itemsById[id].type === "optionRef" && itemsById[id].pref === oldPref) {
          itemsById[id] = { ...itemsById[id], pref: newPref };
        }
      }

      return { ...state, optionsByPref, itemsById };
    }

    case "DELETE_ITEM": {
      const { id } = action.payload;
      const item = state.itemsById[id];
      if (!item) return state;
      const { itemsById, rootOrder } = removeFromContainer(state, id);
      const idsToDelete = item.type === "folder" ? [id, ...collectDescendantIds(state, id)] : [id];
      const nextItemsById = { ...itemsById };
      idsToDelete.forEach((did) => delete nextItemsById[did]);

      const remainingPrefs = new Set(
        Object.values(nextItemsById).filter((i) => i.type === "optionRef").map((i) => i.pref)
      );
      const orphanedPrefs = idsToDelete
        .map((did) => item.type === "folder" ? state.itemsById[did] : item)
        .filter((i) => i?.type === "optionRef")
        .map((i) => i.pref)
        .filter((p) => !remainingPrefs.has(p));

      let optionsByPref = state.optionsByPref;
      if (orphanedPrefs.length) {
        optionsByPref = { ...state.optionsByPref };
        orphanedPrefs.forEach((p) => delete optionsByPref[p]);
      }

      return {
        ...state,
        optionsByPref,
        itemsById: nextItemsById,
        rootOrder,
        selectedId: idsToDelete.includes(state.selectedId) ? null : state.selectedId,
        expandedFolders: state.expandedFolders.filter((eid) => !idsToDelete.includes(eid)),
      };
    }

    case "MOVE_ITEM": {
      const { id, toParentId, toIndex } = action.payload;
      if (id === toParentId) return state;
      if (toParentId && isDescendantOf(state, id, toParentId)) return state;

      const { itemsById, rootOrder } = removeFromContainer(state, id);
      if (toParentId === null) {
        const next = [...rootOrder];
        next.splice(toIndex, 0, id);
        return { ...state, itemsById, rootOrder: next };
      }
      const parent = itemsById[toParentId];
      const nextChildren = [...parent.children];
      nextChildren.splice(toIndex, 0, id);
      return { ...state, itemsById: { ...itemsById, [toParentId]: { ...parent, children: nextChildren } }, rootOrder };
    }

    case "TOGGLE_OPTION": {
      const { pref } = action.payload;
      const existing = state.optionsByPref[pref];
      if (!existing) return state;
      const turningOn = !existing.on;
      let optionsByPref = { ...state.optionsByPref, [pref]: { ...existing, on: turningOn } };
      if (turningOn) {
        const { tracked } = getConflictTargets({ ...state, optionsByPref }, pref);
        optionsByPref = applyAutoOff(optionsByPref, tracked);
      }
      return { ...state, optionsByPref };
    }

    case "TOGGLE_ALL":
      return { ...state, toggleAllOff: !state.toggleAllOff };

    case "SET_SELECTED":
      return { ...state, selectedId: action.payload.id };

    case "TOGGLE_FOLDER_OPEN": {
      const { id } = action.payload;
      const isOpen = state.expandedFolders.includes(id);
      return { ...state, expandedFolders: isOpen ? state.expandedFolders.filter((eid) => eid !== id) : [...state.expandedFolders, id] };
    }

    case "HYDRATE": {
      const { optionsByPref, itemsById, rootOrder, expandedFolders } = action.payload;
      return { ...state, optionsByPref, itemsById, rootOrder, expandedFolders: expandedFolders || [], selectedId: null };
    }

    case "APPLY_PRESET": {
      const { optionsByPref, itemsById, rootOrder } = action.payload;
      return { ...state, optionsByPref, itemsById, rootOrder, selectedId: null, expandedFolders: [] };
    }

    case "MERGE_PRESET": {
      const { optionsByPref, itemsById, rootOrder } = action.payload;
      return { ...state, optionsByPref, itemsById, rootOrder, selectedId: null };
    }

    case "EXTERNAL_PREF_CHANGE": {
      const { pref, value } = action.payload;
      const existing = state.optionsByPref[pref];
      if (!existing || existing.on === value || state.toggleAllOff) return state;
      return { ...state, optionsByPref: { ...state.optionsByPref, [pref]: { ...existing, on: value } } };
    }

    case "RECONCILE_PREF_STATES": {
      if (state.toggleAllOff) return state;
      const { values } = action.payload;
      let optionsByPref = state.optionsByPref;
      for (const [pref, value] of Object.entries(values)) {
        if (value === null) continue;
        const existing = optionsByPref[pref];
        if (existing && existing.on !== value) {
          if (optionsByPref === state.optionsByPref) optionsByPref = { ...optionsByPref };
          optionsByPref[pref] = { ...existing, on: value };
        }
      }
      return optionsByPref === state.optionsByPref ? state : { ...state, optionsByPref };
    }

    case "SYNC_TREE": {
      const { optionsByPref, itemsById, rootOrder } = action.payload;
      const selectedId = state.selectedId && itemsById[state.selectedId] ? state.selectedId : null;
      const expandedFolders = state.expandedFolders.filter((id) => itemsById[id]?.type === "folder");
      return { ...state, optionsByPref, itemsById, rootOrder, selectedId, expandedFolders };
    }

    default:
      return state;
  }
}

export function reducer(state, action) {
  if (action.type === "UNDO") {
    if (!state.history.length) return state;
    const prev = state.history[state.history.length - 1];
    return { ...state, ...prev, history: state.history.slice(0, -1), future: [snapshot(state), ...state.future].slice(0, HISTORY_LIMIT) };
  }
  if (action.type === "REDO") {
    if (!state.future.length) return state;
    const next = state.future[0];
    return { ...state, ...next, history: [...state.history, snapshot(state)].slice(-HISTORY_LIMIT), future: state.future.slice(1) };
  }

  const nextState = applyAction(state, action);
  if (STRUCTURAL_ACTIONS.has(action.type) && nextState !== state) {
    return { ...nextState, history: [...state.history, snapshot(state)].slice(-HISTORY_LIMIT), future: [] };
  }
  return nextState;
}