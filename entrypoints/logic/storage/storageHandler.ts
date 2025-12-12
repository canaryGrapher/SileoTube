// Permissions usage in this module:
// - storage: uses browser.storage.local.get/set to persist extension settings
// - tabs: used indirectly to notify YouTube tabs on settings changes
import { browser } from 'wxt/browser';
import { DEFAULT_SETTINGS } from '../data';

import { ExtensionSettings } from '../types';

/**
 * Get current extension settings from storage
 * Returns default settings if none exist
 */
const getSettings = async (): Promise<ExtensionSettings> => {
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
const setSettings = async (settings: ExtensionSettings): Promise<void> => {
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
const updateSetting = async (
    category: keyof ExtensionSettings,
    key: string,
    value: boolean
): Promise<boolean> => {
    try {
        const currentSettings = await getSettings();
        const newSettings = {
            ...currentSettings,
            [category]: {
                ...(currentSettings[category] as Record<string, boolean>),
                [key]: value
            }
        };
        await setSettings(newSettings);
        return true;
    } catch (error) {
        console.error('Error updating setting:', error);
        return false;
    }
};


export { getSettings, setSettings, updateSetting };