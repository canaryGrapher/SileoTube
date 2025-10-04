// Remove shorts recommendations from result page
// - 1: Check if msg.path is /results
// - 2: Check if storage.local.get('settings').result is true
// - 3: Check if style.id is already in the document
// - if 2 is true and 3 is false, then inject code to remove shorts recommendations
// - if 2 is false, then remove the style.id from the document if 3 is true

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;

  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
      // small delay to let SPA update DOM if needed
      const style = document.getElementById('calmtube-result-page-focus');
      if (msg.enabled && !style) {
        const calmTubeStyles = document.createElement('style')
        calmTubeStyles.id = 'calmtube-result-page-focus'
        calmTubeStyles.textContent = `
            #contents > grid-shelf-view-model { 
              display: none; 
            }
            ytd-video-renderer:has(a[href^="/shorts/"]) {
              display: none;
            }
            #items > ytd-mini-guide-entry-renderer[aria-label='Shorts'] {
              display: none;
            }
            ytd-rich-section-renderer {
              display: none;
            }
            #contents > ytd-reel-shelf-renderer {
              display: none;
            }
        `
        document.documentElement.appendChild(calmTubeStyles)
      }
      else if (!msg.enabled && style) {
        style.remove();
      }
    }
  });
})();


// document.querySelector("#contents > grid-shelf-view-model")