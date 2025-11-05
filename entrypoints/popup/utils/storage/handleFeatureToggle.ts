import { browser } from 'wxt/browser';
import { StorageTypes } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

// Handle setting toggle
const handleFeatureToggle = async (
  category: keyof StorageTypes.ExtensionSettingsProps,
  key: string,
  value: boolean,
  setSettings: Dispatch<SetStateAction<StorageTypes.ExtensionSettingsProps | null>>
) => {
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
      setSettings((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: value,
          },
        }
      });
    } 
    else {
      console.error('Failed to update setting:', (response as { error: string }).error);
    }
  } catch (error) {
    console.error('Error updating setting:', error);
  }
};

export { handleFeatureToggle };