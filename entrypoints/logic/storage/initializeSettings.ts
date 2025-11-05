import { setSettings } from "./";
import { DEFAULT_SETTINGS } from "../data";

/**
 * Initialize default settings on first installation
 */
const initializeSettings = async (): Promise<void> => {
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

export { initializeSettings };