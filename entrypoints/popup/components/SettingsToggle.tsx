/**
 * Individual toggle component for settings
 */
import { StorageTypes } from '../types';

const SettingToggle: React.FC<StorageTypes.SettingToggleProps> = ({ label, checked, onChange }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold tracking-tight text-gray-900" style={{ fontFamily: 'var(--brand-font)' }}>{label}</div>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="relative w-10 h-5 bg-white shadow-[inset_21px_21px_21px_20px_rgba(0,0,0,0.25)] rounded-full
          peer-focus:outline-none peer-focus:ring-2 peer peer-checked:from-red-600 peer-checked:via-fuchsia-600 peer-checked:to-red-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    );
  };

  export default SettingToggle;