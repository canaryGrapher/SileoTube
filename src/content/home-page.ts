// Homepage distraction remover plain JS content script
// - 1: check if msg.path is /
// - 2: check if storage.local.get('settings').home is true
// - 3: check if style.id is already in the document
// - if 2 is true and 3 is false, then inject code to remove distractions
// - if 2 is false, then remove the style.id from the document if 3 is true

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED' && msg.path === '/') {
      const style = document.getElementById('calmtube-homepage-focus');
      if (msg.enabled && !style) {
        const calmTubeStyles = document.createElement('style')
        calmTubeStyles.id = 'calmtube-homepage-focus'
        calmTubeStyles.textContent = `
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
                  background-image: url('https://images.pexels.com/photos/326235/pexels-photo-326235.jpeg');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
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
        document.documentElement.appendChild(calmTubeStyles)
        console.log('calmtube-homepage-focus injected');
        return;
      }
      else if (!msg.enabled && style) {
        style.remove();
        console.log('calmtube-homepage-focus removed');
        return;
      }
      else {
        return;
      }
    } else if (msg && msg.type === 'YOUTUBE_PATH_CHANGED' && msg.path !== '/') {
      const style = document.getElementById('calmtube-homepage-focus');
      if (style) {
        style.remove();
        console.log('calmtube-homepage-focus removed');
        return;
      }
    }
  });
})();