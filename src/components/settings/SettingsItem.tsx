import { General } from '../'

interface SettingsItemProps {
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

/**
 * Reusable settings item component that displays a label and toggle
 * Provides consistent styling and layout for all settings
 */
function SettingsItem({ label, checked, onChange, disabled }: SettingsItemProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2">
      <p className="text-gray-300">{label}</p>
      <General.Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  )
}

export default SettingsItem
