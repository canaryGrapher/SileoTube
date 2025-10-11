// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  const removeComments = () => {
    const style = document.getElementById('sileotube-watch-page-comments-focus');

    if (style) {
      style.remove();
    }
    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-watch-page-comments-focus'
    sileotubeStyles.textContent = `
    .ytd-comments {
      display: none;
    }
  `
    document.documentElement.appendChild(sileotubeStyles)
  }

  const reapplyComments = () => {
    const style = document.getElementById('sileotube-watch-page-comments-focus');
    if (style) {
      style.remove();
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
      if (msg.path === '/watch') {
        // small delay to let SPA update DOM if needed

        // If enabled and style is not in the document, inject the style
        if (msg.features.watchComments) {
          removeComments();
        }
        else {
          reapplyComments()
        }
      } else {
        reapplyComments();
      }
    }
  });
})();