// Background service worker for MV3 (cross-browser)
// Permissions usage:
// - tabs: used for listening to updates (onUpdated), muting/unmuting shorts tabs,
//         querying YouTube tabs, and sending messages to content scripts.
// - storage: accessed via utils/storage for default settings, updates, and change listeners.
// - scripting: not directly used here (no calls to scripting API).
// - webNavigation: not directly used here (we rely on tabs.onUpdated and URL parsing).
import browser from 'webextension-polyfill'
import { getSettings, initializeSettings, setupStorageListener, updateSetting } from '../../utils/storage'
import { pathResolver, waitForContentScript } from './utils'

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

let lastPath = '';

// Listen for tab updates to detect YouTube URL changes and alert the new page path
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Only proceed if the tab has a URL and it's a YouTube page
    if (tab.url && tab.url.includes('youtube.com')) {
        // Handle both URL changes and page completion (for initial loads)
        if (changeInfo.url || changeInfo.status === 'complete') {
            const urlToProcess = changeInfo.url || tab.url;
            let path = "unsupported"
            let enabled = false;
            console.log('Processing URL: ', urlToProcess);

            // Get current settings from storage
            const settings = await getSettings();

            try {
                const urlObj = new URL(urlToProcess);
                const { _path, _enabled } = pathResolver(urlObj, settings);
                path = _path;
                enabled = _enabled;

            } catch (e) {
                path = 'unsupported';
            }
            if (lastPath === path) return;
            lastPath = path;
            console.log('YOUTUBE_PATH_CHANGED: ', path);
            // Wait for content script to be ready, then send message
            waitForContentScript(tabId).then((isReady) => {
                if (isReady) {
                    // Mute the tab if page is shorts and is enabled
                    if (path === '/shorts' && settings.pages.shorts) {
                        browser.tabs.update(tabId, { muted: true });
                    } 
                    // otherwise undo it
                    else if (path === '/shorts' && !settings.pages.shorts) {
                        browser.tabs.update(tabId, { muted: false });
                    }
                    browser.tabs.sendMessage(tabId, {
                        type: 'YOUTUBE_PATH_CHANGED',
                        path: path,
                        enabled: enabled,
                        features: settings.features
                    }).catch(() => {
                        console.log('Failed to send message to tab:', tabId);
                    });
                } else {
                    console.log('Content script never became ready for tab:', tabId);
                }
            });
        }
    }
});

// Listen for messages from popup to control content scripts
browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
    // Handle PING from content scripts
    if (message.type === 'PONG') {
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
                        console.log("Type of message: ", feature);
                        console.log("Enabled: ", enabled);
                        console.log('2. Content script not ready for toggle on tab:', tab.id);
                    });
                }
            });
        });

        sendResponse({ success: true });
    }

    // Handle settings updates from popup
    if (message && message.type === 'SETTINGS_UPDATED') {

        console.log('message: ', message);
        console.log('Settings updated:', message.settings);
        // Dispatch custom event to notify other content scripts
        const tabId = message.tabId;
        const currentPageURL = window.location.href;
        let path = 'unsupported';
        let enabled = false;
        const { _path, _enabled } = pathResolver(new URL(currentPageURL), message.settings);
        path = _path;
        enabled = _enabled;
        browser.tabs.sendMessage(tabId, {
            type: 'YOUTUBE_PATH_CHANGED',
            path: path,
            enabled: enabled,
            features: message.settings.features
        });
    }

    return true; // Keep message channel open for async responses
});


