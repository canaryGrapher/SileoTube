import { Dispatch, SetStateAction } from 'react';
import SettingCard from './SettingsCard';
import { handleFeatureToggle } from '../utils/storage/handleFeatureToggle';
import { LayoutTemplate, Sidebar, Palette, Zap, Film, Power, MessageSquareOff, LucideIcon } from 'lucide-react';
import { StorageTypes } from '../types';

// Configuration for all settings sections and their options
interface SettingOption {
  icon: LucideIcon;
  label: string;
  description: string;
  category: keyof StorageTypes.ExtensionSettingsProps;
  key: string;
  // Optional: if true, this setting is not yet implemented
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
        label: 'Minimal Home Screen',
        description: 'Replace feed with a focus quote.',
        category: 'pages',
        key: 'homepage',
        disabled: false,
      },
      {
        icon: Sidebar,
        label: 'Hide Sidebar',
        description: 'Remove navigation sidebar.',
        category: 'features',
        key: 'sidebar',
        disabled: false,
      },
      {
        icon: Palette,
        label: 'Grayscale Thumbnails',
        description: 'Reduce visual appeal of thumbnails.',
        category: 'features',
        key: 'grayscaleThumbnails',
        disabled: false,
      },
    ],
  },
  {
    title: 'Shorts Blocker',
    options: [
      {
        icon: Zap,
        label: 'Block Shorts Tab',
        description: 'Disable Shorts player and tab.',
        category: 'pages',
        key: 'shorts',
        disabled: false,
      },
      {
        icon: Film,
        label: 'Hide Shorts Recommendations',
        description: 'Remove Shorts shelf from feeds.',
        category: 'features',
        key: 'shortsRecommendations',
        disabled: false,
      },
    ],
  },
  {
    title: 'Watch Page',
    options: [
      {
        icon: Power,
        label: 'Clean Watch Page',
        description: 'Hide watch recommendations.',
        category: 'pages',
        key: 'watch',
        disabled: false,
      },
      {
        icon: MessageSquareOff,
        label: 'Hide comments',
        description: 'Remove comments section.',
        category: 'features',
        key: 'comments',
        disabled: false,
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

/**
 * Settings panel component for toggling extension features
 * Displays toggles for pages and features with real-time updates.
 */
function SettingsPanel({ settings, onSettingsChange, loading, isEnabled }: SettingsPanelProps) {
  // Show loading spinner while settings are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error message if settings failed to load
  if (!settings && !loading) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load settings
      </div>
    );
  }

  /**
   * Handle toggle change for a setting
   * Updates the setting via handleFeatureToggle which syncs with background storage
   */
  const handleToggle = (
    category: keyof StorageTypes.ExtensionSettingsProps,
    key: string,
    value: boolean
  ) => {
    // Create a wrapper that matches the Dispatch type expected by handleFeatureToggle
    // handleFeatureToggle will call this with either a value or a function
    const setSettingsWrapper: Dispatch<SetStateAction<StorageTypes.ExtensionSettingsProps | null>> = (
      valueOrUpdater
    ) => {
      if (typeof valueOrUpdater === 'function') {
        // If it's a function, call it with current settings and pass result to onSettingsChange
        const newSettings = valueOrUpdater(settings);
        if (newSettings) {
          onSettingsChange(newSettings);
        }
      } else if (valueOrUpdater) {
        // If it's a value, pass it directly to onSettingsChange
        onSettingsChange(valueOrUpdater);
      }
    };
    
    handleFeatureToggle(category, key, value, setSettingsWrapper);
  };

  /**
   * Get the current checked state for a setting
   */
  const getSettingValue = (option: SettingOption): boolean => {
    if (option.disabled) return false;
    const categorySettings = settings?.[option.category];
    if (!categorySettings) return false;
    return (categorySettings as Record<string, boolean>)[option.key] || false;
  };

  /**
   * Render a single settings section with its options
   */
  const renderSection = (section: SettingsSection) => (
    <div key={section.title}>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {section.title}
      </h3>
      <div className="space-y-0 bg-white rounded-lg">
        {section.options.map((option) => (
          <SettingCard
            key={`${option.category}-${option.key}`}
            icon={option.icon}
            label={option.label}
            description={option.description}
            checked={getSettingValue(option)}
            disabled={!isEnabled || option.disabled}
            onChange={(checked) => {
              if (!option.disabled && isEnabled) {
                handleToggle(option.category, option.key, checked);
              }
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-5 pb-6 space-y-6">
      {SETTINGS_CONFIG.map(renderSection)}
    </div>
  );
}

export default SettingsPanel;
