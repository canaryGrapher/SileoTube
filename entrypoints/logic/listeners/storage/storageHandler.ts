// Listen for messages from popup to control content scripts
import { browser } from 'wxt/browser';
import { getSettingsHandler, updateSettingHandler, toggleExtensionHandler } from './utils';

/**
 * Listener for storage messages from popup
 */
const storageHandleListener = () => {
    browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
        console.log("Message received", message);
        if (message.type === 'GET_SETTINGS') {
            getSettingsHandler().then((result) => {
                if (result.success) {
                    sendResponse(result);
                }
                else {
                    sendResponse({ success: false, error: result.error });
                }
            }).catch((err) => {
                console.error("Error fetching settings", err);
                sendResponse({ success: false, error: 'Unexpected error' });
            });
            // Important: return true synchronously to keep the sendResponse channel open
            return true;
        }
        else if (message.type === 'UPDATE_SETTING') {
            updateSettingHandler(message.category, message.key, message.value).then((result) => {
                if (result.success) {
                    sendResponse(result);
                } 
                else {
                    sendResponse({ success: false, error: result.error });
                }
            }).catch((err) => {
                console.error("Error updating setting", err);
                sendResponse({ success: false, error: 'Unexpected error' });
            });
            // Important: return true synchronously to keep the sendResponse channel open
            return true;
        }
        else if (message.type === 'TOGGLE_EXTENSION') {
            console.log("Toggling extension TOGGLE_EXTENSION");
            toggleExtensionHandler().then((result: any) => {
                if (result.success) {
                    sendResponse({success: true, error: null});
                }
                else {
                    sendResponse({ success: false, error: 'Failed to toggle extension' });
                }
            }).catch((err: any) => {
                console.error("Error toggling extension", err);
                sendResponse({ success: false, error: 'Unexpected error' });
            });
            // Important: return true synchronously to keep the sendResponse channel open
            return true;
        }
    });
}

export { storageHandleListener };