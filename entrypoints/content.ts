import { features, pages } from "./logic/contents";

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    // alert("YouTube content script loaded");
    // listen for messages from background script
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'SILEOTUBE:YOUTUBE PAGE UPDATED') {
        
        // For Page wise optimizations
        pages.HomePageOptimizations(message.settings.pages.homepage, message.path);
        pages.WatchPageOptimizations(message.settings.pages.watch, message.path);
        pages.ShortsPageOptimizations(message.settings.pages.shorts, message.path);

        // For Feature wise optimizations
        features.WatchCommentsOptimizations(message.settings.features.comments);
        features.SidebarRemovalOptimizations(message.settings.features.sidebar);
        features.ShortsRecommendationsOptimizations(message.settings.features.shortsRecommendations);
      }
    });
  },
});
