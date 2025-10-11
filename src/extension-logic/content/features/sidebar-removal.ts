// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
    const browser = (globalThis as any).browser || (globalThis as any).chrome;

    const removeSidebar = () => {
        const sileotubeStyles = document.createElement('style')
        sileotubeStyles.id = 'sileotube-sidebar-removal-focus'
        sileotubeStyles.textContent = `
            #guide {
                display: none;
            }
            #guide-button {
                display: none;
            }
            #page-manager {
                margin: 0;
            }
            #content > ytd-mini-guide-renderer {
                display: none;
            }
      `
        document.documentElement.appendChild(sileotubeStyles)
    }

    const reapplySidebar = () => {
        const sileotubeStyles = document.getElementById('sileotube-sidebar-removal-focus');
        if (sileotubeStyles) {
            sileotubeStyles.remove();
        }
    }

    // Listen to messages from background for URL changes or setting updates
    browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
        // Handle PING from background script
        if (msg && msg.type === 'PING') {
            sendResponse({ type: 'PONG' });
            return true;
        }
        if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
            // If enabled and style is not in the document, inject the style
            if (msg.features.sidebarRemoval) {
                removeSidebar();
            }
            // If disabled and style is in the document, remove the style
            else {
                reapplySidebar();
            }
        }
    });
})();