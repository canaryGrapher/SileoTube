// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;

  const applyStyles = () => {
    const _style = document.getElementById('sileotube-watch-page-focus');
    if (_style) _style.remove();

    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-watch-page-focus'
    sileotubeStyles.textContent = `
    #secondary {
      display: none;
    }
  `
    document.documentElement.appendChild(sileotubeStyles)
  }

  // Remove styles from the watch page
  const removeStyles = () => {
    const style = document.getElementById('sileotube-watch-page-focus');
    if (style) style.remove();
  }

  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
    // Handle PING from background script
    if (msg && msg.type === 'PING') {
      sendResponse({ type: 'PONG' });
      return true;
    }

    // Handle /watch path
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
      if (msg.path === '/watch') {
        // If enabled and style is not in the document, inject the style
        if (msg.enabled) {
          applyStyles();
        }
        // If disabled and style is in the document, remove the style
        else {
          removeStyles();
        }
      }
      // If not /watch path, remove the style if it exists
      else {
        setTimeout(() => {
          removeStyles();
        }, 500);
      }
    }
  });
})();