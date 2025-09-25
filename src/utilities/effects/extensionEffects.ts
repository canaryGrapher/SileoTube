import browser from 'webextension-polyfill'

/**
 * Handles side effects when extension enable/disable state changes
 * Manages content script injection and removal based on extension state
 */
export function handleExtensionToggle(isEnabled: boolean) {
  if (isEnabled) {
    // Inject content script to start modifying YouTube
    browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
      tabs.forEach((tab) => {
        alert(JSON.stringify(tab))
        if (tab.id) {
          browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          }).catch(() => {
            // Content script already injected or tab not accessible
            alert('Content script already injected or tab not accessible')
          })
        }
      })
    })
  } else {
    // Remove content script modifications
    browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.tabs.sendMessage(tab.id, { action: 'disableExtension' }).catch(() => {
            // Tab not accessible or no content script
          })
        }
      })
    })
  }
}
