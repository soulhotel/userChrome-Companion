document.addEventListener("DOMContentLoaded", () => {

// Resize Helper -----------------------------------------------------------------------------------------

function resizeToolbarButtons() {
    const collapsedLabelReference = {
        "uc-toolbar-new-opt": "➕",
        "uc-toolbar-new-folder": "📂",
        "uc-toolbar-edit-mode": "✏️",
        "uc-settings-pco-add2opt": "➕",
        "uc-settings-pco-overallopt": "📝",
        "uc-settings-pco-impat": "🌐",
        "uc-settings-pco-impfile": "📂",
        "uc-settings-pco-help": "?",
        "uc-settings-pct-togtoggles": "🔛",
        "uc-settings-pct-exptoggles": "➡️",
        "uc-settings-pct-imptoggles": "⤵️",
        "uc-settings-pct-help": "?"
    };

    const expandedLabelReference = {
        "uc-toolbar-new-opt": "New Tab",
        "uc-toolbar-new-folder": "New Folder",
        "uc-toolbar-edit-mode": "Edit Mode",
        "uc-settings-pco-add2opt": "Add to Options",
        "uc-settings-pco-overallopt": "Overwrite Options",
        "uc-settings-pco-impat": "Import @",
        "uc-settings-pco-impfile": "Import File",
        "uc-settings-pco-help": "?",
        "uc-settings-pct-togtoggles": "Toggle All",
        "uc-settings-pct-exptoggles": "Export Toggles",
        "uc-settings-pct-imptoggles": "Import Toggles",
        "uc-settings-pct-help": "?"
    };

    const useCollapsed = window.innerWidth < 325;

    for (const key in collapsedLabelReference) {
        const el = document.querySelector(`.${key}`);
        if (el) {
            el.textContent = useCollapsed ? collapsedLabelReference[key] : expandedLabelReference[key];
        }
    }
}

window.addEventListener("resize", resizeToolbarButtons);

});