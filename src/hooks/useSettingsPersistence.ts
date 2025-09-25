import { useEffect } from 'react'
import { useAppDispatch } from './useAppDispatch'
import { loadSettings } from '../utilities/storage'
import { loadSettings as loadSettingsAction } from '../store/settingsSlice'

/**
 * Custom hook that loads settings from storage on component mount
 * Ensures settings persist across extension restarts
 */
export function useSettingsPersistence() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const initializeSettings = async () => {
      const savedSettings = await loadSettings()
      dispatch(loadSettingsAction(savedSettings))
    }

    initializeSettings()
  }, [dispatch])
}
