import browser from 'webextension-polyfill'

/**
 * Handles side effects when dimmed lights mode changes
 * Applies or removes dimming overlay to YouTube interface
 */
export function handleDimmingToggle(isDimmed: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/watch*' }).then((tabs) => {
    tabs.forEach(async (tab) => {
      if (!tab.id) return
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (dimmed: boolean) => {
            if (dimmed) {
              const calmTubeDimmerRemoveStyles = document.createElement('style')
              calmTubeDimmerRemoveStyles.id = 'calmtube-dimmer-remove-styles'
              calmTubeDimmerRemoveStyles.textContent = `
                #secondary {
                  display: none;
                }
              `
              document.documentElement.appendChild(calmTubeDimmerRemoveStyles)
            } else {
              const calmTubeDimmerRemoveStyles = document.getElementById('calmtube-dimmer-remove-styles')
              if (calmTubeDimmerRemoveStyles instanceof HTMLElement)
                calmTubeDimmerRemoveStyles.remove()
            }
          },
          args: [isDimmed]
        })
      } catch {}
    })
  })
}
