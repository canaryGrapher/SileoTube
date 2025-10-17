// Background service worker for MV3 (cross-browser)
// Permissions usage:
// - tabs: used below for listening to tab updates (onUpdated), querying YouTube tabs,
//         sending messages to content scripts, and muting/unmuting tabs.
// - storage: accessed via utils/storage to persist and read extension settings.
// - scripting: not directly used here (no programmatic injection).
// - webNavigation: not directly used here (navigation events are inferred via tabs.onUpdated).
import browser from 'webextension-polyfill'
import { getSettings, initializeSettings, setupStorageListener, updateSetting } from '../utils/storage'
import { changeListener } from '../extension-logic/background/listeners'

// Initialize settings on startup
initializeSettings();
setupStorageListener();

// Handle extension installation
browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        console.log('Extension installed, initializing default settings');
        await initializeSettings();
    }
});

// Only in development: poll a timestamp file to trigger extension reloads
const isDevelopment =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'development');

if (isDevelopment) {
    const pollIntervalMs = 1000;
    let lastStamp = '';
    async function poll() {
        try {
            const res = await fetch(browser.runtime.getURL('reload.txt') + `?t=${Date.now()}`);
            if (res.ok) {
                const text = await res.text();
                if (lastStamp && lastStamp !== text) {
                    browser.runtime.reload();
                    return;
                }
                lastStamp = text;
            }
        } catch { }
        setTimeout(poll, pollIntervalMs);
    }
    poll();
}

// Listen for tab updates to detect YouTube URL changes and alert the new page path
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Only proceed if the tab has a URL and it's a YouTube page
    if (tab.url && tab.url.includes('youtube.com')) {
        // Handle both URL changes and page completion (for initial loads)
        if (changeInfo.url || changeInfo.status === 'complete') {
            const urlToProcess = changeInfo.url || tab.url;
            changeListener({
                type: 'APPLY_CHANGES',
                tabId,
                pageUrl: urlToProcess,
            }, { tab: { id: tabId } }, () => { });
        }
    }
});

// Listen for messages from popup to control content scripts
browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
    // Handle PONG from content scripts
    if (message.type === 'PONG') {
        console.log('Received PONG from content script on tab:', _sender.tab?.id);
        sendResponse({ success: true });
        return true;
    }

    // Handle CONTENT_SCRIPT_READY from content scripts
    if (message.type === 'CONTENT_SCRIPT_READY') {
        console.log('Content script is ready on tab:', _sender.tab?.id);
        sendResponse({ success: true });
        return true;
    }

    // Handle getting current settings
    if (message.type === 'GET_SETTINGS') {
        getSettings().then(settings => {
            sendResponse({ success: true, settings });
        }).catch((error: Error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }

    // Handle updating settings
    if (message.type === 'UPDATE_SETTING') {
        const { category, key, value } = message;
        updateSetting(category, key, value).then(() => {
            sendResponse({ success: true });
        }).catch((error: Error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }

    if (message.type === 'TOGGLE_FEATURE') {
        const { feature, enabled } = message;

        // Send toggle message to all YouTube tabs
        browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs: any) => {
            tabs.forEach((tab: any) => {
                if (tab.id) {
                    browser.tabs.sendMessage(tab.id, {
                        type: `TOGGLE_${feature.toUpperCase()}`,
                        enabled: enabled
                    }).catch(() => {
                        // Content script might not be ready, this is normal
                        console.log('1. Content script not ready for toggle on tab:', tab.id);
                    });
                }
            });
        });

        sendResponse({ success: true });
    }

    // Handle APPLY_CHANGES message using the imported listener
    if (message.type === 'APPLY_CHANGES') {
        changeListener(message, _sender, sendResponse);
        return true;
    }

    return true; // Keep message channel open for async responses
});


