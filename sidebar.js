import '/uc-notify/uc-notify.js';
import '/modules/edit-mode.js';
import '/modules/settings-module.js';

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

    const newOptBtn = document.querySelector('.uc-toolbar-new-opt');
    const newFolderBtn = document.querySelector('.uc-toolbar-new-folder');

    let isNotifyVisible = false;

    // notify testing ------------------------------------------------------------------------------------
    document.querySelector(".uc-opt-toggle").addEventListener("click", () => {
        window.ucNotify(
            "(this is a test notification) Toggle userChrome Styles?",
            "Sure", (val) => {browser.storage.local.set({ uchromeInput: val })},
            "Nope", () => console.log("test notification canceled"),
            "needinput"
        );
    });

    // load/save options ---------------------------------------------------------------------------------
    browser.storage.local.get("uc-options-order").then(data => {
        const saved = data["uc-options-order"];
        const container = document.querySelector(".uc-options");
        if (Array.isArray(saved) && container) {
            const children = Array.from(container.children).filter(el => el.classList.contains("uc-opt"));
            const first = children[0]; // toggle
            const last = children[children.length - 1]; // settings
            // exclude first & last .uc-opt (toggle & settings)
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
        if (container.getAttribute("edit-mode") === "true") {
            console.log("edit-mode detected – not saving order");
            return;
        }
        const children = Array.from(container.children).filter(el => el.classList.contains("uc-opt"));
        // exclude first & last .uc-opt (toggle & settings)
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

    // folders -------------------------------------------------------------------------------------------

    // the sidebar is not always unloaded
    // so first time interaction (after being hidden) should:
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
            console.log("folder collapsed, removed .expanded", folder);
        });
    }
    function toggleExpanded(folder) {
        folder.classList.toggle("expanded");
        console.log(`folder toggled, .expanded`, folder);
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
        // SAFEGUARD: prevent opt from swapping with its own parent folder
        if (
            dragSrcEl.classList.contains("uc-opt") &&
            target.classList.contains("uc-folder") &&
            dragSrcEl.parentElement === target
        ) {
            console.warn("Blocked: an opt cannot swap with its parent folder");
            return false;
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
    // Rebind drag events after positions are manipulated
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

    // These for .uc-folder
    document.querySelectorAll(".uc-folder").forEach(folder => {
        folder.addEventListener("dragover", handleDragOverFolder);
        folder.addEventListener("drop", handleDropFolder);
        folder.addEventListener("dragleave", handleDragLeaveFolder);
    });
    function handleDragOverFolder(e) {
        e.preventDefault(); // Allow
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
        // Check if last option in the origin folder before moving
        if (isLastOpt) {
            window.ucNotify(
                "Moving the last option out of this folder will delete the folder..",
                "Move It", () => { proceedMove(); sourceFolder.remove(); saveOptionsOrder(); },
                "Keep Folder", () => { folder.classList.remove("drop-target"); }
            );
        } else {
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
    Basically filter through all options/folders, and reassign numerical order based on placement in the dom
    this keeps number order structured instead of scrambled,
    makes impor/export/saving of the list much easier to work with, not reliant on attributes
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
        console.log("Option classes normalized.");
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
        // for options that were moved outside of a folder
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

    // Toolbar New Option/New Folder -------------------------------------------------------------------------

    newOptBtn?.addEventListener('click', () => {
        window.ucNotify(
        "Name this option (emoji)(space)(description):",
        "Create",
        (val) => {
            if (!val) return;
            const optNum = getNextOptNumber();
            const newOpt = document.createElement('div');
            newOpt.className = `uc-opt uc-opt-${optNum}`;
            newOpt.draggable = true;
            newOpt.textContent = val;
            ucOptions.insertBefore(newOpt, settingsBtn);
            bindDragEvents();
            normalizeOptionClasses();
            saveOptionsOrder();
        },
        "Cancel",
        () => {},
        "needinput"
        );
    });
    newFolderBtn?.addEventListener('click', () => {
        const folderNum = getNextFolderNumber();
        const optNum = getNextOptNumber();
        window.ucNotify(
            "Name this folder:",
            "Create",
            (name) => {
            const folderName = name.trim() || 'New Folder';

            const folderWrap = document.createElement('div');
            folderWrap.className = `uc-opt uc-folder uc-folder-${folderNum}`;
            const title = document.createElement('div');
            title.className = `uc-opt uc-folder-title uc-folder-${folderNum}`;
            title.draggable = true;
            title.textContent = folderName;
            folderWrap.appendChild(title);
            const newOpt = document.createElement('div');
            newOpt.className = `uc-opt uc-opt-${optNum}`;
            newOpt.draggable = true;
            newOpt.textContent = '🌀 Something';
            folderWrap.appendChild(newOpt);
            ucOptions.insertBefore(folderWrap, settingsBtn);
            bindDragEvents();
            normalizeFolderClasses();
            saveOptionsOrder();
            },
            "Cancel",
            () => {},
            "needinput"
        );
    });
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

    /* need these globally for any other script that manipulates positioning */
    window.bindDragEvents = bindDragEvents;
    window.normalizeOptionClasses = normalizeOptionClasses;
    window.normalizeFolderClasses = normalizeFolderClasses;
    window.saveOptionsOrder = saveOptionsOrder;

});
