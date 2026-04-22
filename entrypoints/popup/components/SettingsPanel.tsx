import { Dispatch, SetStateAction } from 'react';
import SettingCard from './SettingsCard';
import { useTheme } from '../App';
import { handleFeatureToggle } from '../utils/storage/handleFeatureToggle';
import {
  LayoutTemplate, Sidebar, Palette, Zap, Film, Tv2, MessageSquareOff, LucideIcon,
} from 'lucide-react';
import { StorageTypes } from '../types';

interface SettingOption {
  icon: LucideIcon;
  label: string;
  description: string;
  category: keyof StorageTypes.ExtensionSettingsProps;
  key: string;
  disabled?: boolean;
}

interface SettingsSection {
  title: string;
  options: SettingOption[];
}

const SETTINGS_CONFIG: SettingsSection[] = [
  {
    title: 'Focus & Navigation',
    options: [
      {
        icon: LayoutTemplate,
        label: 'Minimal Home',
        description: 'Replace feed with a focus search.',
        category: 'pages',
        key: 'homepage',
      },
      {
        icon: Sidebar,
        label: 'Hide Sidebar',
        description: 'Remove navigation sidebar.',
        category: 'features',
        key: 'sidebar',
      },
      {
        icon: Palette,
        label: 'Grayscale Thumbs',
        description: 'Reduce visual appeal of thumbnails.',
        category: 'features',
        key: 'grayscaleThumbnails',
      },
    ],
  },
  {
    title: 'Shorts',
    options: [
      {
        icon: Zap,
        label: 'Block Shorts',
        description: 'Disable Shorts player and tab.',
        category: 'pages',
        key: 'shorts',
      },
      {
        icon: Film,
        label: 'Hide Shelf',
        description: 'Remove Shorts shelf from feeds.',
        category: 'features',
        key: 'shortsRecommendations',
      },
    ],
  },
  {
    title: 'Watch Page',
    options: [
      {
        icon: Tv2,
        label: 'Clean Watch',
        description: 'Hide watch recommendations.',
        category: 'pages',
        key: 'watch',
      },
      {
        icon: MessageSquareOff,
        label: 'Hide Comments',
        description: 'Remove comments section.',
        category: 'features',
        key: 'comments',
      },
    ],
  },
];

interface SettingsPanelProps {
  settings: StorageTypes.ExtensionSettingsProps | null;
  onSettingsChange: (settings: StorageTypes.ExtensionSettingsProps) => void;
  loading: boolean;
  isEnabled: boolean;
}

function SettingsPanel({ settings, onSettingsChange, loading, isEnabled }: SettingsPanelProps) {
  const isDark = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-6 h-6 rounded-full border-2 border-red-500/40 border-t-red-500 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 text-center text-red-400 text-sm">Failed to load settings</div>
    );
  }

  const handleToggle = (
    category: keyof StorageTypes.ExtensionSettingsProps,
    key: string,
    value: boolean
  ) => {
    const setSettingsWrapper: Dispatch<SetStateAction<StorageTypes.ExtensionSettingsProps | null>> = (
      valueOrUpdater
    ) => {
      if (typeof valueOrUpdater === 'function') {
        const newSettings = valueOrUpdater(settings);
        if (newSettings) onSettingsChange(newSettings);
      } else if (valueOrUpdater) {
        onSettingsChange(valueOrUpdater);
      }
    };
    handleFeatureToggle(category, key, value, setSettingsWrapper);
  };

  const getValue = (option: SettingOption): boolean => {
    if (option.disabled) return false;
    const cat = settings?.[option.category];
    return (cat as Record<string, boolean>)?.[option.key] ?? false;
  };

  return (
    <div className="px-4 pb-4 space-y-5">
      {SETTINGS_CONFIG.map((section) => (
        <div key={section.title}>
          <p className={[
            'text-[10px] font-semibold uppercase tracking-widest mb-2.5 px-0.5',
            isDark ? 'text-gray-500' : 'text-gray-400',
          ].join(' ')}>
            {section.title}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {section.options.map((option, idx) => {
              const isLast = idx === section.options.length - 1;
              const isOdd = section.options.length % 2 !== 0;
              return (
                <SettingCard
                  key={`${option.category}-${option.key}`}
                  icon={option.icon}
                  label={option.label}
                  description={option.description}
                  checked={getValue(option)}
                  disabled={!isEnabled || !!option.disabled}
                  colSpan={isOdd && isLast}
                  onChange={(checked) => {
                    if (!option.disabled && isEnabled) {
                      handleToggle(option.category, option.key, checked);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SettingsPanel;
