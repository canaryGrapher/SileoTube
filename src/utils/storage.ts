import browser from 'webextension-polyfill';

const getSettings = async () => {
  const data = await browser.storage.local.get("settings");
  return data.settings || {};
}

const setSettings = (settings: any) => {
  browser.storage.local.set({ settings });
}

browser.storage.onChanged.addListener((changes: any) => {
  if (changes.settings) {
    // notify content script / re-apply
  }
});

export { getSettings, setSettings };