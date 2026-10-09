import { XIcon, PlusIcon } from "../assets/Svg";

export function PresetCard({ name, link, selected, onSelect, onDelete }) {
  function handleLinkClick(e) {
    e.stopPropagation();
    window.open(link, "_blank");
  }

  return (
    <div className="preset-card" data-selected={selected} onClick={onSelect}>
      {onDelete && (
        <button className="preset-card-delete" onClick={onDelete} aria-label="Delete preset">
          <XIcon />
        </button>
      )}
      <div className="preset-card-name">{name}</div>
      <span className="preset-card-link" onClick={handleLinkClick}>{link}</span>
    </div>
  );
}

export function CreatePresetCard({ onClick }) {
  return (
    <div className="preset-card preset-card-create" onClick={onClick}>
      <PlusIcon />
    </div>
  );
}