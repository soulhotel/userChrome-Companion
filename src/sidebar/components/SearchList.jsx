import { useMemo } from "react";
import { useAppState } from "../../config/state";
import { useSearch } from "../utils/search";
import { searchOptions } from "../../shared/utils/queryList";
import OptionCard from "./OptionCard";

export default function SearchList({ onContextMenu, onEditRequest }) {
  const state = useAppState();
  const { terms } = useSearch();
  const results = useMemo(
    () => searchOptions(state, terms),
    [state.optionsByPref, state.itemsById, state.rootOrder, terms]
  );

  return (
    <div className="option-list search-list">
      {results.length === 0 && <div className="search-empty">No matching options</div>}
      {results.map(({ item, folders }) => (
        <OptionCard
          key={item.id}
          item={item}
          folders={folders}
          onContextMenu={onContextMenu}
          onEditRequest={onEditRequest}
        />
      ))}
    </div>
  );
}