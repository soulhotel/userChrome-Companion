import { useState } from "react";
import { useConfig } from "../../config/state";
import { useAppDispatch } from "../../config/state";
import { parsePreset } from "../utils/presetSchema";
import { resolvePresetUrl, generateCustomLabel, registerSavedPreset, parseImportedSource } from "../utils/presetSourcing";
import { PresetCard } from "../components/PresetCard";
import PresetPreview from "../components/PresetPreview";
import { LinkIcon, FileIcon, ClipboardIcon } from "../assets/Svg";

export default function OnboardingModal() {
  const [config, patchConfig] = useConfig();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [importedJson, setImportedJson] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [appliedName, setAppliedName] = useState(null);
  const [error, setError] = useState("");

  function finish() {
    patchConfig({ hasOnboarded: true });
  }

  async function applyPreset(fetchUrl, identityLink, presetName) {
    setError("");
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Fetch failed");
      const text = await res.text();
      const json = parseImportedSource(text);
      const parsed = parsePreset(json);
      dispatch({ type: "APPLY_PRESET", payload: parsed });

      const effectiveLink = parsed.link || identityLink;
      const name = presetName || parsed.name;
      registerSavedPreset(config, patchConfig, { link: effectiveLink, name, snapshot: json });
      patchConfig({ selectedPreset: effectiveLink });

      setAppliedName(parsed.name);
      setStep(3);
    } catch {
      setError("Couldn't load that preset. Check the link and try again.");
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = parseImportedSource(ev.target.result);
        setImportedJson(json);
        setError("");
        setStep(3);
      } catch {
        setError("Couldn't parse that file as json or user.js.");
      }
    };
    reader.readAsText(file);
  }

  async function handlePasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const json = parseImportedSource(text);
      setImportedJson(json);
      setError("");
      setStep(3);
    } catch {
      setError("Couldn't read clipboard, or couldn't parse it as json or user.js.");
    }
  }

  function confirmImportedJson() {
    if (!importedJson) return;
    setError("");
    try {
      const parsed = parsePreset(importedJson);
      dispatch({ type: "APPLY_PRESET", payload: parsed });

      const effectiveLink = parsed.link || generateCustomLabel(config.savedPresets);
      registerSavedPreset(config, patchConfig, { link: effectiveLink, name: parsed.name, snapshot: importedJson });
      patchConfig({ selectedPreset: effectiveLink });

      finish();
    } catch {
      setError("Something went wrong applying this preset.");
    }
  }

  return (
    <div className="modal-overlay onboarding-overlay">
      <div className="modal onboarding-modal">
        {step === 1 && (
          <>
            <div className="modal-container">
              <div className="modal-header">Welcome to userChrome Companion</div>
              <div className="modal-section">             
                <p>No need to visit the <code>about:config</code> page, or worry about <code>user.js</code> files.. userChrome Companion bridges the gap between userChrome & mozilla preferences.</p>
                <ul>
                  <li>• Manage/Organize userChrome themes</li>
                  <li>• Toggle & Create userChrome settings</li>
                  <li>• Toggle & Create userChrome(js) scripts</li>
                  <li>• Turn regular mozilla preferences on or off</li>
                </ul>
                <img
                  src={browser.runtime.getURL("shared/assets/demo.gif")}
                  alt="Toggling a userChrome option on and off"
                  className="onboarding-demo"
                />
              </div> 
              <div className="modal-footer">
                <button className="onboarding-next" onClick={() => setStep(2)}>Next</button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-container">
              <p className="modal-header">Want to Sync a userChrome Theme?</p>
              <p>
                Linking a preset is <em>recommended</em>. 
                Linked presets can be monitored for changes &amp; synced when updates occur. 
                Syncing does not overwrite your modified options. 
                Only themes that utilize moz-pref (ucc.json/user.js) are compatible.
              </p>
              <p className="note">
                Note: Only theme developers need to worry about ucc.json/user.js.
              </p>
              <div className="modal-section">
                <p className="muted bold">Import a Preset:</p>
                <flex-row class="onboarding-import-buttons">
                  <button className="icon-btn" onClick={() => setShowLinkInput((v) => !v)}>
                    <LinkIcon />
                    <span>Link</span>
                  </button>
                  <button className="icon-btn" onClick={() => document.getElementById("ucc-onboard-file")?.click()}>
                    <FileIcon />
                    <span>File</span>
                  </button>
                  <input id="ucc-onboard-file" type="file" accept="application/json" onChange={handleFile} hidden />
                  <button className="icon-btn" onClick={handlePasteClipboard}>
                    <ClipboardIcon />
                    <span>Clipboard</span>
                  </button>
                </flex-row>

                {showLinkInput && (
                  <flex-row class="onboarding-link-input">
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://github.com/.../ucc.json"
                    />
                    <button onClick={() => applyPreset(linkUrl, linkUrl, null)}>Enter</button>
                  </flex-row>
                )}

                <p className="muted bold">Or Select a Preset:</p>
                <flex-column class="onboarding-preset-list">
                  {config.savedPresets.map((preset) => (
                    <PresetCard
                      key={preset.link}
                      name={preset.name}
                      link={preset.link}
                      onSelect={() => applyPreset(resolvePresetUrl(preset.link), preset.link, preset.name)}
                    />
                  ))}
                </flex-column>
              </div>
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-footer">
                <button className="onboarding-next" onClick={finish}>Skip for now</button>
              </div>              
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="modal-container">
              {appliedName ? (
                <>
                  <div className="modal-header">Imported: {appliedName}</div>
                  <div className="modal-section">
                    <p>Your options list is all set up.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-header">Review Imported Preset</div>
                  <div className="modal-section">
                    <PresetPreview json={importedJson} />
                  </div>
                  {error && <div className="modal-error">{error}</div>}
                </>
              )}
              <div className="modal-footer">
                <button className="onboarding-next" onClick={appliedName ? finish : confirmImportedJson}>Done</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}