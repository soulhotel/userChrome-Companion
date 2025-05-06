## userChrome Companion
ⓘ Toggle userChrome styles through text - Firefox Extension


https://github.com/user-attachments/assets/dd301064-e785-466d-ab76-1179ff0cfc65


## End Goal:

ⓘ To append *any* character to the <ins>end</ins> of the Firefox Window. This allows the use of user chrome toggle functionality without appending invisible (in your face characters) to the firefox window title

- [ ] whether emoji (🟢) or letter (e) or code (91210)
- [ ] using the post title to trigger css styles


## Extension functionality

ⓘ Design stage 

- [x] rearranging of options or tabs (drag drop)
- [x] rearranging of options in tabs (drag drop)
- [x] adding options to a list of tabs (+1 behavior) (drag drop) 
- [x] nesting of tabs and options for organization of userchrome toggle's
- [ ] custom context menu
    - [ ] delete tab or delete option (trigger notify to preserve internal options)
    - [ ] rename tab or rename option 
    - [ ] rename tab or rename option
    - [ ] toggle settings 
- [ ] settings panel design
    - [ ] settings ui
    - [ ] allow import of options & tabs (html specific format)
    - [ ] allowing import of preset's (like presets for userChrome themes)
    - [ ] reset to default
    - [ ] color scheme management
    - [ ] save settings (applies to import, color schemes and future settings - tabs and options are already saved on positioning)
- [ ] custom notify library design
    - [x] notification ui
    - [x] input text functionality
    - [x] yes/no summoning (calling uc-notify across script functions to handle dynamic confirmations)
    - [x] summon priority (query all siblings when .ucnotified to cease further manipulation until confirmation recieved)
    - [x] dynamic summons (summon for verifications, summon for yes/no procs, summon for input/value exchanges,, etc)
- [x] allowing dynamic layout's while maintaining fluid control over dom structure
- [ ] edit mode
    - [ ] edit mode, subtle ui
    - [ ] toggle edit mode
    - [ ] append delete/rename functions to options

ⓘ Usability stage

- [ ] toggle on/off application of all options via `Toggle userChrome`
- [ ] restoration of all options previously toggled off via `Toggle userChrome`
- [x] element identification filtering and organization
- [x] saving of options & tabs *and* options in tabs *and* tabs in tabs (position, dom structure, label preservation)
- [ ] toggle on/off application of individual option via mouse click
- [ ] saving of current toggle state of all options for domload
- [ ] import of preset's (options) through raw hosted html, like a raw file from a theme creators github page
- [ ] hotkey support
  
