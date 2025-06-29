<div align="center">

# This is userChrome Companion . .

###### . . a Firefox Extension to toggle & manage multiple userChrome styles

[![Firefox](https://img.shields.io/static/v1?label=%20&message=GET%20THE%20ADD-ON&color=FF7139&labelColor=555555&style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/userchrome-companion/) ![ALPHA | V0.7](https://img.shields.io/badge/ALPHA%20%7C%20V0.7-222222?style=for-the-badge&logo=github&logoColor=white&labelColor=555555) ![ALPHA | V0.7](https://img.shields.io/badge/ALPHA%20%7C%20V0.7-blueviolet?style=for-the-badge) 

https://github.com/user-attachments/assets/3aeadb12-dd2a-403b-a31f-0cb5784489ba
</div>
<div align="right">

###### Full 4k Video uncropped on [Youtube](https://www.youtube.com/watch?v=Mz7gmYP2_1A&list=PLTVs0Y4lTV56Kapji1pVjMsMqE6PAHwzl&index=1)
</div>

<!-- ----------------------------------------------------------------------------------------------------------------------------- -->

## End Goal

ⓘ To Toggle and Manage multiple userChrome styles

If you're familiar with [userChrome Toggle](https://addons.mozilla.org/en-US/firefox/addon/userchrome-toggle/). I attempted to recreate it from scratch (with some QOL adjustments).
By appending any character `🐱`, or code `123`, or trigger `~`, to the Firefox Window, userChrome styles can be communicated with via `userChrome Companion` ↔ `userChrome`.
Originally, I wanted to mimic `userChrome Toggle` but manipulate post-title or title-modifier instead; that fell through when i realized there was a lack of API for it.
But whatever.. As of *6/6/2025* userChrome Companion (alpha 0.6) is ready to use.


<!-- ----------------------------------------------------------------------------------------------------------------------------- -->


## Functionality

[Refer to Wiki](https://github.com/soulhotel/userChrome-Companion/wiki)

<!-- ----------------------------------------------------------------------------------------------------------------------------- -->


## Design Stage Progress

- [x] ⓘ Design Stage complete
    - Draft/Mock up created. Version bump to Alpha  0.1. `5/30/2025`
    - Design State complete. Version bump to Alpha 0.8. `6/19/2025`

<details><summary>Design Stage progress</summary>

- [x] drag and drop functionality `5/6/2025`
    - [x] rearranging of options or folders (drag drop) `5/5/2025`
    - [x] rearranging of options in folders (drag drop) `5/5/2025`
    - [x] adding options to a list of folders (+1 behavior) (drag drop) `5/5/2025`
    - [x] nesting of folders and options for organization of userchrome toggle's `5/5/2025`
    - [x] trigger notify to dragging last option outside of folder, proceed y/n `5/6/2025`
    - [x] safeguards `5/6/2025`
- [x] custom context menu `delayed` `6/19/2025`
    - [x] delete folder or delete option (trigger notify to preserve internal options) `6/18/2025`
    - [x] rename folder or rename option `6/19/2025`
    - [x] toggle settings `6/18/2025`
    - [x] add option to folder `6/19/2025`
    - [x] turn on/off toggles `6/18/2025`
- [x] settings panel design `5/30/2025`
    - [x] settings ui `5/30/2025`
    - [x] allow import of options & folders (html specific format) `5/30/2025` (simple text format is better)
    - [x] allowing import of preset's (like presets for userChrome themes) `5/30/2025`
    - [x] reset to default `5/30/2025`
    - [x] ~~color scheme management `delayed`~~
    - [x] Sidebar CSS - section to tweak sidebar appearance via internal css variables, colors, borders, shadows, etc. `6/13/2025`
- [x] custom module design [uc Notify](https://github.com/soulhotel/uc-notify) `5/6/2025` 
    - [x] notification ui `5/5/2025`
    - [x] input text functionality `5/5/2025`
    - [x] summon priority (query all siblings when .ucnotified to cease further manipulation until confirmation recieved) `5/6/2025`
    - [x] yes/no summoning (calling uc-notify across script functions to handle dynamic confirmations) `5/5/2025`
    - [x] dynamic summons (summon for verifications, summon for yes/no procs, summon for input/value exchanges, etc) `5/6/2025`
    - [x] yes/no procs binded to element interaction allowing custom sure/maybe, 1/2, y/n, developer heaven basically)  `5/6/2025`
    - [x] input focus grabbing on summon (type and Enter) `5/6/2025`
    - [x] safeguards `5/6/2025`
    - [x] portability (to other extensions) `5/6/2025`
- [x] allowing dynamic layout's while maintaining fluid control over dom structure
- [x] edit mode `5/30/2025`
    - [x] edit mode, subtle ui `5/30/2025`
    - [x] toggle edit mode `5/30/2025`
    - [x] append delete/rename functions to options `5/30/2025`
    - [x] ~~`6/2/2025` append hotkey button&function to the edit mode buttons `moved to usability state`~~
- [x] Visual Design (will progress over time) `5/30/2025` (it has progressed over time)
  - [x] Resize Handling - standard Sidebar width vs extremely small width `6/6/2025`

</details>


<!-- ----------------------------------------------------------------------------------------------------------------------------- -->


## Usability Stage Progress

- [ ] ⓘ Usability Stage complete
    - Main functionality started. Version bump to 0.5. `5/31/2025`

<details><summary>Usability Stage progress</summary>

- [x] Toggle `on/off` individual option(s) `5/31/2025` (double click, and single click ON indicator) 
    - [x] Handle window titles on new windows `5/31/2025`
    - [x] Handle window titles on firefox onStartup `6/5/2025`
    - [x] Handle visual toggles to UI (dom content loaded, entering/exiting edit mode, firefox startup) `6/5/2025`
    - [x] toggle states saved as "currentlyToggled" and "recentlyToggled" `6/5/2025`
    - [x] saving/restoring states (dom content loaded, entering/exiting edit mode, firefox startup) `6/5/2025`
    - [x] Safe guards to prevent corrupting of save (duplicates, bad format) `6/5/2025`
- [ ] Toggle States
    - [x] dynamic parsing of toggle state, when rearranged, saved, loaded `6/5/2025`
    - [x] `Toggle userChrome` works with recentlyToggled to toggle currentlyToggled on/off `6/6/2025`
    - [x] `Toggle userChrome` recentlyToggled state saved/restored `6/6/2025`
    - [x] `Toggle userChrome` can be used as a recentlyToggled `on/off` switch `6/6/2025`
    - [ ] `Toggle userChrome` can be switched to work as `Preset Chooser/Switcher` `delayed`
- [x] saving of options & folders *and* options in folders *and* folders in folders (position, dom structure, label preservation) `5/6?/2025`
- [x] element identification filtering and organization `5/30?/2025`
- [x] Import/export of preset's (options) `6/5/2025`
    - [x] through copy/paste `5/31/2025`
    - [x] through raw url or text files `5/31/2025`
    - [x] Parsing format `5/31/2025`
    - [x] Proper handling of any exported, imported, dynamic save/load `6/5/2025`
- [ ] Full Import/export (options & toggles) `this will be handled via the "Preset Chooser/Switcher"`
    - [ ] through copy/paste
    - [ ] through raw url or text files
    - [ ] Parsing format
    - [x] Proper handling of any exported, imported, dynamic save/load `6/5/2025`
- [ ] hotkey support (visually taking the place of the ON indicator) `delayed`
- [x] [Wiki References](https://github.com/soulhotel/userChrome-Companion/wiki) `6/6/2025`

</details>


<!-- ----------------------------------------------------------------------------------------------------------------------------- -->


## Progression Journal/Timeline

- Days worked on UC: 9
    - I try to journal progress here, with notes and video of progress

<details><summary>Progression Journal/Timeline</summary>

>
```
05/03/2025 - 05/05/2025 v0.1
```
A rough draft to start off the Design Stage. Drag and drop mostly complete. A notification's system is needed for dynamic messages and inputs. I may have went overboard.

https://github.com/user-attachments/assets/dd301064-e785-466d-ab76-1179ff0cfc65

```
05/06/2025
```
[uc Notify](https://github.com/soulhotel/uc-notify) (Notification UI/UX kit) completed. Tabs renamed to Folders (logical). And "options" look more like tabs. Visual design adds subtle drop shadows to the list of options. And background Sidebar content is blurred (visually) upon Notify summons to simulate focus. Spacing Corrections.

https://github.com/user-attachments/assets/ab77a259-33a2-4977-961f-14965a69f9a2

```
05/31/2025 v0.5
```
A Sidebar Toolbar added to the bottom of options list. It includes a New Tab (option) button, New Folder button, and Edit Mode Button. Functionality of all three buttons are complete. New Tab & New Folder allows the creation of new options and folders through notify input. Edit Mode enters Sidebar State that allows quick renaming and deletion of options in the list. All functionality complete. Settings UI complete (with Presets, add to options, overwrite options, import @, import file, delete all options). Preset Testing done, adding options/folders via text parsed from files locally (like a .txt file), or globally (like a raw github link) complete. Toggling on/off of individual options started. Save/load of toggle state started. Appending options character to Window Title started. `version bump to 0.5` (ready for userchrome toggling)

[./presets/readme](https://github.com/soulhotel/userChrome-Companion/blob/main/presets/readme.md)

https://github.com/soulhotel/userChrome-Companion/blob/b3165a4a04ec55848dd2c94544e266f83949c8ba/presets/preset-example#L1-L4

https://github.com/user-attachments/assets/45e810a6-b4c3-42a6-b3d1-3cabc84aeca7

```
06/05/2025 - 06/06/2025
```
Toggling logic seperated for UI toggling on/off state & titlepreface in window, Toggling logic centralized via syncing function (globally). Toggling and Syncing are now considerate of Sidebar states & changes (like: deletion of options, renaming, edit mode, sidebar open/close, firefox startup/window-creation). Safe guards in place. Limited access to Settings when edit mode is in progress. Limited access to toggles when edit mode is in progress. Added new Presets container for toggling options (toggle all, export toggles, import toggles), not functional yet. Added new `?` buttons, to help Users who may not understand Preset containers' buttons - it sends Users to a new & relevant userChrome Companion Wiki Page. Added a Resize helper module to assist .css with shrinking elements - for smaller than standard sidebar sizes. Code organization - I definitely feel like I'm learning js now. Toggle userChrome button now toggles all options `on/off` by toggling a recentlyToggled list with a currentlyToggled list, persistent globally. Eventually the functionality of the button can be switched to do a different task: Opening a Preset Switcher to quickly pick a preset list of options that you want toggled `on/off`.

Full 4k Video uncropped on [Youtube](https://www.youtube.com/watch?v=Mz7gmYP2_1A&list=PLTVs0Y4lTV56Kapji1pVjMsMqE6PAHwzl&index=1)

https://github.com/user-attachments/assets/3aeadb12-dd2a-403b-a31f-0cb5784489ba

```
06/12/2025
```
Well bug fixes & bug fixes. The add-on is now on the Mozilla store 🎉. Drag & drop takes into account every possible scenario, options from root to folder, from folder to folder, from folder to root, etc; Good. Toggling on/off states are showing as persistent accross dom loads and browser restarts, option orders show as persistent, class structure remains intact; Good. Logically, importing and exporting toggles seperately from options is starting to make less sense so I'm axing the idea from the usability stage. Instead focus on what comes next. A preset switcher `✨` (that can serve as a CSS layout switcher) allowing the User to click `Toggle userChrome` (or trigger via hotkey) to open a full screen window (full sidebar) and quickly choose from a list of saved "presets", with options already set to be toggled on/off. This preset switcher view can include the ability to fine tune their list of presets, etc. For another day. Version bump 0.6.

One last final touch for the night.. for the morning.. Mock draft of the final goal in `settings panel design` section of the Design Stage. Custom Sidebar CSS implementation:

https://github.com/user-attachments/assets/7d09a38a-15d3-410e-b3e6-7e4a77c4bae1

Version bump 0.6.1. Next Version bump will address in organize in source CSS documentation, then the two goals above will be worked on.

```
06/13/2025
```
The frustration in getting this working. After a while of figuring this out blindfolded.. settings-CSS.js now fully handles the ability to fully theme userChrome Companion's sidebar via the existing Variables. Persistance is good. Version bump to 0.7

https://github.com/user-attachments/assets/0a73f28b-ff07-435f-8b0d-46bf5b3da564

```
06/18/2025 - 06/19/2025
```
Settings CSS - `option height`, `toolbar button hover background`, & `settings height` are now controllable metrics. Custom context menu (right click menu) design started.

Context menu design finalized. Population of menu items, good. Consistent targetting, good.

Source has been organized a bit, the functions for the edit-module are now well defined so that they can be reused elsewhere (like the context menu). Functions for new option, new folder, and toggling have also been well defined for use in the context menu (example: Right click -> Toggle All ON, on a folder). Design Stage can be considered - Complete. Version bump to 0.8.

Completing this project relies on:
- Keybind functionality - 0.9
- Full Import/exports (with toggle states intact) (may require rethinking how I append elements between states) - 1.0
- A Preset Switcher (last priority) - x

</details>

