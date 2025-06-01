document.addEventListener("DOMContentLoaded", () => {
    const toggleSelector = ".uc-opt:not(.uc-folder):not(.uc-folder-title):not(.uc-opt-settings):not(.uc-opt-toggle)";
    const toggleAttr = "toggle";

    window.ucOptionsToggled = [];
    window.appendToggleStates = appendToggleStates;

    function appendToggleStates() {
        document.querySelectorAll(toggleSelector).forEach(opt => {
            if (!opt.querySelector('.toggle-state')) {
                const toggleBtn = document.createElement('div');
                toggleBtn.className = 'toggle-state';
                toggleBtn.textContent = 'ON';
                opt.appendChild(toggleBtn);
            }
        });
    }

    // Extract { char, label }: "🔥 Fire Mode" -> { 🔥, Fire Mode }
    function splitLabel(text) {
        const spaceIndex = text.indexOf(" ");
        if (spaceIndex === -1) return { char: text.trim(), label: "" };
        return {
            char: text.slice(0, spaceIndex).trim(),
            label: text.slice(spaceIndex + 1).trim()
        };
    }

    browser.storage.local.get("uc-options-toggled").then(data => {
        const toggled = data["uc-options-toggled"];
        if (Array.isArray(toggled)) {
            window.ucOptionsToggled = toggled;
            document.querySelectorAll(toggleSelector).forEach(opt => {
                const { char } = splitLabel(opt.textContent);
                if (toggled.includes(char)) {
                    opt.setAttribute(toggleAttr, "on");
                }
            });
            console.log("restored uc-options-toggled:", toggled);
        }
    });

    // Centralized toggle function
    function toggleOptionElement(opt) {
        if (!opt || !opt.matches(toggleSelector)) return;
        const { char } = splitLabel(opt.textContent);
        const isOn = opt.getAttribute(toggleAttr) === "on";
        if (!isOn) {
            // no duplicates
            const existing = Array.from(document.querySelectorAll(`${toggleSelector}[${toggleAttr}="on"]`)).find(el => {
                const existingChar = splitLabel(el.textContent).char;
                return existingChar === char;
            });

            if (existing) {
                console.log(`${opt.textContent} is already toggled, check if you have multiple options with the same character!`);
                window.ucNotify(`Warning: You have two options using ${char}. Find the duplicate and change it.`);
                return;
            }

            opt.setAttribute(toggleAttr, "on");
            console.log("toggled ON:", opt.textContent);
        } else {
            opt.removeAttribute(toggleAttr);
            console.log("toggled OFF:", opt.textContent);
        }

        updateToggleState();
    }

    function updateToggleState() {
        const toggled = Array.from(document.querySelectorAll(`${toggleSelector}[${toggleAttr}="on"]`))
            .map(el => splitLabel(el.textContent).char);
        window.ucOptionsToggled = toggled;
        browser.storage.local.set({ "uc-options-toggled": toggled });
        console.log("updating storage with:", toggled);

        const toggledPrefix = toggled.join(" ");
        browser.runtime.sendMessage({ action: "updateWindowTitles", toggledPrefix });
    }



    document.querySelector(".uc-options").addEventListener("dblclick", (e) => {
        const el = e.target.closest(toggleSelector);
        if (el) toggleOptionElement(el);
    });

    document.querySelector(".uc-options").addEventListener("click", (e) => {
        const toggleBtn = e.target.closest(".toggle-state");
        if (!toggleBtn) return;
        const opt = toggleBtn.closest(toggleSelector);
        if (opt) toggleOptionElement(opt);
    });

    appendToggleStates();

    window.toggleOptionByText = (label) => {
        const el = Array.from(document.querySelectorAll(toggleSelector)).find(el => el.textContent === label);
        if (el) toggleOptionElement(el);
    };
});
