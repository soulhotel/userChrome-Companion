# <p align="center">A userChrome Companion . . </p>

###### <p align="center">. . Firefox Extension to toggle & manage multiple userChrome styles</p>

<div align="center">
    
[![Firefox](https://img.shields.io/static/v1?label=%20&message=GET%20THE%20ADD-ON&color=FF7139&labelColor=555555&style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/userchrome-companion/) ![ALPHA | V0.5](https://img.shields.io/badge/ALPHA%20%7C%20V0.5-222222?style=for-the-badge&logo=github&logoColor=white&labelColor=555555) ![ALPHA | V0.5](https://img.shields.io/badge/ALPHA%20%7C%20V0.5-blueviolet?style=for-the-badge) 

</div>

https://github.com/user-attachments/assets/45e810a6-b4c3-42a6-b3d1-3cabc84aeca7

> This is userChrome Companion (current state as of 5/31/2025). If you're familiar with userchrome toggle.. this is my attempt at recreating it *from scratch* (with some qol adjustments).

## End Goal

ⓘ To append *any* character (🐱), or code (123) or trigger (~) to the Firefox Window; Mimicking the functionality of userChrome toggle without appending invisible (in your face characters) to the title preface; Using title manipulation to trigger userChrome (css) styles. First attempt was a failure.. So lets try this again.

## Functionality

If I turn on an "option" in userChrome Companion, like: `🐱 cat mode` and `🐶 dog mode`, this will add `+1` the option to the Firefoxs Window Title:

- `New Tab` in a Windows Title becomes,
- `New Tab 🐱 🐶`
> this does not effect a Tabs' label text, for anyone new to userchrome toggle
> 
And turning an option on via userChrome Companion, `🐱 cat mode` and `🐶 dog mode` can be communicated in userChrome.css, like:
```
:root[titlemodifier*="🐱"] {
    #navigator-toolbox {
        display: none !important;
    }
}
:root[titlemodifier*="🐶"]
    #urlbar {
        background-color: transparent !important;
    }
}
```
And obviously each option (`🐱 cat mode` or `🐶 dog mode`) can be parsed seperately or even together via the css, like:
```
/* both 🐱 🐶 present in title at the same time */
:root[titlemodifier*="🐱"][titlemodifier*="🐶"] {
    #navigator-toolbox {
        display: none !important;
    }
}

/* or */
:root[titlemodifier*="🐱 🐶"] {
    #navigator-toolbox {
        display: none !important;
    }
    #urlbar {
        background-color: transparent !important;
    }
}
```

> There is a possibility of changing this functionality to create/manipulate a single tab group as well. Setting the tabgroups's name based on toggled "options" (🐱🐶⬅️🔁) and using that to toggle userchrome styles with `:has`. Leaving window titles untouched. Maybe when the api is available..

I think the best part about this is that Theme Creators can share/use/import their own custom options by linking to it via github, like: 

[./presets/preset-example](https://github.com/soulhotel/userChrome-Companion/blob/main/presets/preset-example)

![preseturl](https://github.com/user-attachments/assets/f4a4129e-88c2-4e65-8c64-68a1f30a12e9)

> works with any raw text links (including github, raw.github, codeberg, codeberg/raw)

## Functionality Checklist

ⓘ Design stage 

> 5/30/2025. Mock up ready. Version bump to 0.1.

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
    - [ ] `6/2/2025` append hotkey button&function to the edit mode buttons
- [x] Visual Design (will progress over time) `5/30/2025` (it has progressed over time)
  - [x] Resize Handling - standard Sidebar width vs extremely small width `6/6/2025`

ⓘ Usability stage

> 5/31/2025. Alpha ready. Version bump to 0.5.

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
    - [ ] `Toggle userChrome` can be used as a recentlyToggled `on/off` switch, or a `Preset Chooser/Switcher`
- [x] saving of options & folders *and* options in folders *and* folders in folders (position, dom structure, label preservation) `5/6?/2025`
- [x] element identification filtering and organization `5/30?/2025`
- [x] Import/export of preset's (options) `6/5/2025`
    - [x] through copy/paste `5/31/2025`
    - [x] through raw url or text files `5/31/2025`
    - [x] Parsing format `5/31/2025`
    - [x] Proper handling of any exported, imported, dynamic save/load `6/5/2025`
- [ ] Import/export of preset's (toggles)
    - [ ] through copy/paste
    - [ ] through raw url or text files
    - [ ] Parsing format
    - [x] Proper handling of any exported, imported, dynamic save/load `6/5/2025`
- [ ] Full Import/export (options & toggles)
    - [ ] through copy/paste
    - [ ] through raw url or text files
    - [ ] Parsing format
    - [x] Proper handling of any exported, imported, dynamic save/load `6/5/2025`
- [ ] hotkey support (visually taking the place of the ON indicator)
- [x] [Wiki References](https://github.com/soulhotel/userChrome-Companion/wiki) `6/6/2025`

## Functionality/Progression Timeline

<details><summary>Click to expand</summary>

>

> I try to log all modifications here, the extension has only been worked on in the logged dates below.
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

A Sidebar Toolbar added to the bottom of options list. It includes a New Tab (option) button, New Folder button, and Edit Mode Button. Functionality of all three buttons are complete. New Tab & New Folder allows the creation of new options and folders through notify input. Edit Mode enters Sidebar State that allows quick renaming and deletion of options in the list. All functionality complete. Settings UI complete (with Presets, add to options, overwrite options, import @, import file, delete all options). Preset Testing done, adding options/folders via text parsed from files locally (like a .txt file), or globally (like a raw github link) complete.

Toggling on/off of individual options started. Save/load of toggle state started. Appending options character to Window Title started. `version bump to 0.5` (ready for userchrome toggling)

[./presets/readme](https://github.com/soulhotel/userChrome-Companion/blob/main/presets/readme.md)

https://github.com/soulhotel/userChrome-Companion/blob/b3165a4a04ec55848dd2c94544e266f83949c8ba/presets/preset-example#L1-L4

https://github.com/user-attachments/assets/45e810a6-b4c3-42a6-b3d1-3cabc84aeca7

```
06/05/2025 - 06/06/2025
```

Toggling logic seperated for UI toggling on/off state & titlepreface in window, Toggling logic centralized via syncing function (globally). Toggling and Syncing are now considerate of Sidebar states & changes (like: deletion of options, renaming, edit mode, sidebar open/close, firefox startup/window-creation). Safe guards in place. Limited access to Settings when edit mode is in progress. Limited access to toggles when edit mode is in progress. Added new Presets container for toggling options (toggle all, export toggles, import toggles), not functional yet. Added new `?` buttons, to help Users who may not understand Preset containers' buttons - it sends Users to a new & relevant userChrome Companion Wiki Page. Added a Resize helper module to assist .css with shrinking elements - for smaller than standard sidebar sizes. Code organization - I definitely feel like I'm learning js now.

Toggle userChrome button now toggles all options `on/off` by toggling a recentlyToggled list with a currentlyToggled list, persistent globally. Eventually the functionality of the button can be switched to do a different task: Opening a Preset Switcher to quickly pick a preset list of options that you want toggled `on/off`.

</details>

