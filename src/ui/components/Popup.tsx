import React from 'react';
import SettingsPanel from './SettingsPanel';

/**
 * Main popup component for the extension
 * Displays the extension name, description, and settings panel
 */
const Popup: React.FC = () => {
  const handleSettingChange = (category: string, key: string, value: boolean) => {
    console.log(`Setting changed: ${category}.${key} = ${value}`);
    // The storage listener in background script will handle notifying content scripts
  };

  return (
    <div className="w-80 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">SileoTube</h1>
        <p className="text-sm opacity-90">A calming, decluttered YouTube experience</p>
      </div>

      {/* Settings Panel */}
      <SettingsPanel onSettingChange={handleSettingChange} />

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Changes are applied immediately to all YouTube tabs
        </p>
      </div>
    </div>
  );
};

export default Popup;
