import { useTheme } from '../App';
import { StorageTypes } from '../types';
import { LucideIcon } from 'lucide-react';

interface SettingCardProps extends StorageTypes.SettingToggleProps {
  icon: LucideIcon;
  disabled?: boolean;
  colSpan?: boolean;
}

const SettingCard: React.FC<SettingCardProps> = ({
  label,
  checked,
  onChange,
  icon: Icon,
  disabled = false,
  colSpan = false,
}) => {
  const isDark = useTheme();

  const base = [
    'relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border',
    'transition-all duration-150 min-h-[88px] w-full text-center select-none',
    colSpan ? 'col-span-2' : '',
  ];

  const stateClasses = checked && !disabled
    ? ['bg-red-500/[0.13] border-red-500/30 text-red-400']
    : disabled
    ? [isDark ? 'bg-white/[0.03] border-white/[0.05] text-gray-600' : 'bg-black/[0.03] border-black/[0.05] text-gray-300', 'cursor-not-allowed']
    : isDark
    ? ['bg-white/[0.05] border-white/[0.08] text-gray-400 hover:bg-white/[0.09] hover:border-white/[0.14] cursor-pointer']
    : ['bg-black/[0.04] border-black/[0.08] text-gray-500 hover:bg-black/[0.07] hover:border-black/[0.13] cursor-pointer'];

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={[...base, ...stateClasses].join(' ')}
    >
      {checked && !disabled && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-red-400" />
      )}

      <div className={[
        'rounded-xl p-2 transition-colors duration-150',
        checked && !disabled ? 'bg-red-500/20' : isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]',
      ].join(' ')}>
        <Icon size={20} strokeWidth={1.75} />
      </div>

      <span className="text-[11px] font-semibold leading-tight tracking-wide">{label}</span>
    </button>
  );
};

export default SettingCard;
