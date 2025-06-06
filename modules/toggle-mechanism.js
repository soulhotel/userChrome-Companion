document.addEventListener("DOMContentLoaded", () => {
    const toggleSelector = ".uc-opt:not(.uc-folder):not(.uc-folder-title):not(.uc-opt-settings):not(.uc-opt-toggle)";
    const toggleAttr = "toggle";

    window.currentlyToggledOptions = [];
    window.recentlyToggledOptions = [];
    window.setToggledUI = setToggledUI;
    window.syncToggledStates = syncToggledStates;
    window.splitChar = splitChar;


    window.getChar = function(opt) {
    if (!opt) return null;
    if (opt.classList.contains('uc-opt') && !opt.classList.contains('uc-folder-title')) {
        return window.splitChar(opt).char || null;
    }
    return null;
    };

    function splitChar(el) {
        const text = Array.from(el.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join(" ");
        const spaceIndex = text.indexOf(" ");
        if (spaceIndex === -1) return { char: text.trim(), label: "" };
        return {
            char: text.slice(0, spaceIndex).trim(),
            label: text.slice(spaceIndex + 1).trim()
        };
    }

    function setToggleState(opt) {
        // safe 0 - existence
        if (!opt || !opt.matches(toggleSelector)) return;
        const { char, label } = splitChar(opt);
        // safe 1 - format
        if (!char || !label) {
            console.log(`setToggleState: Refuse to Toggle (${opt.textContent}). It needs proper format (char)(space)(label).`);
            window.ucNotify(`HEY 😠 (${char} ${label})?? I can't work with this.`, `Okay`);
            return;
        }
        // safe 2 - duplicates
        const allWithChar = Array.from(document.querySelectorAll(toggleSelector)).filter(el => {
            const { char: c } = splitChar(el);
            return c === char;
        });
        if (allWithChar.length > 1) {
            console.log(`setToggleState: Refuse to Toggle (${opt.textContent}). More than one option uses (${char}).`);
            window.ucNotify(`HEY 😠 You have multiple options using (${char}). Find the duplicates and fix them.`, `Okay`);
            return;
        }
        // safe to proceed
        const isOn = opt.getAttribute(toggleAttr) === "on";
        const trimmedopt = opt.textContent.replace(/ON$/i, '').trim();
        if (!isOn) {
            window.currentlyToggledOptions.push(char);
            window.recentlyToggledOptions = [...window.currentlyToggledOptions];
            opt.setAttribute(toggleAttr, "on");
            console.log("setToggleState ON:", trimmedopt);
        } else {
            window.currentlyToggledOptions = window.currentlyToggledOptions.filter(c => c !== char);
            window.recentlyToggledOptions = [...window.currentlyToggledOptions];
            opt.removeAttribute(toggleAttr);
            console.log("setToggleState OFF:", trimmedopt);
        }
        syncToggledStates();
    }

    function syncToggledStates() {
        console.log(`syncToggledStates: syncing toggled options...`);
        const toggled = (window.currentlyToggledOptions || []).filter(Boolean);
        window.currentlyToggledOptions = toggled;
        window.toggleToggledOptions = window.currentlyToggledOptions.length > 0 ? "ON" : "OFF";
        browser.storage.local.set({
            "uc-toggled-currently": toggled,
            "uc-toggled-recently": window.recentlyToggledOptions,
            "uc-toggled-toggle": window.toggleToggledOptions
        });
        console.log("syncToggledStates: updating storage with:", toggled);
        const toggledPrefix = toggled.join(" ");
        browser.runtime.sendMessage({ action: "updateWindowTitles", toggledPrefix });
        document.querySelectorAll(toggleSelector).forEach(opt => {
            const { char, label } = splitChar(opt);
            if (!char || !label) {
                console.log(`syncToggledStates: invalid format (${opt.textContent}). Removing toggleAttr if present.`);
                if (opt.hasAttribute(toggleAttr)) opt.removeAttribute(toggleAttr);
                return;
            }
            const shouldBeOn = toggled.includes(char);
            const isOn = opt.getAttribute(toggleAttr) === "on";
            //console.log(`[CHECK] char=${char} | shouldBeOn=${shouldBeOn} | isOn=${isOn}`);
            const trimmedopt = opt.textContent.replace(/ON$/i, '').trim();
            if (shouldBeOn && !isOn) {
                opt.setAttribute(toggleAttr, "on");
                console.log(`syncToggledStates: ensuring toggle="on" for`, trimmedopt);
            } else if (!shouldBeOn && isOn) {
                opt.removeAttribute(toggleAttr);
                console.log(`syncToggledStates: removing toggle="on" from`, trimmedopt);
            }
        });
        setToggledUI();
    }

    function setToggledUI() {
        document.querySelectorAll(toggleSelector).forEach(opt => {
            if (!opt.querySelector('.toggle-state')) {
                const toggleBtn = document.createElement('div');
                toggleBtn.className = 'toggle-state';
                toggleBtn.textContent = 'ON';
                opt.appendChild(toggleBtn);
            }
        });
    }

    window.toggleRecentToggles = () => {
        const newState = window.toggleToggledOptions === "ON" ? "OFF" : "ON";
        window.toggleToggledOptions = newState;
        browser.storage.local.set({ "uc-toggled-toggle": newState });

        if (newState === "OFF") {
            window.currentlyToggledOptions = [];
        } else {
            window.currentlyToggledOptions = [...(window.recentlyToggledOptions || [])];
        }

        console.log(`toggleRecentToggles: toggled ${newState}`);
        syncToggledStates();
    };

    window._toggleInProgress = false;
    window.toggleRecentToggles = () => {
        if (window._toggleInProgress) {
            console.log("toggleRecentToggles: Wait.");
            return;
        }
        window._toggleInProgress = true;
        const ucToggle = document.querySelector(".uc-opt-toggle");
        if (ucToggle) {
            const togglesUpdated = document.createElement("div");
            togglesUpdated.className = "toggle-updated";
            togglesUpdated.textContent = "🗘";
            ucToggle.appendChild(togglesUpdated);
            setTimeout(() => {
            togglesUpdated.remove();
            }, 500);
        }
        // Now toggle Recents
        const newState = window.toggleToggledOptions === "ON" ? "OFF" : "ON";
        window.toggleToggledOptions = newState;
        browser.storage.local.set({ "uc-toggled-toggle": newState });
        if (newState === "OFF") {
            window.currentlyToggledOptions = [];
        } else {
            window.currentlyToggledOptions = [...(window.recentlyToggledOptions || [])];
        }
        console.log(`toggleRecentToggles: toggled ${newState}`);
        syncToggledStates();
        setTimeout(() => {
            window._toggleInProgress = false;
        }, 1000);
    };

    // ----------------------------------------------------------------------------------------------------------------

    document.querySelector(".uc-options").addEventListener("dblclick", (e) => {
        const el = e.target.closest(toggleSelector);
        if (el) setToggleState(el);
    });
    document.querySelector(".uc-options").addEventListener("click", (e) => {
        const toggleBtn = e.target.closest(".toggle-state");
        if (!toggleBtn) return;
        const opt = toggleBtn.closest(toggleSelector);
        if (opt) setToggleState(opt);
    });
    window.toggleOptionByText = (label) => {
        const el = Array.from(document.querySelectorAll(toggleSelector)).find(el => {
            const { char, label: lbl } = splitChar(el);
            return `${char} ${lbl}` === label;
        });
        if (el) setToggleState(el);
    };

    browser.storage.local.get([
        "uc-toggled-currently",
        "uc-toggled-recently",
        "uc-toggled-toggle"
    ]).then(data => {
        //console.log("browser storage get: result:", data);
        const toggled = data["uc-toggled-currently"];
        const recent = data["uc-toggled-recently"];
        const toggleState = data["uc-toggled-toggle"];
        //console.log(`browser storage get: toggled`, toggled);
        //console.log(`browser storage get: data["uc-toggled-currently"]`, data["uc-toggled-currently"]);
        if (Array.isArray(toggled)) window.currentlyToggledOptions = toggled;
        if (Array.isArray(recent)) {
            window.recentlyToggledOptions = recent;
        } else {
            window.recentlyToggledOptions = [...window.currentlyToggledOptions];
        }
        window.toggleToggledOptions = toggleState || "OFF";

        requestIdleCallback(syncToggledStates); // wait DOM
    });

});
