## Presets:

ⓘ Presets can be fetched globally via raw text files `Import @` or via local files `Import File`

## Preset Format:

ⓘ Any simple text file can be parsed into options, so long as you follow the correct format.

https://github.com/soulhotel/userChrome-Companion/blob/c7d816ffffa1f386ae0999ef9079b9374fdfbe0d/presets/preset-example#L1-L4

0. Order does not matter.
1. Options should start as the character, then a `space`, then a description of the option
   - `(option)(space(description)` becomes
   - `🌀 an example of an option` becomes
   - `🌙 Turn on Dark Theme` this is an option
2. Folders should start as a declaration, then the Folders name
   - `Folder: An Example of a Folder` becomes
   - `Folder: Folder Name` becomes
   - `Folder Name` this is a folder
3. The options inside of a folder are recognized by indentation (white space)
```
Folder: Folder 1
  🌀 an example of an option
  🌀 options inside of folders are indented 
```
4. Again, you are not limited by order. You can add options first, then folders with options, then more options, or just options, just 1, etc.
