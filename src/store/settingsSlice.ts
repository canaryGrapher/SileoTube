import { createSlice } from '@reduxjs/toolkit'
import {
  handleExtensionToggle,
  handleSidebarToggle,
  handleDimmingToggle,
  handleShortsToggle,
} from '../utilities/effects'
import { saveSettings } from '../utilities/storage'

import type { PayloadAction } from '@reduxjs/toolkit'


export interface SettingsState {
  enableExtension: boolean
  hideSidebar: boolean
  dimmedLights: boolean
  blockShorts: boolean
}

const initialState: SettingsState = {
  enableExtension: false,
  hideSidebar: false,
  dimmedLights: false,
  blockShorts: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleEnableExtension: (state) => {
      state.enableExtension = !state.enableExtension
      handleExtensionToggle(state.enableExtension)
      saveSettings(state)
    },
    toggleHideSidebar: (state) => {
      state.hideSidebar = !state.hideSidebar
      handleSidebarToggle(state.hideSidebar)
      saveSettings(state)
    },
    toggleDimmedLights: (state) => {
      state.dimmedLights = !state.dimmedLights
      handleDimmingToggle(state.dimmedLights)
      saveSettings(state)
    },
    toggleBlockShorts: (state) => {
      state.blockShorts = !state.blockShorts
      handleShortsToggle(state.blockShorts)
      saveSettings(state)
    },
    setSetting: (state, action: PayloadAction<{ key: keyof SettingsState; value: boolean }>) => {
      const { key, value } = action.payload
      state[key] = value
      saveSettings(state)
    },
    // @ts-ignore
    loadSettings: (state, action: PayloadAction<SettingsState>) => {
      return action.payload
    },
  },
})

export const {
  toggleEnableExtension,
  toggleHideSidebar,
  toggleDimmedLights,
  toggleBlockShorts,
  setSetting,
  loadSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
