import { browser } from 'wxt/browser';
import { getSettings } from '../../storage/storageHandler';

const tabReloadListener = () => {
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if(tab.url && tab.url.includes('youtube.com')) {
            if(changeInfo.status === 'complete' || changeInfo.url) {
                // send message to content script
                console.log("Sending message to content script");
                const pagePath = new URL(tab.url).pathname;
                try {
                    await browser.tabs.sendMessage(tabId, { 
                        type: 'SILEOTUBE:YOUTUBE PAGE UPDATED', 
                        settings: await getSettings(), 
                        path: pagePath 
                    });
                } catch (error) {
                    // Content script may not be ready yet, or tab is navigating
                    // This is expected and can be safely ignored
                    console.debug('Could not send message to tab', tabId, error);
                }
            }
        }
    });
}

export { tabReloadListener };