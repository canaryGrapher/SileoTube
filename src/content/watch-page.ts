// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED' && msg.path === '/watch') {
      // small delay to let SPA update DOM if needed
      const style = document.getElementById('calmtube-watch-page-focus');
      if (msg.enabled && !style) {
        const calmTubeStyles = document.createElement('style')
        calmTubeStyles.id = 'calmtube-watch-page-focus'
        calmTubeStyles.textContent = `
            ytd-video-renderer:has(a[href^="/shorts/"]) {
              display: none;
            }
        `
        document.documentElement.appendChild(calmTubeStyles)
      }
    }
  });
})();