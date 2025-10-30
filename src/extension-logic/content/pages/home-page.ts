// Homepage distraction remover plain JS content script


// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
    // insert new search bar
    const insertSearchBar = () => {
      const targetContent = document.querySelector("#content")
      const searchBarDivision = document.createElement('div');
      searchBarDivision.id = 'sileotube-search-bar';
      const heading = document.createElement('h1');
      heading.id = 'sileotube-search-bar-heading';
      heading.textContent = 'Remember what you came for!';
      searchBarDivision.appendChild(heading);
      const searchBarContainer = document.createElement('div');
      const searchBarInput = document.createElement('input');
      searchBarInput.id = 'sileotube-search-bar-input';
      searchBarInput.placeholder = 'Search';
      searchBarInput.type = 'text';
      searchBarInput.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        const youtubeSearchInput = document.querySelector('#center > yt-searchbox > div.ytSearchboxComponentInputBox.ytSearchboxComponentInputBoxDark > form > input') as HTMLInputElement;
        if (youtubeSearchInput) {
          youtubeSearchInput.value = target.value;
          youtubeSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      searchBarContainer.appendChild(searchBarInput);
      const searchBarButton = document.createElement('button');
      searchBarButton.id = 'sileotube-search-bar-button';
      searchBarButton.textContent = 'Search';
      searchBarButton.addEventListener('click', () => {
        const youtubeSearchButton = document.querySelector('#center > yt-searchbox > button') as HTMLButtonElement;
        if (youtubeSearchButton) {
          youtubeSearchButton.click();
        }
      });
      searchBarContainer.appendChild(searchBarButton);
      searchBarDivision.appendChild(searchBarContainer);
      targetContent?.prepend(searchBarDivision);
    }
    const removeSearchBar = () => {
      const searchBar = document.getElementById('sileotube-search-bar');
      if (searchBar) {
        searchBar.remove();
      }
    }

    const applyStyles = () => {
      const _style = document.getElementById('sileotube-homepage-focus');
      if (_style) _style.remove();

      const sileotubeStyles = document.createElement('style')
      sileotubeStyles.id = 'sileotube-homepage-focus'
      sileotubeStyles.textContent = `
              ytd-rich-item-renderer {
                display: none;
              }
              ytd-ghost-grid-renderer {
                display: none;
              }
              ytd-continuation-item-renderer {
                display: none;
              }
              ytd-rich-section-renderer {
                display: none;
              }
              #header {
                display: none;
              }
              body > ytd-app { 
                background-color: #3C3C3C;
                min-height: 100vh;
                position: relative;
              }
              #frosted-glass {
                display: none;
              }

              #content {
                postision: absolute;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 1 rem;
                padding: 1rem;
              }

              #sileotube-search-bar {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                top: 35%;
                position: absolute;
              }

              #sileotube-search-bar-heading {
                color: white;
                font-size: 4rem;
                font-weight: 600;
                margin: 0 0 1rem 0;
                text-align: center;
              }

              #sileotube-search-bar > div {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 0;
              }

              #sileotube-search-bar > div > input {
                width: 40vw;
                height: 40px;
                border: none;
                outline: none;
                border-radius: 20px 0 0 20px;
                padding: 0 15px;
                background-color: #121212;
                color: white;
              }

              #sileotube-search-bar > div > button {
                width: 120px;
                height: 40px;
                border: none;
                outline: none;
                background-color:rgb(255, 64, 64);
                color: white;
                border-radius: 0 20px 20px 0;
                cursor: pointer;
              }

              #center > yt-searchbox {
                visibility: hidden;
              }
            `
      document.documentElement.appendChild(sileotubeStyles)
      setTimeout(() => {
        insertSearchBar();
      }, 500);
      return;
    }

    const removeStyles = () => {
      console.log("Remove Styles")
      const _style = document.getElementById('sileotube-homepage-focus');
      if (_style) _style.remove();
      console.log("Remove Search Bar after 500ms")
      setTimeout(() => {
        removeSearchBar();
      }, 500);
      return;
    }
    // Handle PING from background script
    if (msg && msg.type === 'PING') {
      sendResponse({ type: 'PONG' });
      return true;
    }
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
      if (msg.path === '/') {
        // If enabled and style is not in the document, inject the style
        if (msg.enabled) {
          applyStyles();
        }
        // If disabled and style is in the document, remove the style
        else {
          setTimeout(() => {
            removeStyles();
          }, 500);
        }
      } else {
        removeStyles();
      }
    }
  });
})();
