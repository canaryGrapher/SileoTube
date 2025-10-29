import React, { useState, useEffect } from 'react';
import { type ExtensionSettings } from '../../utils/storage';
import browser from 'webextension-polyfill';


interface SettingsPanelProps {
  onSettingChange?: (category: keyof ExtensionSettings, key: string, value: boolean) => void;
}

/**
 * Settings panel component for toggling extension features
/**
 * Displays toggles for pages and features with real-time updates.
 */
function SettingsPanel({ onSettingChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load settings from background script
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
        // response is of type unknown, so check and narrow
        if (
          response &&
          typeof response === 'object' &&
          'settings' in response
        ) {
          setSettings((response as { settings: ExtensionSettings }).settings);
        } else if (
          response &&
          typeof response === 'object' &&
          'error' in response
        ) {
          console.error('Failed to load settings:', (response as { error: string }).error);
        } else {
          console.error('Failed to load settings: unexpected response', response);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle setting toggle
  const handleToggle = async (category: keyof ExtensionSettings, key: string, value: boolean) => {
    try {
      const response = await browser.runtime.sendMessage({
        type: 'UPDATE_SETTING',
        category,
        key,
        value
      });

      // 'response' is of type 'unknown', so we must narrow it safely
      if (
        response &&
        typeof response === 'object' &&
        'success' in response &&
        (response as any).success === true
      ) {
        // Update local state
        setSettings(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            [category]: {
              ...prev[category],
              [key]: value
            }
          };
        });

        // Notify parent component
        onSettingChange?.(category, key, value);
      } else if (
        response &&
        typeof response === 'object' &&
        'error' in response
      ) {
        // 'response' is of type unknown, so we must narrow it safely
        console.error('Failed to update setting:', (response as { error: string }).error);
      } else {
        console.error('Failed to update setting: unexpected response', response);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load settings
      </div>
    );
  }

  return (
    <div className="px-5 pb-6 space-y-7">
      {/* Pages Section */}
      <div className="space-y-4">
        <SettingCard
          label="Minimal Home Screen"
          description="Clean clutter from YouTube homepage by removing video recommendations."
          checked={settings.pages.homepage}
          onChange={(checked) => handleToggle('pages', 'homepage', checked)}
        />
        <SettingCard
          label="Block Shorts"
          description="Block YouTube Shorts page and disallow playing of videos on them."
          checked={settings.pages.shorts}
          onChange={(checked) => handleToggle('pages', 'shorts', checked)}
        />
        <SettingCard
          label="Clean Watch Page"
          description="Get a focused video watching experience by removing recommendations and centering video content."
          checked={settings.pages.watch}
          onChange={(checked) => handleToggle('pages', 'watch', checked)}
        />
      </div>

      {/* Features Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Features</h3>
        <div className="space-y-4">
          <SettingCard
            label="Hide video comments"
            description="Remove all comments from the video watching page"
            checked={settings.features.watchComments}
            onChange={(checked) => handleToggle('features', 'watchComments', checked)}
          />
          <SettingCard
            label="Hide Sidebar"
            description="Remove sidebar from all the pages to discourage easy access to non required pages."
            checked={settings.features.sidebarRemoval}
            onChange={(checked) => handleToggle('features', 'sidebarRemoval', checked)}
          />
          <SettingCard
            label="Hide Shorts Recommendations"
            description="Remove short recommendations from all pages on YouTube"
            checked={settings.features.shortsRecommendations}
            onChange={(checked) => handleToggle('features', 'shortsRecommendations', checked)}
          />
        </div>
      </div>
    </div>
  );
};

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Individual toggle component for settings
 */
const SettingToggle: React.FC<SettingToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl">
      <div className="flex-1 min-w-0">
        <div className="text-lg font-semibold tracking-tight text-gray-900" style={{ fontFamily: 'var(--brand-font)' }}>{label}</div>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="relative w-14 h-7 bg-white shadow-[inset_21px_21px_21px_20px_rgba(0,0,0,0.25)]  peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:from-red-600 peer-checked:via-fuchsia-600 peer-checked:to-red-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
      </label>
    </div>
  );
};

interface SettingCardProps extends SettingToggleProps { }

const SettingCard: React.FC<SettingCardProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-rose-500 via-fuchsia-600 to-blue-600">
      <div className="rounded-2xl bg-white shadow-sm p-4">
        <SettingToggle label={label} description={description} checked={checked} onChange={onChange} />
        <div className="mt-2 text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};

export default SettingsPanel;
