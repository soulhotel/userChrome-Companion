# Global files

Global files mostly (not entirely) serve to communicate with userChromeCompanionSupport.uc.js, the extension itself does not escape its isolated environment. Instead it simply emits event messages, while the userChromeJS side watches the extension and reacts to those messages. This is what gives us our privileged level of operation without violating Firefox safety policies.

### Bit of an explanation on events

In the case of privileged access to Firefox Internals.. The extension simply broadcast events to itself. It's up to the userChromeJS side to (window actor) reach in and react to said events. Those reactions either serve as an action for the userChromeJS side or serve as a response for the extension side.

uccPing is used to discover the userChromeJS sides existence (ucc.bridge.uc.js)
uccSupportConnected confirms the connection nd triggers reconciliation
uccPrefChanged reports individual preference changes
uccSetPrefs sends preference value updates
uccDeletePrefs sends preference removal updates (or reset to default state for preferences native to Firefox)