import browser from 'webextension-polyfill'

/**
 * Handles side effects when sidebar hide/show state changes
 * Sends message to content script to toggle sidebar visibility
 */
export function handleSidebarToggle(isHidden: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          action: 'toggleSidebar',
          hidden: isHidden,
        }).catch(() => {
          // Tab not accessible or no content script
        })
      }
    })
  })
}
