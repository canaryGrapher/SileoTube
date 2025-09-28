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
              const searchBox = document.querySelector('#center');
              const rightArrow = document.querySelector("#right-arrow")
              const contentsChildren = document.querySelectorAll('#contents *')
              const recommendationContent = document.querySelector("#contents")

              if (searchBox instanceof HTMLElement) {
                // hide the right arrow
                if (rightArrow instanceof HTMLElement) rightArrow.style.display = 'none';
                
                // select all children of div #contents and hide them
                contentsChildren.forEach((childElement) => {
                  if (childElement instanceof HTMLElement) childElement.style.display = 'none';
                });

                // Move the element itself to div #contents
                recommendationContent?.appendChild(searchBox);
                // Center the search box and set it to absolute
                Object.assign(searchBox.style, {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '9999',
                  width: '50%'
                });
              }
            }
          }).catch(() => {
            // Content script already injected or tab not accessible
            alert('Content script already injected or tab not accessible')
          })
        }
      })
    })
  } else {
    // Remove content script modifications
    browser.tabs.query({ url: '*://*.youtube.com/' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const recommendationSection = document.querySelector("#primary > ytd-rich-grid-renderer");
              if (recommendationSection instanceof HTMLElement) recommendationSection.style.display = 'grid';
            }
          }).catch(() => {
            // Content script already injected or tab not accessible
            alert('Content script already injected or tab not accessible')
          })
        }
      })
    })
  }
}