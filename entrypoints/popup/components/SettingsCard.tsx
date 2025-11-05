import SettingToggle from './SettingsToggle';
import { StorageTypes } from '../types';

const SettingCard: React.FC<StorageTypes.SettingToggleProps> = ({ label, description, checked, onChange }) => {
    return (
      <div className="rounded-2xl p-[1px] bg-gradient-to-r from-rose-500 via-fuchsia-600 to-blue-600">
        <div className="rounded-2xl bg-white shadow-sm px-4 py-2">
          <SettingToggle label={label} description={description} checked={checked} onChange={onChange} />
          <div className="mt-2 text-xs text-gray-600">{description}</div>
        </div>
      </div>
    );
  };

  export default SettingCard;