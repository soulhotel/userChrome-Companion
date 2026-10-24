import { Fragment } from "react";

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function Highlight({ text, terms }) {
  if (!text || !terms?.length) return text ?? null;
  const pattern = new RegExp(
    `(${[...terms].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
    "gi"
  );
  // [text, match, text, match, ...]
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>
  );
}

// why here? settings page revamp probbly hasn't been done yet, search page can utilize highlight when searching is implemented
// yeah, this will definitely be reused, but not today