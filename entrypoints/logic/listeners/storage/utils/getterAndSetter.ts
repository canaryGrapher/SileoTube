import { getSettings, updateSetting } from "../../../storage";
import type { ExtensionSettings } from "../../../types";


/**
 * Handler for retrieving extension settings from browser storage.
 * 
 * This function acts as a message handler that fetches the current extension settings
 * from browser.storage.local and formats them into a standardized response object.
 * 
 * How it works:
 * 1. Calls getSettings() which retrieves settings from browser.storage.local
 * 2. If settings exist, returns a success response with the settings object
 * 3. If settings don't exist or retrieval fails, returns an error response
 * 
 * @returns {Promise<{success: boolean, error: string | null, settings: ExtensionSettings | {}}>}
 *   - success: true if settings were retrieved successfully, false otherwise
 *   - error: null on success, error message string on failure
 *   - settings: The ExtensionSettings object containing pages and features configuration
 * 
 * @example
 * // Successful retrieval
 * const response = await getSettingsHandler();
 * // Returns: {
 * //   success: true,
 * //   error: null,
 * //   settings: {
 * //     pages: { homepage: false, shorts: true, watch: false },
 * //     features: { comments: false, sidebar: true, shortsRecommendations: false, grayscaleThumbnails: true }
 * //   }
 * // }
 * 
 * @example
 * // Failed retrieval
 * const response = await getSettingsHandler();
 * // Returns: {
 * //   success: false,
 * //   error: "Failed to get settings",
 * //   settings: {}
 * // }
 */
const getSettingsHandler = async () => {
    let responseBody
    const settings = await getSettings()
    if(settings) {
        responseBody = { success: true, error: null, settings: settings };
    } else {
        responseBody = { success: false, error: "Failed to get settings", settings: {} };
    }
    return responseBody;
}

/**
 * Handler for updating a specific extension setting in browser storage.
 * 
 * This function updates a single setting value within the extension's settings object.
 * It handles updates to both 'pages' and 'features' categories by merging the new value
 * with existing settings, then persisting the updated settings to browser.storage.local.
 * 
 * How it works:
 * 1. Receives category ('pages' or 'features'), key (setting name), and value (boolean)
 * 2. Calls updateSetting() which:
 *    - Retrieves current settings from storage
 *    - Creates a new settings object with the updated value
 *    - Saves the updated settings back to storage
 * 3. Returns a success/error response based on the operation result
 * 
 * @param {keyof ExtensionSettings} category - The category of the setting to update.
 *   Must be either 'pages' or 'features'.
 * @param {string} key - The specific setting key within the category to update.
 *   For 'pages': 'homepage', 'shorts', or 'watch'
 *   For 'features': 'comments', 'sidebar', 'shortsRecommendations', or 'grayscaleThumbnails'
 * @param {boolean} value - The new boolean value to set for the specified setting.
 * 
 * @returns {Promise<{success: boolean, error: string | null}>}
 *   - success: true if the setting was updated successfully, false otherwise
 *   - error: null on success, error message string on failure
 * 
 * @example
 * // Enable homepage minimal view
 * const response = await updateSettingHandler('pages', 'homepage', true);
 * // Returns: { success: true, error: null }
 * // Settings changed from: { pages: { homepage: false, ... } }
 * //                    to: { pages: { homepage: true, ... } }
 * 
 * @example
 * // Disable sidebar removal
 * const response = await updateSettingHandler('features', 'sidebar', false);
 * // Returns: { success: true, error: null }
 * // Settings changed from: { features: { sidebar: true, ... } }
 * //                    to: { features: { sidebar: false, ... } }
 * 
 * @example
 * // Update fails (e.g., storage quota exceeded)
 * const response = await updateSettingHandler('pages', 'shorts', true);
 * // Returns: { success: false, error: "Failed to update setting" }
 */
const updateSettingHandler = async (category: keyof ExtensionSettings, key: string, value: boolean) => {
    let responseBody
    const result = await updateSetting(category, key, value)
    if(result) {
        responseBody = { success: true, error: null };
    } else {
        responseBody = { success: false, error: "Failed to update setting", settings: {} };
    }
    return responseBody as { success: boolean, error: string | null };
}

export { getSettingsHandler, updateSettingHandler };