import browser from 'webextension-polyfill';
// Permissions usage in this module:
// - storage: uses browser.storage.local.get/set to persist extension settings
// - tabs: used indirectly to notify YouTube tabs on settings changes
import { changeListener } from '../extension-logic/background/listeners';

export interface ExtensionSettings {
    pages: {
        homepage: boolean;
        shorts: boolean;
        watch: boolean;
    };
    features: {
        watchComments: boolean;
        sidebarRemoval: boolean;
        shortsRecommendations: boolean;
    };
}

const DEFAULT_SETTINGS: ExtensionSettings = {
    pages: {
        homepage: true,
        shorts: true,
        watch: true,
    },
    features: {
        watchComments: false,
        sidebarRemoval: false,
        shortsRecommendations: true,
    }
};

/**
 * Get current extension settings from storage
 * Returns default settings if none exist
 */
export const getSettings = async (): Promise<ExtensionSettings> => {
    try {
        const data = await browser.storage.local.get("extensionSettings");
        return (data.extensionSettings as ExtensionSettings) || DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error getting settings:', error);
        return DEFAULT_SETTINGS;
    }
};

/**
 * Save extension settings to storage
 */
export const setSettings = async (settings: ExtensionSettings): Promise<void> => {
    try {
        await browser.storage.local.set({ extensionSettings: settings });
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
};

/**
 * Update a specific setting value
 */
export const updateSetting = async (
    category: keyof ExtensionSettings,
    key: string,
    value: boolean
): Promise<void> => {
    try {
        const currentSettings = await getSettings();
        const newSettings = {
            ...currentSettings,
            [category]: {
                ...currentSettings[category],
                [key]: value
            }
        };
        await setSettings(newSettings);
    } catch (error) {
        console.error('Error updating setting:', error);
        throw error;
    }
};

/**
 * Initialize default settings on first installation
 */
export const initializeSettings = async (): Promise<void> => {
    try {
        const existingSettings = await browser.storage.local.get("extensionSettings");
        if (!existingSettings.extensionSettings) {
            await setSettings(DEFAULT_SETTINGS);
            console.log('Initialized default extension settings');
        }
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
};

/**
 * Listen for storage changes and notify content scripts
 */
export const setupStorageListener = (): void => {
    browser.storage.onChanged.addListener((changes) => {
        if (changes.extensionSettings) {
            console.log('Settings changed, notifying all YouTube tabs:', changes.extensionSettings);
            // Notify all YouTube tabs about settings change
            browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs) => {
                tabs.forEach((tab) => {
                    if (tab.id && tab.url) {
                        console.log('Processing settings update for tab:', tab.id, tab.url);
                        changeListener({
                            type: 'APPLY_CHANGES',
                            tabId: tab.id as number,
                            pageUrl: tab.url as string,
                        }, { tab: { id: tab.id as number } }, () => { });
                    }
                });
            });
        }
    });
};