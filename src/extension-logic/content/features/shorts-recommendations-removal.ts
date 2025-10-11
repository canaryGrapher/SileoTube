// Remove shorts recommendations from result page
// - 1: Check if msg.path is /results
// - 2: Check if storage.local.get('settings').result is true
// - 3: Check if style.id is already in the document
// - if 2 is true and 3 is false, then inject code to remove shorts recommendations
// - if 2 is false, then remove the style.id from the document if 3 is true

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;


  const removeShortsRecommendations = () => {
    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-shorts-recommendation-removal'
    sileotubeStyles.textContent = `
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
        ytd-reel-shelf-renderer {
          display: none;
        }
    `
    document.documentElement.appendChild(sileotubeStyles)
  }

  const reapplyShortsRecommendations = () => {
    const style = document.getElementById('sileotube-shorts-recommendation-removal');
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
      // If enabled and style is not in the document, inject the style
      if (msg.features.shortsRecommendations) {
        removeShortsRecommendations();
      }
      // If disabled and style is in the document, remove the style
      else {
        reapplyShortsRecommendations();
      }
    }
  });
})();


// document.querySelector("#contents > grid-shelf-view-model")