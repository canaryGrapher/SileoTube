import browser from 'webextension-polyfill';


const pathResolver = (urlObj: URL, settings: any) => {
    let _path = 'unsupported';
    let _enabled = false;
    switch (true) {
        case urlObj.pathname === '/':
            _path = '/';
            _enabled = settings.pages.homepage;
            break;
        case urlObj.pathname.startsWith('/watch'):
            _path = '/watch';
            _enabled = settings.pages.watch;
            break;
        case urlObj.pathname.startsWith('/shorts'):
            _path = '/shorts';
            _enabled = settings.pages.shorts;
            break;
        default:
            _path = 'unsupported';
            _enabled = false;
            break;
    }   
    return { _path, _enabled };
}

// Function to wait for content script to be ready
async function waitForContentScript(tabId: number, maxRetries = 10): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Send a ping message to check if content script is ready
            console.log("waitForContentScript: sending ping message to tab:", tabId, "attempt:", i + 1);
            const response = await browser.tabs.sendMessage(tabId, { type: 'PING' });
            console.log("waitForContentScript: response received:", response);
            return true; // Content script responded, it's ready
        } catch (error) {
            // Content script not ready yet, wait a bit and try again
            console.log("waitForContentScript: error on attempt", i + 1, ":", error);
            console.log("waitForContentScript: waiting 200ms and trying again");
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    return false; // Content script never became ready
}

export { pathResolver, waitForContentScript };