// Homepage distraction remover plain JS content script
// - check if msg.

// Plain JS content script — do not use import statements here (keeps it non-module)
(function () {
  const browser = (globalThis as any).browser || (globalThis as any).chrome;

  const pageBackground = {
    url: 'https://ik.imagekit.io/canarygrapher/sileotube/images/Netflix_gJt-_mp3Z.png?updatedAt=1761850643241',
    description: 'A television with Netflix logo lit on it',
    photographer: {
      name: 'Thibault Penin',
      url: 'https://unsplash.com/@thibaultpenin'
    },
    source: {
      name: 'Unsplash',
      url: 'https://unsplash.com/photos/a-television-with-the-netflix-logo-lit-up-in-the-dark-GrzoKN1aqSg'
    }
  }

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
    background-color: #3C3C3C;
    background-image: url('${pageBackground.url}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    margin-bottom: 1rem;
  }


  /* Center panel */
  #sileotube-shorts-blocker-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem 3rem;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  /* Heading */
  #sileotube-shorts-blocker-heading {
    color: #ffffff;
    text-align: center;
    font-size: 6rem;
    line-height: 1.1;
    font-weight: 600;
  }

  /* Red action button */
  #sileotube-shorts-blocker-home-button {
    padding: 0 24px;
    height: 52px;
    min-width: 240px;
    color: #ffffff;
    background-color: #FF0000;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
  }

  #sileotube-shorts-blocker-home-button:hover {
    background-color:rgb(166, 0, 0);
  }

  /* Image acknowledgement */
  #sileotube-shorts-image-ack {
    margin-top: 8px;
    color: rgba(255,255,255,0.9);
    font-size: 12px;
    text-align: center;
  }
  .sileotube-shorts-image-ack-description { font-size: 14px; padding-bottom: 6px; }
  .sileotube-shorts-image-ack-photographer { color: #979797; font-size: 12px; }
  .sileotube-shorts-image-ack-photographer a { color: #979797; text-decoration: underline; cursor: pointer; }
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

    // Center panel
    const center = document.createElement('div');
    center.id = 'sileotube-shorts-blocker-center';

    // Heading
    const heading = document.createElement('h1');
    heading.id = 'sileotube-shorts-blocker-heading';
    heading.innerHTML = 'Shorts?<br/>Seriously?';
    center.appendChild(heading);

    // Button
    const homeButton = document.createElement('button');
    homeButton.id = 'sileotube-shorts-blocker-home-button';
    homeButton.textContent = 'Take me back to focus mode!';
    homeButton.onclick = () => window.location.href = '/';
    center.appendChild(homeButton);

    // Image acknowledgement
    const existingAck = document.getElementById('sileotube-shorts-image-ack');
    if (existingAck) existingAck.remove();
    const ack = document.createElement('div');
    ack.id = 'sileotube-shorts-image-ack';
    ack.innerHTML = `<div class="sileotube-shorts-image-ack-description">${pageBackground.description}</div><div class="sileotube-shorts-image-ack-photographer">Photo by <a href="${pageBackground.photographer.url}" target="_blank" rel="noopener noreferrer">${pageBackground.photographer.name}</a> on <a href="${pageBackground.source.url}" target="_blank" rel="noopener noreferrer">${pageBackground.source.name}</a></div>`;
    center.appendChild(ack);

    overlayElement.appendChild(center);

    shortsContainer?.appendChild(overlayElement);
  }

  // Remove styles and overlay from the shorts page
  const removeStylesAndOverlay = () => {
    const style = document.getElementById('sileotube-shorts-blocker-focus');
    const overlayElement = document.getElementById('sileotube-shorts-blocker-overlay');
    const ack = document.getElementById('sileotube-shorts-image-ack');
    if (overlayElement) overlayElement.remove();
    if (ack) ack.remove();
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
        }, 500);
      }
    }
  });
})();