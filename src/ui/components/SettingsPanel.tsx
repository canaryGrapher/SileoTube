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
    <div className="p-4 space-y-6">
      {/* Pages Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Pages</h3>
        <div className="space-y-3">
          <SettingToggle
            label="Minimalist Homepage"
            description="Clean clutter from YouTube homepage by removing video recommendations."
            checked={settings.pages.homepage}
            onChange={(checked) => handleToggle('pages', 'homepage', checked)}
          />
          <SettingToggle
            label="Block Shorts"
            description="Block YouTube Shorts page and disallow playing of videos on them."
            checked={settings.pages.shorts}
            onChange={(checked) => handleToggle('pages', 'shorts', checked)}
          />
          <SettingToggle
            label="Clean Watch Page"
            description="Get a clean video watching experience by removing recommendations from the watch page and centering the video content for maximum focus."
            checked={settings.pages.watch}
            onChange={(checked) => handleToggle('pages', 'watch', checked)}
          />
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
        <div className="space-y-3">
          <SettingToggle
            label="Hide Video Comments"
            description="Remove all comments from the watch page."
            checked={settings.features.watchComments}
            onChange={(checked) => handleToggle('features', 'watchComments', checked)}
          />
          <SettingToggle
            label="Hide Sidebar"
            description="Remove sidebar from all the pages to discourage easy access to non required pages."
            checked={settings.features.sidebarRemoval}
            onChange={(checked) => handleToggle('features', 'sidebarRemoval', checked)}
          />
          <SettingToggle
            label="Hide Shorts Recommendations"
            description="Remove shorts recommendations from everywhere on youtube."
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
const SettingToggle: React.FC<SettingToggleProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-800">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default SettingsPanel;
