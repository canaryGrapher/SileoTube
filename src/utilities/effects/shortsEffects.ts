import browser from 'webextension-polyfill'

/**
 * Handles side effects when shorts blocking state changes
 * Blocks or unblocks YouTube Shorts from appearing in the interface
 */
export function handleShortsToggle(isBlocked: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          action: 'toggleShorts',
          blocked: isBlocked,
        }).catch(() => {
          // Tab not accessible or no content script
        })
      }
    })
  })
}
