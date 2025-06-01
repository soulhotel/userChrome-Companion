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

    /* enter/exit edit mode */
    editBtn.addEventListener('click', () => {
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
                    renameBtn.textContent = '✏️';

                    const delBtn = document.createElement('button');
                    delBtn.className = 'edit-mode-delete';
                    delBtn.textContent = '❌';

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
        // Normalize and save only when exiting edit mode
        if (typeof window.normalizeOptionClasses === 'function') window.normalizeOptionClasses();
        if (typeof window.normalizeFolderClasses === 'function') window.normalizeFolderClasses();
        if (!editMode && typeof window.saveOptionsOrder === 'function') window.saveOptionsOrder();
    });

    /* assign functionality to delete button */
    ucOptions.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.edit-mode-delete');
        if (!delBtn) return;
        e.stopPropagation();
        const opt = delBtn.closest('.uc-opt, .uc-folder-title');
        if (!opt) return;

        if (opt.classList.contains('uc-folder-title')) {
            const folder = opt.closest('.uc-folder');
            if (folder) folder.remove();
        } else {
            opt.remove();
        }
        // Call normalization functions (make sure they are globally accessible)
        if (typeof normalizeOptionClasses === 'function') normalizeOptionClasses();
        if (typeof normalizeFolderClasses === 'function') normalizeFolderClasses();
    });
    /* assign functionality to rename button */
    ucOptions.addEventListener('click', (e) => {
        const renameBtn = e.target.closest('.edit-mode-rename');
        if (!renameBtn) return;
        e.stopPropagation();
        const opt = renameBtn.closest('.uc-opt, .uc-folder-title');
        if (!opt) return;
        if (opt.classList.contains('uc-folder-title')) {
            // Rename folder
            window.ucNotify(
                "Rename this folder to..",
                "Confirm",
                (inputValue) => {
                    if (inputValue.trim() !== "") {
                        opt.textContent = inputValue.trim();

                        // Re-add edit mode buttons and attributes
                        opt.setAttribute('edit-mode', 'true');
                        if (!opt.querySelector('.edit-mode-buttons')) {
                            const btnContainer = document.createElement('div');
                            btnContainer.className = 'edit-mode-buttons';

                            const delBtn = document.createElement('button');
                            delBtn.className = 'edit-mode-delete';
                            delBtn.textContent = '❌';

                            const renameBtn = document.createElement('button');
                            renameBtn.className = 'edit-mode-rename';
                            renameBtn.textContent = '✏️';

                            btnContainer.appendChild(delBtn);
                            btnContainer.appendChild(renameBtn);
                            opt.appendChild(btnContainer);
                        }
                    }
                },
                "Nevermind", () => console.log("rename canceled"),
                "needinput"
            );
        } else {
            // Rename option
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

                            const delBtn = document.createElement('button');
                            delBtn.className = 'edit-mode-delete';
                            delBtn.textContent = '❌';

                            const renameBtn = document.createElement('button');
                            renameBtn.className = 'edit-mode-rename';
                            renameBtn.textContent = '✏️';

                            btnContainer.appendChild(delBtn);
                            btnContainer.appendChild(renameBtn);
                            opt.appendChild(btnContainer);
                        }
                    }
                },
                "Nevermind", () => console.log("rename canceled"),
                "needinput"
            );
        }
    });
});
