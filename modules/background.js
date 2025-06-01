async function updateAllWindowTitles(toggledPrefix) {
    const windows = await browser.windows.getAll({ populate: true });
    for (const win of windows) {
        await browser.windows.update(win.id, {
            titlePreface: toggledPrefix + " "
        });
    }
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "updateWindowTitles") {
        updateAllWindowTitles(message.toggledPrefix);
    }
});

browser.windows.onCreated.addListener(async (win) => {
    // Read toggled from storage, fallback to empty array
    const stored = await browser.storage.local.get("uc-options-toggled");
    const toggled = stored["uc-options-toggled"] || [];
    const toggledPrefix = toggled.join(" ");

    await browser.windows.update(win.id, {
        titlePreface: toggledPrefix + " "
    });
});
