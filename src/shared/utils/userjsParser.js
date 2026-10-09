export function parseUserJs(text, presetName = "Imported user.js") {
  const lines = text.split(/\r?\n/);
  const options = [];
  const seen = new Set();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) continue;

    const match = line.match(/^user_pref\(\s*"([^"]+)"\s*,\s*(true|false)\s*\)\s*;?/);
    if (!match) continue;

    const [, name, boolStr] = match;
    if (seen.has(name)) continue;
    seen.add(name);

    options.push({ pref: name, description: name, conflicts: [], on: boolStr === "true" });
  }

  return { preset: presetName, options };
}