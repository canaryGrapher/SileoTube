import { useSettingsPersistence } from '../../hooks/useSettingsPersistence'
import SettingsHeader from './SettingsHeader'
import SettingsList from './SettingsList'

/**
 * Main settings panel component that handles side effects
 * Manages the connection between Redux state and browser extension effects
 */
function SettingsPanel() {
  // Load settings from storage on mount
  useSettingsPersistence()

  return (
    <div className="bg-gray-800 w-screen p-5">
      <div className="w-full">
        <SettingsHeader />
        <SettingsList />
      </div>
    </div>
  )
}

export default SettingsPanel
