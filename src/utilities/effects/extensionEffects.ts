import browser from 'webextension-polyfill'

/**
 * Handles side effects when extension enable/disable state changes
 * Manages content script injection and removal based on extension state
 */
export function handleExtensionToggle(isEnabled: boolean) {
  // alert('handleExtensionToggle called with isEnabled: ' + isEnabled)
  if (isEnabled) {
    // Inject content script to start modifying YouTube
    browser.tabs.query({ url: '*://*.youtube.com/' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const calmTubeStyles = document.createElement('style')
              calmTubeStyles.id = 'calmtube-styles'
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
                #masthead > #container {
                  position: absolute;
                  width: 100%;
                }
                #masthead > #container > #center {
                  visibility: hidden;
                }
              ` 
              document.documentElement.appendChild(calmTubeStyles)
            }
          })
        }
      })
    }).catch(() => {
      // Content script already injected or tab not accessible
      alert('Content script already injected or tab not accessible')
    })
  }
  else {
    // Remove content script modifications
    browser.tabs.query({ url: '*://*.youtube.com/' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const calmTubeStyles = document.getElementById('calmtube-styles')
              if (calmTubeStyles) {
                calmTubeStyles.remove()
              }
            }
          })
            .catch(() => {
              // Content script already injected or tab not accessible
              alert('Content script already injected or tab not accessible')
            })
        }
      })
    })
  }
}