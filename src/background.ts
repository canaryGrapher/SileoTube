// Background service worker for MV3 (cross-browser)
import browser from 'webextension-polyfill'

// Only in development: poll a timestamp file to trigger extension reloads
const isDevelopment = import.meta.env?.MODE === 'development';

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
		} catch {}
		setTimeout(poll, pollIntervalMs);
	}
	poll();
}

browser.runtime.onInstalled.addListener(() => {
	// noop: placeholder for future logic
	// logic for when the extension is installed or updated
});
