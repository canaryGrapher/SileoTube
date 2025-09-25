import browser from 'webextension-polyfill'
import type { SettingsState } from '../../store/settingsSlice'

const STORAGE_KEY = 'calmtube-settings'

/**
 * Loads settings from browser extension storage
 * Returns default settings if none are stored
 */
const loadSettings = async (): Promise<SettingsState> => {
  try {
    const result: Record<string, unknown> = await browser.storage.local.get(STORAGE_KEY)
    const settings = result[STORAGE_KEY] as Partial<SettingsState> | undefined
    if (
      settings &&
      typeof settings.enableExtension === 'boolean' &&
      typeof settings.hideSidebar === 'boolean' &&
      typeof settings.dimmedLights === 'boolean' &&
      typeof settings.blockShorts === 'boolean'
    ) {
      return result[STORAGE_KEY] as SettingsState
    }
    return {
      enableExtension: false,
      hideSidebar: false,
      dimmedLights: false,
      blockShorts: false,
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    return {
      enableExtension: false,
      hideSidebar: false,
      dimmedLights: false,
      blockShorts: false,
    }
  }
}

export default loadSettings