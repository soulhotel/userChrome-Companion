import { useEffect, useRef } from "react";
import { useSearch } from "../utils/search";
import { XIcon, ChevronDownIcon } from "../../shared/assets/Svg";

export default function SearchBar() {
  const { isOpen, query, setQuery, closeSearch } = useSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  function clearQuery() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="search-container toolbar-container">
      <div className="searchbar">
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label="Search options"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search options"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="searchbar-btn-group">
            {query && (
            <button type="button" className="toolbar-btn clear-search-btn" title="Clear search" aria-label="Clear search" onClick={clearQuery}>
                <XIcon />
            </button>
            )}
            <button type="button" className="toolbar-btn close-search-btn" title="Close searchbar" aria-label="Close search" onClick={closeSearch}>
                <ChevronDownIcon />
            </button>
        </div>
      </div>
    </div>
  );
}