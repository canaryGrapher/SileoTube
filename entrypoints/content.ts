import { features, pages } from "./logic/contents";

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    // alert("YouTube content script loaded");
    // listen for messages from background script
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'SILEOTUBE:YOUTUBE PAGE UPDATED') {
        const isEnabled = message.settings.extensionEnabled !== false; // Default to true if undefined
        
        if (!isEnabled) {
          // Extension is disabled - remove all optimizations
          pages.HomePageOptimizations(false, message.path);
          pages.WatchPageOptimizations(false, message.path);
          pages.ShortsPageOptimizations(false, message.path);
          features.WatchCommentsOptimizations(false);
          features.SidebarRemovalOptimizations(false);
          features.ShortsRecommendationsOptimizations(false);
          features.GrayscaleThumbnailsOptimizations(false);
        } else {
          // Extension is enabled - apply optimizations based on settings
          // For Page wise optimizations
          pages.HomePageOptimizations(message.settings.pages.homepage, message.path);
          pages.WatchPageOptimizations(message.settings.pages.watch, message.path);
          pages.ShortsPageOptimizations(message.settings.pages.shorts, message.path);

          // For Feature wise optimizations
          features.WatchCommentsOptimizations(message.settings.features.comments);
          features.SidebarRemovalOptimizations(message.settings.features.sidebar);
          features.ShortsRecommendationsOptimizations(message.settings.features.shortsRecommendations);
          features.GrayscaleThumbnailsOptimizations(message.settings.features.grayscaleThumbnails);
        }
      }
    });
  },
});
