document.addEventListener('DOMContentLoaded', async () => {
    const styleId = 'injected-sidebar-style';

    // Ensure default CSS is saved on first run
    const result = await browser.storage.local.get('modifiedSidebarCSS');
    if (!result.modifiedSidebarCSS) {
        const originalCSS = await fetch(browser.runtime.getURL('css/sidebar.css')).then(r => r.text());
        await browser.storage.local.set({ modifiedSidebarCSS: originalCSS });
    }

    // Load, inject, and populate CSS settings
    const cssText = (await browser.storage.local.get('modifiedSidebarCSS')).modifiedSidebarCSS;
    injectCSS(cssText);
    populateCSSInputs(cssText);

    // Save button handler
    document.querySelector('.uc-settings-css-save').addEventListener('click', async () => {
        const updatedCSSText = await applyInputChangesToCSS();
        await browser.storage.local.set({ modifiedSidebarCSS: updatedCSSText });
        injectCSS(updatedCSSText);
        populateCSSInputs(updatedCSSText);
    });

    // Reset button handler
    document.querySelector('.uc-settings-css-reset').addEventListener('click', async () => {
        await browser.storage.local.remove('modifiedSidebarCSS');
        const originalCSS = await fetch(browser.runtime.getURL('css/sidebar.css')).then(r => r.text());
        await browser.storage.local.set({ modifiedSidebarCSS: originalCSS });
        injectCSS(originalCSS);
        populateCSSInputs(originalCSS);
    });

    // Inject CSS as a <style> tag to override sidebar.css
    function injectCSS(css) {
        let style = document.getElementById(styleId);
        if (style) style.remove();

        style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Parse CSS variables from different blocks and update input fields
    function populateCSSInputs(cssText) {
        const darkVars = extractCSSVars(cssText, 'dark');
        const lightVars = extractCSSVars(cssText, 'light');
        const rootVars = extractCSSVars(cssText, 'root');
        document.querySelectorAll('.uc-css-input, .uc-css-input-dark, .uc-css-input-light').forEach(input => {
            const varName = input.dataset.var;
            const classList = input.classList;
            if (classList.contains('uc-css-input-dark')) {
                if (darkVars[varName]) input.value = darkVars[varName];
            } else if (classList.contains('uc-css-input-light')) {
                if (lightVars[varName]) input.value = lightVars[varName];
            } else {
                if (rootVars[varName]) input.value = rootVars[varName];
            }
        });
    }

    // Extract CSS variables for a specific block
    function extractCSSVars(cssText, mode) {
        let block;
        if (mode === 'dark') {
            const match = cssText.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*{([\s\S]*?)}/);
            block = match?.[1] || '';
        } else if (mode === 'light') {
            const match = cssText.match(/@media\s*\(prefers-color-scheme:\s*light\)\s*{([\s\S]*?)}/);
            block = match?.[1] || '';
        } else {
            const matches = cssText.match(/:root\s*{([\s\S]*?)}/g) || [];
            block = matches.map(m => m.match(/{([\s\S]*?)}/)?.[1]).join('\n');
        }

        const vars = {};
        block.replace(/--[\w-]+\s*:\s*[^;]+;/g, line => {
            const [key, value] = line.split(':').map(s => s.trim().replace(/;$/, ''));
            vars[key] = value;
        });

        return vars;
    }

    // Collect input values and apply them to modified CSS text
    async function applyInputChangesToCSS() {
        let cssText = (await browser.storage.local.get('modifiedSidebarCSS')).modifiedSidebarCSS;

        const blocks = {
            root: extractBlock(cssText, 'root'),
            dark: extractBlock(cssText, 'dark'),
            light: extractBlock(cssText, 'light')
        };

        document.querySelectorAll('.uc-css-input, .uc-css-input-dark, .uc-css-input-light').forEach(input => {
            const key = input.dataset.var;
            const val = input.value.trim();
            const target = input.classList.contains('uc-css-input-dark') ? 'dark' :
                           input.classList.contains('uc-css-input-light') ? 'light' : 'root';
            blocks[target] = updateCSSVariable(blocks[target], key, val);
        });

        return rebuildCSS(cssText, blocks);
    }

    // Extract specific block content from full CSS
    function extractBlock(cssText, type) {
        if (type === 'root') {
            const matches = cssText.match(/:root\s*{([\s\S]*?)}/g) || [];
            return matches.map(m => m.match(/{([\s\S]*?)}/)?.[1]).join('\n') || '';
        }

        const re = type === 'dark'
            ? /@media\s*\(prefers-color-scheme:\s*dark\)\s*{([\s\S]*?)}/
            : /@media\s*\(prefers-color-scheme:\s*light\)\s*{([\s\S]*?)}/;

        return cssText.match(re)?.[1] || '';
    }

    // Replace or add a CSS variable line
    function updateCSSVariable(block, key, value) {
        const re = new RegExp(`(--${key}\\s*:\\s*)([^;]+)(;)`);
        if (block.match(re)) {
            return block.replace(re, `$1${value}$3`);
        } else {
            return block + `\n    ${key}: ${value};`;
        }
    }

    // Rebuild full CSS from updated blocks
    function rebuildCSS(originalCSS, updatedBlocks) {
        const newRoot = `:root {\n${updatedBlocks.root.trim()}\n}`;
        const newDark = `@media (prefers-color-scheme: dark) {\n${updatedBlocks.dark.trim()}\n}`;
        const newLight = `@media (prefers-color-scheme: light) {\n${updatedBlocks.light.trim()}\n}`;

        return `${newRoot}\n\n${newDark}\n\n${newLight}`;
    }

});

