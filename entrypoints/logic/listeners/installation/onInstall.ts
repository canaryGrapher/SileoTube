import { browser } from 'wxt/browser';
import { initializeSettings } from '../../storage';
import { INSTALL_URL } from '../../data';

const installListener = () => {
    browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        console.log('Extension installed, initializing default settings');
        // setup default settings for the local storage by setting everything to false
        await initializeSettings();
        // Redirect to product page on install
        browser.tabs.create({ url: INSTALL_URL });
    }
});
}

export { installListener };