import { installationListeners, storageListeners, tabListeners } from './logic/listeners';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Install and uninstall listeners
  installationListeners.installListener();
  installationListeners.uninstallListener();

  // Storage listener
  storageListeners.storageHandleListener();
  storageListeners.storageChangeListener();

  // Tab listener
  tabListeners.tabReloadListener();
});
