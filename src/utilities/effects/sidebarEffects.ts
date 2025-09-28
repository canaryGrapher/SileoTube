import browser from 'webextension-polyfill'

/**
 * Handles side effects when sidebar hide/show state changes
 * Sends message to content script to toggle sidebar visibility
 */
export function handleSidebarToggle(isHidden: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach(async (tab) => {
      if (!tab.id) return
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (hidden: boolean) => {
            // Call the main function from actions.js
            if (typeof window !== 'undefined' && (window as any).main) {
              (window as any).main(hidden ? 'addLayer' : 'removeLayer')
            }
          },
          args: [isHidden]
        })
      } catch {}
    })
  })
}
