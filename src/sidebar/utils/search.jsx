import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { tokenizeQuery } from "../../shared/utils/queryList";

const NOT_SEARCHING = {
  isOpen: false,
  isSearching: false,
  query: "",
  terms: [],
  setQuery: () => {},
  openSearch: () => {},
  closeSearch: () => {},
  toggleSearch: () => {},
};

const SearchContext = createContext(NOT_SEARCHING);

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const terms = useMemo(() => tokenizeQuery(query), [query]);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);
  const toggleSearch = useCallback(() => {
    if (isOpen) closeSearch();
    else openSearch();
  }, [isOpen, openSearch, closeSearch]);

  const value = useMemo(
    () => ({
      isOpen,
      isSearching: isOpen && terms.length > 0,
      query,
      terms,
      setQuery,
      openSearch,
      closeSearch,
      toggleSearch,
    }),
    [isOpen, query, terms, openSearch, closeSearch, toggleSearch]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export const useSearch = () => useContext(SearchContext);