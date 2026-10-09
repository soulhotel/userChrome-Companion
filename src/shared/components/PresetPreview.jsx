function PresetPreviewEntry({ entry }) {
  if (entry.separator) return <div className="preset-preview-separator" />;

  if (entry.folder) {
    return (
      <div className="preset-preview-item preset-preview-folder">
        <div className="preset-preview-folder-header">{entry.folder}</div>
        <div className="preset-preview-folder-body">
          {(entry.options || []).map((child, i) => (
            <PresetPreviewEntry entry={child} key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="preset-preview-item preset-preview-row">
      <span>{entry.description || entry.pref}</span>
      <span className="preset-preview-state">{entry.on ? "on" : "off"}</span>
    </div>
  );
}

export default function PresetPreview({ json }) {
  if (!json || !Array.isArray(json.options)) return null;

  return (
    <div className="preset-preview">
      {json.options.map((entry, i) => (
        <PresetPreviewEntry entry={entry} key={i} />
      ))}
    </div>
  );
}