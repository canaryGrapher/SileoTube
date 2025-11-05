import { getSettings, updateSetting } from "../../../storage";
import type { ExtensionSettings } from "../../../types";


/**
 * Handler for getting settings from storage
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
 * Handler for updating a setting in storage
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