import browser from 'webextension-polyfill';
import { pathResolver, waitForContentScript } from '../utils';
import { getSettings } from '../../../utils/storage';

interface ApplyChangesMessage {
    type: 'APPLY_CHANGES';
    tabId: number;
    pageUrl: string;
}

interface MessageSender {
    tab?: {
        id: number;
    };
}

const changeListener = async (message: ApplyChangesMessage, _sender: MessageSender, sendResponse: (response: any) => void): Promise<boolean> => {
    console.log('changeListener: ', message);
    if (message.type === 'APPLY_CHANGES') {
        console.log('changeListener: APPLY_CHANGES');
        const { pageUrl, tabId } = message;
        const settings = await getSettings();
        const { _path, _enabled } = pathResolver(new URL(pageUrl), settings);
        waitForContentScript(tabId).then((isReady) => {
            if (isReady) {
                console.log('changeListener ready: sending message to tab:', tabId);
                console.log('changeListener: _path: ', _path);
                console.log('changeListener: _enabled: ', _enabled);
                console.log('changeListener: settings.features: ', settings.features);
                browser.tabs.sendMessage(tabId, {
                    type: 'YOUTUBE_PATH_CHANGED',
                    path: _path,
                    enabled: _enabled,
                    features: settings.features
                }).catch(() => {
                    console.log('changeListener not ready: Failed to send message to tab:', tabId);
                });
            }
        });
        sendResponse({ success: true });
        return true;
    }
    return false;
};

export { changeListener };