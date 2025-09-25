import browser from 'webextension-polyfill'
import type { SettingsState } from '../../store/settingsSlice'

const STORAGE_KEY = 'calmtube-settings'


/**
 * Saves settings to browser extension storage
 * Handles errors gracefully
 */
const saveSettings = async (settings: SettingsState): Promise<void> => {
    try {
        await browser.storage.local.set({ [STORAGE_KEY]: settings }).then(() => {
            console.log('Settings saved')
        })
    } catch (error) {
        console.error('Failed to save settings:', error)
    }
}

export default saveSettings