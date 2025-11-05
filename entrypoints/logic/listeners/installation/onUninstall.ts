import { browser } from 'wxt/browser';
import { UNINSTALL_URL } from '../../data';


const uninstallListener = () => {
    // Redirect user to the uninstall survey page on uninstall
    browser.runtime.setUninstallURL(UNINSTALL_URL);
}

export { uninstallListener };