import React from 'react';
import SettingsPanel from './components/SettingsPanel';

/**
 * Main popup component for the extension
 * Displays the extension name, description, and settings panel
 */
const Popup: React.FC = () => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="w-[380px] bg-white text-gray-900">
      {/* Brand */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <img src="/icon/48.png" alt="SileoTube" className="h-12 w-auto" />
          <div>
            <div className="text-2xl font-extrabold tracking-tight">SileoTube</div>
            <div className="text-xs tracking-widest text-gray-500">by <img src="/icon/workvarLogo.png" alt="WorkVar logo" className="h-4 w-auto inline-block" /></div>
          </div>
        </div>
        <div className="my-4">
          <div className="text-3xl tracking-tight" style={{ fontFamily: 'var(--brand-font)' }}>{getGreeting()}</div>
          <div className="text-gray-500 text-lg">Take back your focus</div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="mt-2">
        <SettingsPanel />
      </div>

      {/* Footer */}
      <div className="py-2">
        <p className="text-xs text-gray-500 text-center">Changes are applied immediately to all YouTube tabs</p>
      </div>
    </div>
  );
};

export default Popup;
