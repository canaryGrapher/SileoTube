// Background service worker for MV3 (cross-browser)
import browser from 'webextension-polyfill'

// Only in development: poll a timestamp file to trigger extension reloads
const isDevelopment =
	(typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'development');

if (isDevelopment) {
	const pollIntervalMs = 1000;
	let lastStamp = '';
	async function poll() {
		try {
			const res = await fetch(browser.runtime.getURL('reload.txt') + `?t=${Date.now()}`);
			if (res.ok) {
				const text = await res.text();
				if (lastStamp && lastStamp !== text) {
					browser.runtime.reload();
					return;
				}
				lastStamp = text;
			}
		} catch { }
		setTimeout(poll, pollIntervalMs);
	}
	poll();
}

let lastPath = '';

// Listen for tab updates to detect YouTube URL changes and alert the new page path
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	// Only proceed if the tab has a URL and it's a YouTube page
	if (tab.url && tab.url.includes('youtube.com')) {
		// Handle both URL changes and page completion (for initial loads)
		if (changeInfo.url || changeInfo.status === 'complete') {
			const urlToProcess = changeInfo.url || tab.url;
			let path = "unsupported"
			console.log('Processing URL: ', urlToProcess);
			try {
				const urlObj = new URL(urlToProcess);
				switch (true) {
					case urlObj.pathname === '/':
						path = '/';
						break;
					case urlObj.pathname.startsWith('/watch'):
						path = '/watch';
						break;
					case urlObj.pathname.startsWith('/shorts'):
						path = '/shorts';
						break;
					case urlObj.pathname.startsWith('/results'):
						path = '/results';
						break;
					default:
						path = 'unsupported';
						break;
				}
			} catch (e) {
				path = 'unsupported';
			}
			if (lastPath === path) return;
			lastPath = path;
			console.log('YOUTUBE_PATH_CHANGED: ', path);
			try {
				// Message the new page path (e.g., /watch, /shorts, etc.)
				browser.tabs.sendMessage(tabId, {
					type: 'YOUTUBE_PATH_CHANGED',
					path: path,
                    enabled: true
				});
			} catch (e) {
				// Ignore invalid URLs
				console.error('Error sending message to content script: ', e);
			}
		}
	}
});

// Listen for messages from popup to control content scripts
browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
	if (message.type === 'TOGGLE_FEATURE') {
		const { feature, enabled } = message;
		
		// Send toggle message to all YouTube tabs
		browser.tabs.query({ url: '*://*.youtube.com/*' }).then((tabs: any) => {
			tabs.forEach((tab: any) => {
				if (tab.id) {
					browser.tabs.sendMessage(tab.id, {
						type: `TOGGLE_${feature.toUpperCase()}`,
						enabled: enabled
					}).catch(() => {
						// Content script might not be ready
					});
				}
			});
		});
		
		sendResponse({ success: true });
	}
	
	return true; // Keep message channel open for async responses
});


