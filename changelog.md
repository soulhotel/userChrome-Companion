# Version History

### <ins>userChrome Companion 1.0</ins>

userChrome Companion has been completely refactored.
1. Base is now built on React.
2. Functionality has been massively expanded, both in Preset Management and it's overall purposes approach.
3. [titlepreface] toggling has been axed for a more extensive preference toggling approach.
4. userChrome.js support allows preference toggling similar to about:config.
5. Support extends to user.js compatibility, with ucc.json being the preferable format options lists.
6. Preset Management becomes the core workflow when managing list of options. Just as a theme developer would distribute a user.js with custom preferences, presets are what once would be user.js.
- Theme developers can depend on the extension to consistently toggle userChrome themes/styles via [titlepreface] appendage
- A lot has changed so this 1.0 is basically a fresh start.

### <ins>userChrome Companion 0.8</ins>

- 6/13 - Sidebar CSS - `option height` & `toolbar button hover background` are now a controllable metric
