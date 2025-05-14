import '/uc-notify/uc-notify.js';

document.addEventListener("DOMContentLoaded", () => {

    let settingsOpen = false;
    let settingsSaved = true;

    const ucSidebar = document.querySelector(".uc-sidebar");
    const ucSettings = document.querySelector(".uc-settings");
    const ucOptions = document.querySelector(".uc-options");
    const ucNotify = document.querySelector(".uc-notify");
    const ucNotifyMessage = document.querySelector(".uc-notify-message");
    const ucNotifyYes = document.querySelector(".uc-notify-sendit");
    const ucNotifyNo = document.querySelector(".uc-notify-rejectit");

    const saveBtn = document.querySelector(".uc-settings-save");
    const exitBtn = document.querySelector(".uc-settings-exit");
    const settingsBtn = document.querySelector(".uc-opt-settings");

    let isNotifyVisible = false;

    // loadoptions ---------------------------------------------------------------------------------------

    // notify testing ------------------------------------------------------------------------------------

    document.querySelector(".uc-opt-toggle").addEventListener("click", () => {
        window.ucNotify(
            "Enter value for userChrome:",
            "Save", (val) => {browser.storage.local.set({ uchromeInput: val })},
            "No", () => console.log("saving canceled"),
            "needinput"
        );
    });

    document.querySelector(".uc-toolbar-new-opt").addEventListener("click", () => {
        window.ucNotify(
            "create a new option?",
            console.log("new option created"),
            console.log("no new option created")
        );
    });

    document.querySelector(".uc-toolbar-edit-mode").addEventListener("click", () => {
        window.ucNotify("With great power, comes great responsibility..","Thanks, Uncle Ben.")
        /*exitEditMode() example*/
        const editBtn = document.querySelector('.uc-toolbar-edit-mode');
        editBtn.textContent = 'Exit Edit Mode';
        editBtn.classList.add("editting");
    });



    browser.storage.local.get("uc-options-order").then(data => {
        const saved = data["uc-options-order"];
        const container = document.querySelector(".uc-options");

        if (Array.isArray(saved) && container) {
            const children = Array.from(container.children).filter(el => el.classList.contains("uc-opt"));
            const first = children[0]; // toggle
            const last = children[children.length - 1]; // settings

            // Clear all except toggle & settings
            container.innerHTML = "";
            container.appendChild(first);

            saved.forEach(html => {
                container.insertAdjacentHTML("beforeend", html);
            });

            container.appendChild(last);
        }

        bindDragEvents();
    });

    function saveOptionsOrder() {
        const container = document.querySelector(".uc-options");
        const children = Array.from(container.children).filter(el => el.classList.contains("uc-opt"));

        // exclude first and last .uc-opt (toggle & settings)
        const toSave = children.slice(1, -1).map(el => el.outerHTML);

        browser.storage.local.set({ "uc-options-order": toSave });
    }

    ucOptions.addEventListener("click", (e) => {
        if (e.target.classList.contains("uc-folder-title")) {
            const folder = e.target.closest(".uc-folder");
            if (folder) {
                toggleExpanded(folder);
            }
        }
    });

    // settings ui ---------------------------------------------------------------------------------------

    function openSettings() {
        settingsOpen = true;
        ucSettings.style.display = "flex";
        ucOptions.style.opacity = "0.2";
    }

    function closeSettings() {
        settingsOpen = false;
        ucSettings.style.display = "none";
        ucOptions.style.opacity = "1";
    }

    settingsBtn.addEventListener("click", openSettings);

    saveBtn.addEventListener("click", () => {
        window.ucNotify(
            "Save Changes?",
            "Yes", () => { settingsSaved = true; browser.storage.local.set({ "settings-saved": true }); },
            "Nope", () => { settingsSaved = false; }
        );
    });

    exitBtn.addEventListener("click", () => {
        if (settingsSaved) {
            closeSettings();
        } else {
            window.ucNotify(
                "Save Changes?",
                "Yes", () => { settingsSaved = true; browser.storage.local.set({ "settings-saved": true }); closeSettings(); },
                "Nope", () => { settingsSaved = false; closeSettings(); }
            );
        }
    });

    // folders -------------------------------------------------------------------------------------------

    // the sidebar is not always unloaded. so the first time it is interacted after being hidden:
    if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
            if (!document.hidden) {
                resetExpandedFolders();
                console.log("reset via idle callback");
            }
        });
    } else {
        setTimeout(() => {
            if (!document.hidden) {
                resetExpandedFolders();
                console.log("reset via fallback timeout");
            }
        }, 200);
    }

    function resetExpandedFolders() {
        document.querySelectorAll(".uc-folder.expanded").forEach(folder => {
            folder.classList.remove("expanded");
            console.log("Removed .expanded from:", folder);
        });
    }

    function toggleExpanded(folder) {
        folder.classList.toggle("expanded");
        console.log(`Toggled .expanded`, folder);
    }



    // drag & drop ----------------------------------------------------------------------------------------

    let dragSrcEl = null;

    function handleDragStart(e) {
        const isFolderTitle = this.classList.contains("uc-folder-title");

        if (isFolderTitle) {
            console.log("folder title detected in drag start", isFolderTitle);
            resetExpandedFolders();
            dragSrcEl = this.parentElement;
            dragSrcEl.classList.add("dragging", "folder-dragging");
            console.log("uc-folder being dragged", dragSrcEl);
        } else {
            dragSrcEl = this;
            dragSrcEl.classList.add("dragging");
        }

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", this.innerHTML);

        document.querySelectorAll(".uc-folder, .uc-opt-settings, .uc-opt-toggle, .uc-folder-title").forEach(item => {
            item.classList.add("cant-drop");
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    function handleDragEnter() {
        this.classList.add("drop-target");
    }

    function handleDragLeave() {
        this.classList.remove("drop-target");
    }

    function handleDrop(e) {
        e.stopPropagation();
        if (!dragSrcEl || dragSrcEl === this) return false;

        const target = this.classList.contains("uc-folder-title") ? this.parentElement : this;

        // --- SAFEGUARD: prevent opt from swapping with its own parent folder ---
        if (
            dragSrcEl.classList.contains("uc-opt") &&
            target.classList.contains("uc-folder") &&
            dragSrcEl.parentElement === target
        ) {
            console.warn("Blocked: an opt cannot swap with its parent folder.");
            return false; // Abort the drop
        }

        const temp = target.outerHTML;
        target.outerHTML = dragSrcEl.outerHTML;
        dragSrcEl.outerHTML = temp;

        requestAnimationFrame(() => {
            bindDragEvents();
            saveOptionsOrder();
        });

        return false;
    }

    function handleDragEnd() {
        document.querySelectorAll(".uc-opt").forEach(el => {
            el.classList.remove("dragging", "drop-target");
        });
        document.querySelectorAll(".uc-folder, .uc-opt-settings, .uc-opt-toggle, .uc-folder-title").forEach(item => {
            item.classList.remove("cant-drop");
        });
        normalizeOptionClasses();
        normalizeFolderClasses();
        saveOptionsOrder();
    }

    document.querySelectorAll(".uc-opt[draggable='true']").forEach(item => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragenter", handleDragEnter);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("dragleave", handleDragLeave);
        item.addEventListener("drop", handleDrop);
        item.addEventListener("dragend", handleDragEnd);
    });

    // Rebind drag events after options are loaded
    function bindDragEvents() {
        document.querySelectorAll(".uc-opt[draggable='true']").forEach(item => {
            item.addEventListener("dragstart", handleDragStart);
            item.addEventListener("dragenter", handleDragEnter);
            item.addEventListener("dragover", handleDragOver);
            item.addEventListener("dragleave", handleDragLeave);
            item.addEventListener("drop", handleDrop);
            item.addEventListener("dragend", handleDragEnd);
        });
        document.querySelectorAll(".uc-folder").forEach(item => {
            item.addEventListener("dragover", handleDragOverFolder);
            item.addEventListener("dragleave", handleDragLeaveFolder);
            item.addEventListener("drop", handleDropFolder);
        });
    }


    // Add these to the drag event listeners for .uc-folder
    document.querySelectorAll(".uc-folder").forEach(folder => {
        folder.addEventListener("dragover", handleDragOverFolder);
        folder.addEventListener("drop", handleDropFolder);
        folder.addEventListener("dragleave", handleDragLeaveFolder);
    });

    function handleDragOverFolder(e) {
        e.preventDefault(); // Allow drop
        const folder = e.target.closest('.uc-folder');
        if (!folder) return;
        folder.classList.add("drop-target");
    }

    function handleDragLeaveFolder(e) {
        e.preventDefault();
        const folder = e.target.closest('.uc-folder');
        if (folder) {
            folder.classList.remove("drop-target");
        }
    }

    function handleDropFolder(e) {
        e.stopPropagation();
        const folder = e.target.closest('.uc-folder');
        if (!folder) return;

        const draggedOpt = document.querySelector(".dragging");
        if (!draggedOpt) return;

        // Check if the dragged option is already inside the folder
        if (folder.contains(draggedOpt)) {
            window.dontcNotify();
            return;
        }

        const sourceFolder = draggedOpt.closest(".uc-folder");
        const optCount = sourceFolder.querySelectorAll(".uc-opt").length;
        const isLastOpt = optCount === 2;

        const proceedMove = () => {
            folder.appendChild(draggedOpt);
            folder.classList.remove("drop-target");
            window.dontcNotify();
        };

        // Check if this is the last option in the source folder
        if (isLastOpt) {
            window.ucNotify(
                "Moving the last option out of this folder will delete the folder..",
                "Move It", () => { proceedMove(); sourceFolder.remove(); saveOptionsOrder(); },
                "Keep Folder", () => { folder.classList.remove("drop-target"); }
            );
        } else {
            // Regular confirmation to move the option to the folder
            window.ucNotify(
                "Move this option to the folder?",
                "Yes", () => { proceedMove(); saveOptionsOrder(); },
                "No", () => { folder.classList.remove("drop-target"); }
            );
        }
    }

    bindDragEvents();

    // Option and Folder Dynamic organization ----------------------------------------------------------------

    /*
    Basically filter through all options, and reassign numerical order based on placement structure
    keeping number order structured instead of scrambled will make import or export or saving of the list
    much easier to work with
    */
    function normalizeOptionClasses() {
        const allOptionElements = Array.from(document.querySelectorAll('.uc-opt[class*="uc-opt-"]'));
        const numberedElements = allOptionElements.filter(el =>
            !el.classList.contains('uc-opt-toggle') &&
            !el.classList.contains('uc-opt-settings')
        );
        numberedElements.forEach(el => {
            el.classList.forEach(cls => {
                if (/^uc-opt-\d+$/.test(cls)) {
                    el.classList.remove(cls);
                }
            });
        });
        // assign numbers
        numberedElements.forEach((el, index) => {
            el.classList.add(`uc-opt-${index + 1}`);
        });
        console.log(`Renumbered ${numberedElements.length} .uc-opt blocks`);
    }

    function normalizeFolderClasses() {
        const folderContainers = document.querySelectorAll('.uc-folder[class*="uc-folder-"]');
        folderContainers.forEach(folder => {
            // Extract correct folder number
            const folderClass = Array.from(folder.classList).find(cls => /^uc-folder-\d+$/.test(cls));
            if (!folderClass) return;
            const folderNumber = folderClass.match(/\d+/)[0];
            const nestedOpts = folder.querySelectorAll('.uc-opt');
            nestedOpts.forEach(opt => {
                opt.classList.forEach(cls => {
                    if (/^uc-folder-\d+$/.test(cls)) {
                        opt.classList.remove(cls);
                    }
                });
                // assign numbers
                opt.classList.add(`uc-folder-${folderNumber}`);
            });
        });
        // for options that were moved outside of folders
        const allFolderedOpts = document.querySelectorAll('.uc-opt[class*="uc-folder-"]');
        allFolderedOpts.forEach(opt => {
            if (!opt.closest('.uc-folder')) {
                opt.classList.forEach(cls => {
                    if (/^uc-folder-\d+$/.test(cls)) {
                        opt.classList.remove(cls);
                    }
                });
            }
        });
        console.log("Folder classes normalized.");
    }



});
