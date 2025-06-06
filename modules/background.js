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
    const stored = await browser.storage.local.get("uc-toggled-currently");
    const toggled = stored["uc-toggled-currently"] || [];
    const toggledPrefix = toggled.join(" ");

    await browser.windows.update(win.id, {
        titlePreface: toggledPrefix + " "
    });
});

browser.runtime.onStartup.addListener(async () => {
    const stored = await browser.storage.local.get("uc-toggled-currently");
    const toggled = stored["uc-toggled-currently"] || [];
    const toggledPrefix = toggled.join(" ");
    updateAllWindowTitles(toggledPrefix); // No need to await here
});