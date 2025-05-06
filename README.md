## userChrome Companion
ⓘ Toggle userChrome styles through text - Firefox Extension


https://github.com/user-attachments/assets/dd301064-e785-466d-ab76-1179ff0cfc65


## End Goal:

ⓘ To append *any* character to the <ins>end</ins> of the Firefox Window. Mimicking the functionality of userChrome toggle without appending invisible (in your face characters) to the firefox window title; using post-title manipulation to trigger userChrome (css) styles

## Extension functionality

ⓘ Design stage 

- [x] drag and drop functionality (5/6/2025)
    - [x] rearranging of options or folders (drag drop) (5/5/2025)
    - [x] rearranging of options in folders (drag drop) (5/5/2025)
    - [x] adding options to a list of folders (+1 behavior) (drag drop) (5/5/2025)
    - [x] nesting of folders and options for organization of userchrome toggle's (5/5/2025)
    - [x] trigger notify to dragging last option outside of folder, proceed y/n (5/6/2025)
    - [x] safeguards (5/6/2025)
- [ ] custom context menu
    - [ ] delete folder or delete option (trigger notify to preserve internal options)
    - [ ] rename folder or rename option 
    - [ ] rename folder or rename option
    - [ ] toggle settings 
- [ ] settings panel design
    - [ ] settings ui
    - [ ] allow import of options & folders (html specific format)
    - [ ] allowing import of preset's (like presets for userChrome themes)
    - [ ] reset to default
    - [ ] color scheme management
    - [ ] save settings (applies to import, color schemes and future settings - folders and options are already saved on positioning)
- [x] custom notify library design (5/6/2025)
    - [x] notification ui (5/5/2025)
    - [x] input text functionality (5/65/2025)
    - [x] summon priority (query all siblings when .ucnotified to cease further manipulation until confirmation recieved) (5/6/2025)
    - [x] yes/no summoning (calling uc-notify across script functions to handle dynamic confirmations) (5/5/2025)
    - [x] dynamic summons (summon for verifications, summon for yes/no procs, summon for input/value exchanges, etc) (5/6/2025)
    - [x] yes/no procs binded to element interaction allowing custom sure/maybe, 1/2, y/n, developer heaven basically)  (5/6/2025)
    - [x] input-fiend proc grabs focus on summon (type and Enter) (5/6/2025)
    - [x] safeguards (5/6/2025)
    - [x] portability to other extensions (5/6/2025)
- [x] allowing dynamic layout's while maintaining fluid control over dom structure
- [ ] edit mode
    - [ ] edit mode, subtle ui
    - [ ] toggle edit mode
    - [ ] append delete/rename functions to options
- [ ] Visual Design (will progress over time)

ⓘ Usability stage

- [ ] toggle on/off application of all options via `Toggle userChrome`
- [ ] restoration of all options previously toggled off via `Toggle userChrome`
- [x] element identification filtering and organization
- [x] saving of options & folders *and* options in folders *and* folders in folders (position, dom structure, label preservation)
- [ ] toggle on/off application of individual option via mouse click
- [ ] saving of current toggle state of all options for domload
- [ ] import of preset's (options) through raw hosted html, like a raw file from a theme creators github page
- [ ] hotkey support

### May 6th

- [uc Notify](https://github.com/soulhotel/uc-notify) (Notification UI/UX kit) complete
- Tabs renamed to Folders (logical)
- Visual design adds subtle drop shadows. Blur background content on notify summons, spacing corrections

https://github.com/user-attachments/assets/ab77a259-33a2-4977-961f-14965a69f9a2

### (May 5th)

- Rough draft. Drag and drop mostly complete. Notification system needed extensive work.

https://github.com/user-attachments/assets/dd301064-e785-466d-ab76-1179ff0cfc65
