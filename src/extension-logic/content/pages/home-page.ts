// Homepage distraction remover plain JS content script


// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {

    const applyStyles = () => {
      const _style = document.getElementById('sileotube-homepage-focus');
      if (_style) _style.remove();

      const sileotubeStyles = document.createElement('style')
      sileotubeStyles.id = 'sileotube-homepage-focus'
      sileotubeStyles.textContent = `
              ytd-rich-item-renderer {
                display: none;
              }
              ytd-ghost-grid-renderer {
                display: none;
              }
              ytd-continuation-item-renderer {
                display: none;
              }
              ytd-rich-section-renderer {
                display: none;
              }
              #header {
                display: none;
              }
              body > ytd-app { 
                background-color: #3C3C3C;
                min-height: 100vh;
                position: relative;
              }
              #frosted-glass {
                display: none;
              }
              /*
              #masthead > #container {
                position: absolute;
                width: 100%;
              }
              
              #masthead > #container > #center {
                visibility: hidden;
              }
              */
            `
      document.documentElement.appendChild(sileotubeStyles)
      return;
    }

    const removeStyles = () => {
      const _style = document.getElementById('sileotube-homepage-focus');
      if (_style) _style.remove();
      return;
    }
    // Handle PING from background script
    if (msg && msg.type === 'PING') {
      sendResponse({ type: 'PONG' });
      return true;
    }
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
      if (msg.path === '/') {
        // If enabled and style is not in the document, inject the style
        if (msg.enabled) {
          applyStyles();
        }
        // If disabled and style is in the document, remove the style
        else {
          removeStyles();
        }
      } else {
        removeStyles();
      }
    }
  });
})();
