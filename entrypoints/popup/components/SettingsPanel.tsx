import { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import SettingCard from './SettingsCard';
import { handleFeatureToggle } from '../utils/storage/handleFeatureToggle';

import { StorageTypes } from '../types';




/**
 * Settings panel component for toggling extension features
/**
 * Displays toggles for pages and features with real-time updates.
 */
function SettingsPanel() {
  const [settings, setSettings] = useState<StorageTypes.ExtensionSettingsProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Load settings from background script
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
        if (response && typeof response === 'object' && 'settings' in response) {
          setSettings((response as { settings: StorageTypes.ExtensionSettingsProps }).settings);
        }
        else if (response && typeof response === 'object' && 'error' in response) {
          console.error('Failed to load settings:', (response as { error: string }).error);
        }
        else {
          console.error('Failed to load settings: unexpected response', response);
        }
      }

      catch (error) {
        console.error('Error loading settings:', error);
      }

      finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings && !loading) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load settings
      </div>
    );
  }

  const handleToggle = (category: keyof StorageTypes.ExtensionSettingsProps, key: string, value: boolean) => {
    handleFeatureToggle(category, key, value, setSettings);
  }


  return (
    <div className="px-5 pb-6 space-y-7">
      {/* Pages Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Page Settings</h3>
        <div className="space-y-4">
          <SettingCard
            label="Minimal Home Screen"
            description="Clean clutter from YouTube homepage by removing video recommendations."
            checked={settings?.pages.homepage || false}
            onChange={(checked) => handleToggle('pages', 'homepage', checked)}
          />
          <SettingCard
            label="Block Shorts"
            description="Block YouTube Shorts page and disallow playing of videos on them."
            checked={settings?.pages.shorts || false}
            onChange={(checked) => handleToggle('pages', 'shorts', checked)}
          />
          <SettingCard
            label="Clean Watch Page"
            description="Get a focused video watching experience by removing recommendations and centering video content."
            checked={settings?.pages.watch || false}
            onChange={(checked) => handleToggle('pages', 'watch', checked)}
          />
        </div>
      </div>
      {/* Features Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Features</h3>
        <div className="space-y-4">
          <SettingCard
            label="Hide video comments"
            description="Remove all comments from the video watching page"
            checked={settings?.features.comments || false}
            onChange={(checked) => handleToggle('features', 'comments', checked)}
          />
          <SettingCard
            label="Hide Sidebar"
            description="Remove sidebar from all the pages to discourage easy access to non required pages."
            checked={settings?.features.sidebar || false}
            onChange={(checked) => handleToggle('features', 'sidebar', checked)}
          />
          <SettingCard
            label="Hide Shorts Recommendations"
            description="Remove short recommendations from all pages on YouTube"
            checked={settings?.features.shortsRecommendations || false}
            onChange={(checked) => handleToggle('features', 'shortsRecommendations', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
