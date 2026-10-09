// i dont release on github unless the add on store is caught up. So latest & available should always be accurate.

const RELEASES_URL = "https://api.github.com/repos/soulhotel/userChrome-Companion/releases/latest";

export function getExtensionVersion() { return browser.runtime.getManifest().version; }

export async function fetchLatestExtensionVersion() {
  try {
    const res = await fetch(RELEASES_URL);
    if (!res.ok) return null;
    const data = await res.json();
    return (data.tag_name || "").replace(/^v/, "") || null;
  } catch {
    return null;
  }
}