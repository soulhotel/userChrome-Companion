document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.querySelector('.uc-toolbar-edit-mode');
    const ucOptions = document.querySelector('.uc-options');
    let editMode = false;
    editBtn.textContent = 'Edit Mode';
    ucOptions.removeAttribute('edit-mode');
    ucOptions.querySelectorAll('[edit-mode="true"]').forEach(el => el.removeAttribute('edit-mode'));
    ucOptions.querySelectorAll('.edit-mode-buttons').forEach(btn => btn.remove());
    editBtn.textContent = 'Edit Mode';

    if (!editBtn || !ucOptions) return;

    window.enterEditMode = enterEditMode;
    window.deleteOption = deleteOption;
    window.renameOption = renameOption;

    /* enter/exit edit mode ------------------------------------------------------------------------- */

    function resetEditMode() {
        editMode = false;
        editBtn.textContent = 'Edit Mode';
        ucOptions.removeAttribute('edit-mode');
        ucOptions.querySelectorAll('.edit-mode-buttons').forEach(btnContainer => btnContainer.remove());
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(resetEditMode);
    } else {
        setTimeout(resetEditMode, 1);
    }
    function enterEditMode() {
        editMode = !editMode;
        editBtn.textContent = editMode ? 'Exit Edit Mode' : 'Edit Mode';
        if (editMode) {
            ucOptions.setAttribute('edit-mode', 'true');
            window.ucNotify("With great power, comes great responsibility..", "Thanks, Uncle Ben.");
        } else {
            ucOptions.removeAttribute('edit-mode');
        }
        const optsToEdit = [
            ...ucOptions.querySelectorAll('.uc-opt:not(.uc-opt-toggle):not(.uc-opt-settings):not(.uc-folder)'),
            ...ucOptions.querySelectorAll('.uc-folder-title')
        ];
        optsToEdit.forEach(opt => {
            if (editMode) {
                opt.setAttribute('edit-mode', 'true');
                if (!opt.querySelector('.edit-mode-buttons')) {
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'edit-mode-buttons';
                    const renameBtn = document.createElement('button');
                    renameBtn.className = 'edit-mode-rename';
                    renameBtn.textContent = '✎';
                    const delBtn = document.createElement('button');
                    delBtn.className = 'edit-mode-delete';
                    delBtn.textContent = '×';
                    btnContainer.appendChild(renameBtn);
                    btnContainer.appendChild(delBtn);
                    opt.appendChild(btnContainer);
                }
            } else {
                opt.removeAttribute('edit-mode');
            }
        });
        if (!editMode) {
            ucOptions.querySelectorAll('.edit-mode-buttons').forEach(btnContainer => btnContainer.remove());
        }
        if (typeof window.normalizeOptionClasses === 'function') window.normalizeOptionClasses();
        if (typeof window.normalizeFolderClasses === 'function') window.normalizeFolderClasses();
        if (!editMode) {
            if (typeof window.saveOptionsOrder === 'function') window.saveOptionsOrder();
        }
    }

    /* edit mode btn functionality ------------------------------------------------------------------ */
    //delete
    function deleteOption(opt) {
        if (!opt) return;
        if (opt.classList.contains('uc-folder-title')) {
            const folder = opt.closest('.uc-folder');
            if (folder) {
                if (!editMode) {
                    const folderName = opt.textContent.trim();
                    window.ucNotify(
                        `Deleting the “${folderName}” folder will also delete everything inside..`,
                        "Delete It", () => { folder.remove(); },
                        "Keep Folder", () => { }
                    );
                }
                else { folder.remove(); }
            } else {
            opt.remove();
            }
        }
        else { opt.remove(); }
        const char = window.getChar(opt);
        if (char) {
            window.currentlyToggledOptions = (window.currentlyToggledOptions || []).filter(c => c !== char);
            console.log(`deleteOption: removed (${char}) from currentlyToggledOptions`);
            if (typeof syncToggledStates === 'function') syncToggledStates();
        }
        if (typeof normalizeOptionClasses === 'function') normalizeOptionClasses();
        if (typeof normalizeFolderClasses === 'function') normalizeFolderClasses();
    }
    //rename
    function renameOption(opt) {
        if (!opt) return;
        let tempEditMode = false;
        if (!editMode) {
            enterEditMode(); tempEditMode = true; console.log("EDITMODE WAS FALSE, ENTERING TEMPEDITMODE");
        }
        if (opt.classList.contains('uc-folder-title')) {
            window.ucNotify(
                `Rename folder to..`,
                "Confirm",
                (inputValue) => {
                    if (inputValue.trim() !== "") {
                        opt.textContent = inputValue.trim();
                        opt.setAttribute('edit-mode', 'true');
                        if (!opt.querySelector('.edit-mode-buttons')) {
                            const btnContainer = document.createElement('div');
                            btnContainer.className = 'edit-mode-buttons';
                            const renameBtn = document.createElement('button'); renameBtn.className = 'edit-mode-rename'; renameBtn.textContent = '✎';
                            const delBtn = document.createElement('button'); delBtn.className = 'edit-mode-delete'; delBtn.textContent = '×';
                            btnContainer.appendChild(renameBtn); btnContainer.appendChild(delBtn); opt.appendChild(btnContainer);
                        }
                        if (tempEditMode) { enterEditMode(); tempEditMode = false; console.log("TEMPEDITMODE DETECTED, REVERSING"); }
                    }
                },
                "Nevermind", () => { if (tempEditMode) { enterEditMode(); tempEditMode = false; console.log("TEMPEDITMODE DETECTED, REVERSING"); } },
                "needinput"
            );
        } else {
            const oldChar = window.getChar(opt);
            window.ucNotify(
                "Rename this option to.. (character)(space)(description)",
                "Confirm",
                (inputValue) => {
                    if (inputValue.trim() !== "") {
                        opt.textContent = inputValue.trim();
                        opt.setAttribute('edit-mode', 'true');
                        if (!opt.querySelector('.edit-mode-buttons')) {
                            const btnContainer = document.createElement('div');
                            btnContainer.className = 'edit-mode-buttons';
                            const renameBtn = document.createElement('button'); renameBtn.className = 'edit-mode-rename'; renameBtn.textContent = '✎';
                            const delBtn = document.createElement('button'); delBtn.className = 'edit-mode-delete'; delBtn.textContent = '×';
                            btnContainer.appendChild(renameBtn); btnContainer.appendChild(delBtn); opt.appendChild(btnContainer);
                        }
                        if (tempEditMode) { enterEditMode(); tempEditMode = false; console.log("TEMPEDITMODE DETECTED, REVERSING"); }
                        const newChar = window.getChar(opt);
                        if (oldChar && newChar && oldChar !== newChar) {
                            window.currentlyToggledOptions = (window.currentlyToggledOptions || []).filter(c => c !== oldChar);
                            window.currentlyToggledOptions.push(newChar);
                            console.log(`renameOption: ${oldChar} replaced with ${newChar} in currentlyToggledOptions`);
                            syncToggledStates();
                        }
                    }
                },
                "Nevermind", () => { if (tempEditMode) { enterEditMode(); tempEditMode = false; console.log("TEMPEDITMODE DETECTED, REVERSING"); } },
                "needinput"
            );
        }
    }

    /* edit mode buttons ---------------------------------------------------------------------------- */

    editBtn.addEventListener('click', () => {
        enterEditMode();
    });

    ucOptions.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.edit-mode-delete');
        if (!delBtn) return;
        e.stopPropagation();
        const opt = delBtn.closest('.uc-opt, .uc-folder-title');
        if (!opt) return;
        deleteOption(opt);
    });

    ucOptions.addEventListener('click', (e) => {
        const renameBtn = e.target.closest('.edit-mode-rename');
        if (!renameBtn) return;
        e.stopPropagation();
        const opt = renameBtn.closest('.uc-opt, .uc-folder-title');
        if (!opt) return;
        renameOption(opt);
    });



});
