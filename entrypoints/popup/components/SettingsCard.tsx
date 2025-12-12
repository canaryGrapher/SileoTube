import { StorageTypes } from '../types';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps extends StorageTypes.SettingToggleProps {
  icon: LucideIcon;
  disabled?: boolean;
}

const SettingCard: React.FC<SettingCardProps> = ({ label, description, checked, onChange, icon: Icon, disabled = false }) => {
    return (
      <div className={`flex items-center gap-3 py-3 ${disabled ? 'opacity-50' : ''}`}>
        <div className={`flex-shrink-0 rounded-2xl p-3 ${disabled ? 'text-gray-400 bg-gray-50' : 'text-gray-600 bg-gray-100'}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</div>
          <div className={`text-xs mt-0.5 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{description}</div>
        </div>
        <label className={`inline-flex items-center flex-shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            onChange={(e) => !disabled && onChange(e.target.checked)}
          />
          <div className={`relative w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300'}`}></div>
        </label>
      </div>
    );
  };

  export default SettingCard;