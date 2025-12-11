import { StorageTypes } from '../types';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps extends StorageTypes.SettingToggleProps {
  icon: LucideIcon;
}

const SettingCard: React.FC<SettingCardProps> = ({ label, description, checked, onChange, icon: Icon }) => {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="flex-shrink-0 text-gray-600 bg-gray-100 rounded-2xl p-3">
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
        <label className="inline-flex items-center cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
      </div>
    );
  };

  export default SettingCard;