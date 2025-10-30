// Homepage distraction remover plain JS content script


// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {

    const getRandomBackgroundImage = () => {
      const backgroundImages = [
        {
          url: 'https://images.unsplash.com/photo-1761807446688-d87aea44ecb2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
          description: "Woman looking out in a forest setting",
          photographer: {
            name: 'Valentina Kondrasyuk',
            url: 'https://unsplash.com/@valentinakond'
          },
          source: {
            name: "Unsplash",
            url: "https://unsplash.com/photos/woman-looking-out-in-a-forest-setting-A8JPF1-kixA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          }
        },
        {
          url: "https://images.unsplash.com/photo-1761074499285-5ab0e10b07ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
          description: "A squirrel sits on a wooden post",
          photographer: {
            name: "Dmytro Koplyk",
            url: "https://unsplash.com/@dkoplyk"
          },
          source: {
            name: "Unsplash",
            url: "https://unsplash.com/photos/a-squirrel-sits-on-a-wooden-post-1h8KSlNeYek"
          }
        },
        {
          url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
          description: "Man deadlifting weights",
          photographer: {
            name: "Victor Freitas",
            url: "https://unsplash.com/@victorfreitas"
          },
          source: {
            name: "Unsplash",
            url: "https://unsplash.com/photos/man-holding-dumbbells-qZ-U9z4TQ6A"
          }
        },
        {
          url: "https://images.unsplash.com/photo-1513113406068-fff36fa8f987?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
          description: "Two people riding in car on road",
          photographer: {
            name: "Nick Brugiono",
            url: "https://unsplash.com/@nickbrugioni"
          },
          source: {
            name: "Unsplash",
            url: "https://unsplash.com/photos/two-people-riding-in-car-on-road-RsAMlfzza9Y"
          }
        },
        {
          url: "https://images.unsplash.com/photo-1506606401543-2e73709cebb4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
          description: "Aerial photo of metropolitan city during night time",
          photographer: {
            name: "Zac Ong",
            url: "https://unsplash.com/@zacong"
          },
          source: {
            name: "Unsplash",
            url: "https://unsplash.com/photos/aerials-photo-of-metropolitan-during-night-time-JHN1-mpgXjo"
          }
        }
      ]
      return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    }
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
                background-image: url('${getRandomBackgroundImage().url}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
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

              #center > yt-searchbox, #center > yt-icon-button, #center > #voice-search-button, #center > #ai-companion-button {
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
