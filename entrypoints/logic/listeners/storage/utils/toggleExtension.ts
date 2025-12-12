import { getSettings, setSettings } from "../../../storage";

const toggleExtensionHandler = async () => {
    console.log("Toggling extension handler ");
    try {
        const settings = await getSettings();
        console.log("Settings", settings);
        const newSettings = {
            ...settings,
            extensionEnabled: !settings.extensionEnabled
        };
        console.log("New settings", newSettings);
        await setSettings(newSettings);
        console.log("New settings set");
        return { success: true, error: null };
    }
    catch (error) {
        console.error("Error toggling extension", error);
        return { success: false, error: 'Unexpected error' };
    }
}

export { toggleExtensionHandler };