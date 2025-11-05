// Listen for messages from popup to control content scripts
import { browser } from 'wxt/browser';
import { getSettingsHandler, updateSettingHandler } from './utils';

/**
 * Listener for storage messages from popup
 */
const storageHandleListener = () => {
    browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
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
        // For messages we don't handle, return void (no async response)
        return undefined;
    });
}

export { storageHandleListener };