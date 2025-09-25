import browser from 'webextension-polyfill'

/**
 * Handles side effects when dimmed lights mode changes
 * Applies or removes dimming overlay to YouTube interface
 */
export function handleDimmingToggle(isDimmed: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          action: 'toggleDimming',
          dimmed: isDimmed,
        }).catch(() => {
          // Tab not accessible or no content script
        })
      }
    })
  })
}
