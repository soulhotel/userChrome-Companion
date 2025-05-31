document.addEventListener('DOMContentLoaded', () => {
    const ucSettings = document.querySelector('.uc-settings');
    const ucOptions = document.querySelector('.uc-options');
    const settingsBtn = document.querySelector('.uc-opt-settings');
    const exitBtn = document.querySelector('.uc-settings-exit');
    const presetsBtn = document.querySelector('.uc-settings-presets');
    const presetsContainer = document.querySelector('.uc-settings-presets-container');
    const addToOptionsBtn = document.querySelector('.uc-settings-pco-add2opt');
    const presetInput = document.querySelector('.uc-settings-presets-container-input');
    const overwriteOptionsBtn = document.querySelector('.uc-settings-pco-overallopt');
    const importFileBtn = document.querySelector('.uc-settings-pco-impfile');
    const importFileInput = document.querySelector('.uc-settings-pco-impfile-input');
    const importUrlBtn = document.querySelector('.uc-settings-pco-impat');

    const deleteAllBtn = document.querySelector('.uc-settings-deleteall');

    if (!ucSettings || !ucOptions || !settingsBtn || !exitBtn || !presetsBtn || !presetsContainer || !addToOptionsBtn || !presetInput) return;

    /* settings call -------------------------------------------------- */
    function openSettings() {
        ucSettings.style.display = "flex";
        ucOptions.style.opacity = "0.2";
        ucOptions.style.pointerEvents = "none";
    }

    function closeSettings() {
        ucSettings.style.display = "none";
        ucOptions.style.opacity = "1";
        ucOptions.style.pointerEvents = "auto";
        presetsContainer.classList.add('trap-card');
    }

    /* organize options/folders --------------------------------------- */
    function getNextOptNumber() {
        const used = [...document.querySelectorAll('.uc-opt')]
            .map(el => el.className.match(/uc-opt-(\d+)/))
            .filter(Boolean)
            .map(match => parseInt(match[1]));
        return used.length ? Math.max(...used) + 1 : 1;
    }
    function getNextFolderNumber() {
        const used = [...document.querySelectorAll('.uc-folder')]
            .map(el => el.className.match(/uc-folder-(\d+)/))
            .filter(Boolean)
            .map(match => parseInt(match[1]));
        return used.length ? Math.max(...used) + 1 : 1;
    }
    function clearPresetTextarea() {
        presetInput.value = '';
    }

    /* options/folders buttons via preset ----------------------------- */
    function addOption(val) {
        const optNum = getNextOptNumber();
        const newOpt = document.createElement('div');
        newOpt.className = `uc-opt uc-opt-${optNum}`;
        newOpt.draggable = true;
        newOpt.textContent = val;
        ucOptions.insertBefore(newOpt, settingsBtn);
    }
    function addFolder(name) {
        const folderNum = getNextFolderNumber();
        const folderWrap = document.createElement('div');
        folderWrap.className = `uc-opt uc-folder uc-folder-${folderNum}`;
        const title = document.createElement('div');
        title.className = `uc-opt uc-folder-title uc-folder-${folderNum}`;
        title.draggable = true;
        title.textContent = name;
        folderWrap.appendChild(title);
        ucOptions.insertBefore(folderWrap, settingsBtn);
        return folderWrap;
    }
    function addOptionToFolder(val, folderWrap) {
        const optNum = getNextOptNumber();
        const newOpt = document.createElement('div');
        newOpt.className = `uc-opt uc-opt-${optNum}`;
        newOpt.draggable = true;
        newOpt.textContent = val;
        folderWrap.appendChild(newOpt);
    }
    function clearAllOptions() {
        const opts = [...ucOptions.querySelectorAll('.uc-opt')];
        opts.forEach(opt => {
            if (!opt.classList.contains('uc-opt-toggle') && !opt.classList.contains('uc-opt-settings')) {
                opt.remove();
            }
        });
    }

    /* parsing textarea ----------------------------------------------- */
    function parsePresetText(text) {
        const lines = text.split('\n').map(line => line.trimEnd());
        let currentFolder = null;

        for (const line of lines) {
            if (line.startsWith('Folder:')) {
                const folderName = line.slice(7).trim();
                currentFolder = addFolder(folderName);
            } else if (/^\s+/.test(line) && currentFolder) {
                const option = line.trim();
                if (option) addOptionToFolder(option, currentFolder);
            } else if (line.trim()) {
                addOption(line.trim());
                currentFolder = null;
            }
        }
        window.bindDragEvents();
        window.normalizeOptionClasses();
        window.normalizeFolderClasses();
        window.saveOptionsOrder();
    }

    /* parsing urls --------------------------------------------------- */
    function fetchPresetFromUrl(url) {
        const rawUrl = convertToRawUrl(url);
        fetch(rawUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(text => {
                presetInput.value = text;
            })
            .catch(err => {
                console.warn("Failed to fetch preset:", err);
                window.ucNotify("Failed to fetch preset. Please check the URL.", "OK");
            });
    }
    function convertToRawUrl(url) {
        try {
            const u = new URL(url);
            if (u.hostname === 'github.com') {
                const parts = u.pathname.split('/');
                if (parts[3] === 'blob') {
                    return `https://raw.githubusercontent.com/${parts[1]}/${parts[2]}/${parts[4]}/${parts.slice(5).join('/')}`;
                }
            }
            if (u.hostname === 'codeberg.org') {
                const parts = u.pathname.split('/');
                if (parts[3] === 'src') {
                    return `https://codeberg.org/${parts[1]}/${parts[2]}/raw/${parts[4]}/${parts.slice(5).join('/')}`;
                }
            }
            return url;
        } catch (e) {
            console.warn("Invalid URL passed to convertToRawUrl:", url);
            return url;
        }
    }

    /* settings buttons ----------------------------------------------- */
    settingsBtn.addEventListener("click", openSettings);
    exitBtn.addEventListener("click", closeSettings);

    presetsBtn.addEventListener("click", () => {
        presetsContainer.classList.toggle('trap-card');
    });

    addToOptionsBtn.addEventListener("click", () => {
        const text = presetInput.value.trim();
        if (text) {
            parsePresetText(text);
            clearPresetTextarea();
        }
    });

    overwriteOptionsBtn.addEventListener("click", () => {
        const text = presetInput.value.trim();
        if (text) {
            clearAllOptions();
            parsePresetText(text);
            clearPresetTextarea();
        }
    });

    importFileBtn.addEventListener("click", () => {
        window.ucNotify(
            "Import a text file of options",
            "Okay", () => importFileInput.click(),
        );
    });

    importFileInput.addEventListener("change", () => {
        const file = importFileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            presetInput.value = e.target.result;
        };
        reader.onerror = () => {
            console.warn("File couldn't be read as text.");
        };

        reader.readAsText(file);
    });

    importUrlBtn.addEventListener("click", () => {
        window.ucNotify(
            "Paste a URL to import a preset from",
            "Import", (url) => {
              if (!url) return;
                  fetchPresetFromUrl(url.trim());
              },
            "Cancel", () => {},
            "needinput"
        );
    });







    deleteAllBtn.addEventListener("click", () => {
        window.ucNotify(
            `You want to delete all options!? Remember..\n"With great power, comes great ___"`,
            "Yes, Uncle Ben", (val) => {
                const trimmed = val.trim().toLowerCase();
                if (trimmed === "responsibility" || trimmed === "responsibility.." || trimmed === "reset" || trimmed === "dao") {
                    clearAllOptions();
                }
            },
            "Nevermind", () => {},
            "needinput"
        );
    });
});
