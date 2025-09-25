import { useAppSelector } from '../../hooks/useAppSelector'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import {
  toggleEnableExtension,
  toggleHideSidebar,
  toggleDimmedLights,
  toggleBlockShorts,
} from '../../store/settingsSlice'
import SettingsItem from './SettingsItem'

/**
 * Settings list component that renders all toggle switches
 * Handles Redux state management for all settings
 */
function SettingsList() {
  const settings = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()

  const settingsConfig = [
    {
      label: 'Enable Extension',
      checked: settings.enableExtension,
      onChange: () => dispatch(toggleEnableExtension()),
      disabled: false,
    },
    {
      label: 'Hide Sidebar',
      checked: settings.hideSidebar,
      onChange: () => dispatch(toggleHideSidebar()),
      disabled: !settings.enableExtension,
    },
    {
      label: 'Dimmed Lights',
      checked: settings.dimmedLights,
      onChange: () => dispatch(toggleDimmedLights()),
      disabled: !settings.enableExtension,
    },
    {
      label: 'Block Shorts',
      checked: settings.blockShorts,
      onChange: () => dispatch(toggleBlockShorts()),
      disabled: settings.enableExtension,
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {settingsConfig.map((setting) => (
        <SettingsItem
          key={setting.label}
          label={setting.label}
          checked={setting.checked}
          onChange={setting.onChange}
          disabled={setting.disabled}
        />
      ))}
    </div>
  )
}

export default SettingsList
