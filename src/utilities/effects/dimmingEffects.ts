import browser from 'webextension-polyfill'

/**
 * Handles side effects when dimmed lights mode changes
 * Applies or removes dimming overlay to YouTube interface
 */
export function handleDimmingToggle(isDimmed: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach(async (tab) => {
      if (!tab.id) return
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (dimmed: boolean) => {
            const DIMMER_ID = 'calmtube-dim-overlay'
            
            let overlay = document.getElementById(DIMMER_ID) as HTMLDivElement | null
            if (dimmed) {
              if (!overlay) {
                overlay = document.createElement('div')
                overlay.id = DIMMER_ID
                overlay.style.position = 'fixed'
                overlay.style.inset = '0'
                overlay.style.background = 'rgba(0,0,0,0.35)'
                overlay.style.pointerEvents = 'none'
                overlay.style.zIndex = '2147483646'
                document.documentElement.appendChild(overlay)
              }
            } else if (overlay && overlay.parentNode) {
              overlay.parentNode.removeChild(overlay)
            }
          },
          args: [isDimmed]
        })
      } catch {}
    })
  })
}
