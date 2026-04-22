import React, { createContext, useContext, useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import { Power, Moon, Sun } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import { StorageTypes } from './types';

export const ThemeContext = createContext<boolean>(true); // true = dark
export const useTheme = () => useContext(ThemeContext);

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<StorageTypes.ExtensionSettingsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [response, themeData] = await Promise.all([
          browser.runtime.sendMessage({ type: 'GET_SETTINGS' }),
          browser.storage.local.get('popupTheme'),
        ]);
        if (response && typeof response === 'object' && 'settings' in response) {
          const s = (response as { settings: StorageTypes.ExtensionSettingsProps }).settings;
          setSettings(s);
          setIsEnabled(s.extensionEnabled ?? true);
        }
        if (themeData.popupTheme === 'light') setIsDark(false);
      } catch (e) {
        console.error('Error loading settings:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (settings) setIsEnabled(settings.extensionEnabled ?? true);
  }, [settings]);

  const handleToggleExtension = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await browser.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' });
      const updated = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (updated && typeof updated === 'object' && 'settings' in updated) {
        const s = (updated as { settings: StorageTypes.ExtensionSettingsProps }).settings;
        setSettings(s);
        setIsEnabled(s.extensionEnabled ?? true);
      }
    } catch (e) {
      console.error('Error toggling extension:', e);
    }
  };

  const handleToggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await browser.storage.local.set({ popupTheme: next ? 'dark' : 'light' });
  };

  const activeCount = (): number => {
    if (!settings) return 0;
    let n = 0;
    Object.values(settings.pages).forEach(v => { if (v) n++; });
    Object.values(settings.features).forEach(v => { if (v) n++; });
    return n;
  };

  const count = activeCount();

  return (
    <ThemeContext.Provider value={isDark}>
      <div className={[
        'w-[360px] flex flex-col rounded-2xl overflow-hidden transition-colors duration-200',
        isDark ? 'dark bg-[#0f0f0f] text-white' : 'bg-[#f5f5f5] text-gray-900',
      ].join(' ')}>

        {/* Header */}
        <div className={[
          'px-4 pt-4 pb-3 border-b',
          isDark ? 'border-white/[0.07]' : 'border-black/[0.07]',
        ].join(' ')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/icon/48.png" alt="SileoTube" className="h-8 w-auto" />
              <div>
                <div
                  className={['text-base font-bold tracking-tight leading-none', isDark ? 'text-white' : 'text-gray-900'].join(' ')}
                  style={{ fontFamily: 'var(--brand-font)' }}
                >
                  SileoTube
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                  by <img src="/icon/workvarLogo.png" alt="WorkVar" className="h-2.5 w-auto opacity-60 inline-block" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={handleToggleTheme}
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-xl border transition-all duration-150 cursor-pointer',
                  isDark
                    ? 'bg-white/[0.06] border-white/[0.1] text-gray-400 hover:bg-white/[0.1]'
                    : 'bg-black/[0.05] border-black/[0.08] text-gray-500 hover:bg-black/[0.09]',
                ].join(' ')}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
              </button>

              {/* Extension on/off */}
              <button
                type="button"
                onClick={handleToggleExtension}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                  'border transition-all duration-150 cursor-pointer',
                  isEnabled
                    ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/15'
                    : isDark
                    ? 'bg-white/[0.06] border-white/[0.1] text-gray-400 hover:bg-white/[0.1]'
                    : 'bg-black/[0.05] border-black/[0.08] text-gray-500 hover:bg-black/[0.09]',
                ].join(' ')}
              >
                <Power size={12} strokeWidth={2.5} />
                {isEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Active count pill */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className={[
              'text-[10px] font-bold px-2 py-0.5 rounded-full',
              count > 0
                ? 'bg-red-500/15 text-red-400'
                : isDark ? 'bg-white/[0.06] text-gray-500' : 'bg-black/[0.05] text-gray-400',
            ].join(' ')}>
              {count}
            </span>
            <span className={['text-[11px]', isDark ? 'text-gray-500' : 'text-gray-400'].join(' ')}>
              {count === 1 ? 'filter' : 'filters'} active
            </span>
          </div>
        </div>

        {/* Grid settings */}
        <div className="pt-4">
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            loading={loading}
            isEnabled={isEnabled}
          />
        </div>

        {/* Footer */}
        <div className={['px-4 py-2.5 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'].join(' ')}>
          <p className={['text-[10px] text-center', isDark ? 'text-gray-600' : 'text-gray-400'].join(' ')}>
            Changes apply immediately
          </p>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Popup;
