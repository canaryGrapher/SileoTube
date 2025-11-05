import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    "name": "SileoTube",
    "version": "2.0.0",
    "version_name": "Stable-2.0",
    "description": "A calming, decluttered YouTube experience.",
    permissions: [
      'storage',
      'tabs',
    ],
    browser_specific_settings: {
      gecko: {
        id: "@sileotube-worvar.com",
        // @ts-ignore - data_collection_permissions is a Firefox-specific property not yet in WXT types
        data_collection_permissions: {
          required: ["none"] // "none" indicates no data collection
        }
      }
    },
  } as any,
});
