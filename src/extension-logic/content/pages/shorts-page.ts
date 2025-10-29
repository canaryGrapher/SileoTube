// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;
  // Apply styles to the shorts page
  const applyStyles = () => {
    const _style = document.getElementById('sileotube-shorts-blocker-focus');

    if (_style) {
      _style.remove();
    }

    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-shorts-blocker-focus'
    sileotubeStyles.textContent = `
  /* Container for the overlay */
  #sileotube-shorts-blocker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #3C3C3C;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    margin-bottom: 1rem;
  }


  /* Text for the overlay */
  #sileotube-shorts-blocker-text {
    color: white;
    font-size: 3rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  #sileotube-shorts-blocker-text-first-paragraph {
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  #sileotube-shorts-blocker-text-second-paragraph {
    font-size: 1.5rem;
    font-weight: 400;
  }

  /* Container for the blocked image */
  #sileotube-shorts-blocker-blocked-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Blocked image */
  #sileotube-shorts-blocker-blocked-image {
    width: 300px;
    height: 300px;
    object-fit: cover;
    margin: 0;
    padding: 0;
  }

  /* Container for the buttons */
  #sileotube-shorts-blocker-buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  /* Buttons */
  .sileotube-shorts-blocker-button {
    padding: 1rem 2rem;
    display: flex;
    border-radius: 20px;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background-color: #b9a9e0;
    cursor: pointer;
  }

  /* Content for the buttons */
  .sileotube-shorts-blocker-button-content {
    display: flex;
    gap: 2rem;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    width: 2rem;
  }

  .sileotube-shorts-blocker-button-content img {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
  }
`
    document.documentElement.appendChild(sileotubeStyles)
  }

  // Apply overlay to the shorts page
  const applyOverlay = () => {
    const _overlayElement = document.getElementById('sileotube-shorts-blocker-overlay');

    if (_overlayElement) {
      _overlayElement.remove();
    }

    const shortsContainer = document.querySelector("#shorts-container")
    const overlayElement = document.createElement('div')
    overlayElement.id = 'sileotube-shorts-blocker-overlay';

    // a new div to show blocked image
    const blockedImageDiv = document.createElement('div');
    blockedImageDiv.id = 'sileotube-shorts-blocker-blocked-image-container';
    const blockedImage = document.createElement('img');
    blockedImage.id = 'sileotube-shorts-blocker-blocked-image';
    blockedImage.src = 'https://ik.imagekit.io/canarygrapher/sileotube/images/focus_TdrvvtZHu.png?updatedAt=1760077189021';
    blockedImageDiv.appendChild(blockedImage);
    overlayElement.appendChild(blockedImageDiv);

    // Add text "Shorts are disabled"
    const text = document.createElement('div');
    text.id = 'sileotube-shorts-blocker-text';
    const firstParagraph = document.createElement('p');
    firstParagraph.id = 'sileotube-shorts-blocker-text-first-paragraph';
    firstParagraph.textContent = 'Uh oh, getting a little distracted?';
    text.appendChild(firstParagraph);
    const secondParagraph = document.createElement('p');
    secondParagraph.id = 'sileotube-shorts-blocker-text-second-paragraph';
    secondParagraph.textContent = 'You have disabled shorts from your extension, take a moment to reflect on your intentions and feelings.';
    text.appendChild(secondParagraph);
    overlayElement.appendChild(text);

    // add a new div container for the buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'sileotube-shorts-blocker-buttons-container';
    overlayElement.appendChild(buttonsContainer);

    // Create "Home" button
    const homeButton = document.createElement('button');
    homeButton.id = 'sileotube-shorts-blocker-home-button';
    homeButton.classList.add('sileotube-shorts-blocker-button');
    homeButton.textContent = 'Go to Home';
    homeButton.onclick = () => window.location.href = '/';
    buttonsContainer.appendChild(homeButton);

    const insideHomeButton = document.createElement('div');
    insideHomeButton.classList.add('sileotube-shorts-blocker-button-content');
    const homeButtonImage = document.createElement('img');
    homeButtonImage.src = 'https://ik.imagekit.io/canarygrapher/sileotube/shapes/home_-Bt90Nj1R.png?updatedAt=1759994960481';
    insideHomeButton.appendChild(homeButtonImage);
    homeButton.appendChild(insideHomeButton);

    shortsContainer?.appendChild(overlayElement);
  }

  // Remove styles and overlay from the shorts page
  const removeStylesAndOverlay = () => {
    const style = document.getElementById('sileotube-shorts-blocker-focus');
    const overlayElement = document.getElementById('sileotube-shorts-blocker-overlay');
    if (overlayElement) overlayElement.remove();
    if (style) style.remove();
  }
  // Listen to messages from background for URL changes or setting updates
  browser.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
    // Handle PING from background script
    if (msg && msg.type === 'PING') {
      sendResponse({ type: 'PONG' });
      return true;
    }

    // Handle /shorts path
    if (msg && msg.type === 'YOUTUBE_PATH_CHANGED') {
      if (msg.path === '/shorts') {
        // If enabled and style is not in the document, inject the style
        if (msg.enabled) {
          applyStyles();
          applyOverlay();
          const videoElement = document.querySelector("#shorts-player > div.html5-video-container > video")
          if (videoElement && videoElement instanceof HTMLVideoElement) {
            (videoElement as HTMLVideoElement).pause();
          }
        }
        else {
          removeStylesAndOverlay();
        }
      }
      else {
        // If not /shorts path, remove the style and overlay if it exists
        setTimeout(() => {
          removeStylesAndOverlay();
        }, 4000);
      }
    }
  });
})();