// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
    const browser =  (globalThis as any).browser || (globalThis as any).chrome;

    // Listen to messages from background for URL changes or setting updates
    browser.runtime.onMessage.addListener((msg: any, _sender: any, _sendResponse: any) => {
        console.log('msg: ', msg);
      if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
        // small delay to let SPA update DOM if needed
        console.log('YOUTUBE_PATH_CHANGED');
        console.log(msg);
      }
    });
  })();