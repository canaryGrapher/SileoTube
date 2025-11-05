import { browser } from 'wxt/browser';
import { getSettings } from '../../storage';

/**
 * Listener for storage changes
 */
const storageChangeListener = async () => {
    browser.storage.onChanged.addListener(async () => {
        const tabs = await browser.tabs.query({ url: '*://*.youtube.com/*' });
        const settings = await getSettings();
        
        for (const tab of tabs) {
            if (!tab.id || !tab.url) continue;
            const pagePath = new URL(tab.url).pathname;
            try {
                await browser.tabs.sendMessage(tab.id, { 
                    type: 'SILEOTUBE:YOUTUBE PAGE UPDATED', 
                    settings, 
                    path: pagePath 
                });
            } catch (error) {
                // Content script may not be ready yet, or tab is navigating
                // This is expected and can be safely ignored
                console.debug('Could not send message to tab', tab.id, error);
            }
        }
    });
}

export { storageChangeListener };   