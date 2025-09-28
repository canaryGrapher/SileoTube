import browser from 'webextension-polyfill'

/**
 * Handles side effects when shorts blocking state changes
 * Blocks or unblocks YouTube Shorts from appearing in the interface
 */
export function handleShortsToggle(isBlocked: boolean) {
  browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
    tabs.forEach(async (tab) => {
      if (!tab.id) return
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          func: (blocked: boolean) => {
            const STYLE_ID = 'calmtube-style-overrides'
            
            function getStyleTag(): HTMLStyleElement {
              let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
              if (!style) {
                style = document.createElement('style')
                style.id = STYLE_ID
                document.documentElement.appendChild(style)
              }
              return style
            }
            
            function setCssRules(css: string): void {
              const style = getStyleTag()
              style.textContent = css
            }
            
            const css = blocked
              ? `ytd-reel-shelf-renderer, ytd-reel-item-renderer, a[href*="/shorts"], ytd-mini-guide-entry-renderer[aria-label*="Shorts"] { display: none !important; }`
              : ''
            setCssRules(css)
          },
          args: [isBlocked]
        })
      } catch {}
    })
  })
}
