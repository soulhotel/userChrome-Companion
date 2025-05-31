# <p align="center">A userChrome Companion . . </p>

###### <p align="center">. . Firefox Extension to toggle userChrome styles through text.</p>

https://github.com/user-attachments/assets/45e810a6-b4c3-42a6-b3d1-3cabc84aeca7

> current state as of 5/31/2025

## End Goal:

ⓘ To append *any* character to the <ins>end</ins> of the Firefox Window. Mimicking the functionality of userChrome toggle without appending invisible (in your face characters) to the firefox window title; using post-title manipulation to trigger userChrome (css) styles

## Extension functionality

ⓘ Design stage 

- [x] drag and drop functionality `5/6/2025`
    - [x] rearranging of options or folders (drag drop) `5/5/2025`
    - [x] rearranging of options in folders (drag drop) `5/5/2025`
    - [x] adding options to a list of folders (+1 behavior) (drag drop) `5/5/2025`
    - [x] nesting of folders and options for organization of userchrome toggle's `5/5/2025`
    - [x] trigger notify to dragging last option outside of folder, proceed y/n `5/6/2025`
    - [x] safeguards `5/6/2025`
- [ ] custom context menu `delay to Usability Stage`
    - [ ] delete folder or delete option (trigger notify to preserve internal options)
    - [ ] rename folder or rename option 
    - [ ] rename folder or rename option
    - [ ] toggle settings
    - [ ] add option to folder
    - [ ] turn on/off `delay to Usability Stage`
- [ ] settings panel design `5/30/2025`
    - [x] settings ui `5/30/2025`
    - [x] allow import of options & folders (html specific format) `5/30/2025` (simple text format is better)
    - [x] allowing import of preset's (like presets for userChrome themes) `5/30/2025`
    - [x] reset to default `5/30/2025`
    - [ ] color scheme management `delay to Usability Stage`
- [x] custom notify library design [uc Notify](https://github.com/soulhotel/uc-notify) `5/6/2025` 
    - [x] notification ui `5/5/2025`
    - [x] input text functionality `5/5/2025`
    - [x] summon priority (query all siblings when .ucnotified to cease further manipulation until confirmation recieved) `5/6/2025`
    - [x] yes/no summoning (calling uc-notify across script functions to handle dynamic confirmations) `5/5/2025`
    - [x] dynamic summons (summon for verifications, summon for yes/no procs, summon for input/value exchanges, etc) `5/6/2025`
    - [x] yes/no procs binded to element interaction allowing custom sure/maybe, 1/2, y/n, developer heaven basically)  `5/6/2025`
    - [x] input-fiend proc grabs focus on summon (type and Enter) `5/6/2025`
    - [x] safeguards `5/6/2025`
    - [x] portability to other extensions `5/6/2025`
- [x] allowing dynamic layout's while maintaining fluid control over dom structure
- [x] edit mode `5/30/2025`
    - [x] edit mode, subtle ui `5/30/2025`
    - [x] toggle edit mode `5/30/2025`
    - [x] append delete/rename functions to options `5/30/2025`
- [x] Visual Design (will progress over time) `5/30/2025` (it has progressed over time)

ⓘ Usability stage

- [ ] toggle on/off application of all options via `Toggle userChrome`
- [ ] restoration of all options previously toggled off via `Toggle userChrome`
- [x] element identification filtering and organization
- [x] saving of options & folders *and* options in folders *and* folders in folders (position, dom structure, label preservation)
- [ ] toggle on/off application of individual option via mouse click
- [ ] saving of current toggle state of all options for domload
- [x] import of preset's (options) through raw hosted html, like a raw file from a theme creators github page `5/30/2025` (hosted textfile better)
- [ ] hotkey support

## Progression

> May 3-5

Design Stage rough draft. Drag and drop mostly complete. Notification system needed extensive work.

https://github.com/user-attachments/assets/dd301064-e785-466d-ab76-1179ff0cfc65

> May 6th

- [uc Notify](https://github.com/soulhotel/uc-notify) (Notification UI/UX kit) complete. Tabs renamed to Folders (logical). Options look more like tabs.
- Visual design adds subtle drop shadows. Blur background content on notify summons
- Spacing corrections.

https://github.com/user-attachments/assets/ab77a259-33a2-4977-961f-14965a69f9a2

> May 31st

- Sidebar Toolbar added. Edit Mode, New Tab (option), New Folder. Edit Mode (Sidebar Toolbar) functionality complete.
- Spawning New Option or New Folder (Sidebar Toolbar) functionality complete.
- Settings UI complete. Settings Options functionality complete.
  - Presets, add to options, overwrite options, import @, import file, delete all options
- Preset Testing, adding options/folders via text parsed from files locally (like a .txt file), or globally (like a raw github link)

[./presets/readme](https://github.com/soulhotel/userChrome-Companion/blob/main/presets/readme.md)

https://github.com/soulhotel/userChrome-Companion/blob/b3165a4a04ec55848dd2c94544e266f83949c8ba/presets/preset-example#L1-L4

https://github.com/user-attachments/assets/45e810a6-b4c3-42a6-b3d1-3cabc84aeca7



