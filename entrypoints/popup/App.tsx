import React, { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import { Power } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import { StorageTypes } from './types';

/**
 * Main popup component for the extension
 * Displays the extension name, description, and settings panel
 */
const Popup: React.FC = () => {
  const [settings, setSettings] = useState<StorageTypes.ExtensionSettingsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // Load settings to calculate filter count
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
        if (response && typeof response === 'object' && 'settings' in response) {
          const loadedSettings = (response as { settings: StorageTypes.ExtensionSettingsProps }).settings;
          setSettings(loadedSettings);
          setIsEnabled(loadedSettings.extensionEnabled ?? true);
        } else if (response && typeof response === 'object' && 'error' in response) {
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

  // Sync isEnabled with settings when settings change
  useEffect(() => {
    if (settings) {
      setIsEnabled(settings.extensionEnabled ?? true);
    }
  }, [settings]);

  // Handle extension toggle
  const handleToggleExtension = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle button clicked, current state:', isEnabled);
    try {
      await browser.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' });
      const updatedSettings = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (updatedSettings && typeof updatedSettings === 'object' && 'settings' in updatedSettings) {
        const loadedSettings = (updatedSettings as { settings: StorageTypes.ExtensionSettingsProps }).settings;
        setSettings(loadedSettings);
        setIsEnabled(loadedSettings.extensionEnabled ?? true);
      }

    } catch (error) {
      console.error('Error toggling extension:', error);
    }
  };

  // Calculate active filter count
  const getActiveFilterCount = (): number => {
    if (!settings) return 0;
    let count = 0;
    Object.values(settings.pages).forEach(value => { if (value) count++; });
    Object.values(settings.features).forEach(value => { if (value) count++; });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="w-[380px] h-[600px] bg-white text-gray-900 flex flex-col relative overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-[380px] bg-white z-10 border-b border-gray-200 rounded-t-xl">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src="/icon/48.png" alt="SileoTube" className="h-10 w-auto" />
              <div>
                <div className="text-xl font-bold tracking-tight text-gray-900">SileoTube</div>
                <div className="text-xs text-gray-500">by <img src="/icon/workvarLogo.png" alt="WorkVar logo" className="h-3 w-auto inline-block" /></div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleExtension}
              className={`relative z-20 flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ${isEnabled
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              style={{ pointerEvents: 'auto' }}
            >
              <Power size={14} />
              <span>{isEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <span className="text-red-600 font-semibold">{activeFilterCount}</span> filter(s) active to reclaim your focus.
          </div>
        </div>
      </div>
      
      
      {/* Scrollable Settings Panel */}
      <div className="flex-1 overflow-y-auto pt-[120px] pb-[50px]">
        <SettingsPanel settings={settings} onSettingsChange={setSettings} loading={loading} isEnabled={isEnabled} />
      </div>


      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-[380px] bg-gray-100 z-10 border-t border-gray-200 rounded-b-xl">
        <div className="px-5 py-3">
          <p className="text-xs text-gray-500 text-center">Changes apply immediately</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;