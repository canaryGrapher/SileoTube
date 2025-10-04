import browser from 'webextension-polyfill'

/**
 * Handles side effects when sidebar hide/show state changes
 * Sends message to content script to toggle sidebar visibility
 */
export function handleSidebarToggle(isHidden: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) return
      try {
        browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (hidden: boolean) => {
            if (hidden) {
              const calmTubeSidebarRemoveStyles = document.createElement('style')
              calmTubeSidebarRemoveStyles.id = 'calmtube-sidebar-remove-styles'
              calmTubeSidebarRemoveStyles.textContent = `
              #guide {
                display: none;
              }
              #guide-button {
                display: none;
              }
              #page-manager {
                margin: 0;
              }
              #content > ytd-mini-guide-renderer {
                  display: none;
                }
              `
              document.documentElement.appendChild(calmTubeSidebarRemoveStyles)

            } else {
              const calmTubeSidebarRemoveStyles = document.getElementById('calmtube-sidebar-remove-styles')
              if (calmTubeSidebarRemoveStyles instanceof HTMLElement)
                calmTubeSidebarRemoveStyles.remove()
            }

          },
          args: [isHidden]
        })
      } catch { }
    })
  })
}
