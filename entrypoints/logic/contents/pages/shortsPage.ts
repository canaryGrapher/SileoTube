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
    document.querySelector("video")?.pause()
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
    heading.appendChild(document.createTextNode('Shorts?'));
    heading.appendChild(document.createElement('br'));
    heading.appendChild(document.createTextNode('Seriously?'));
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
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'sileotube-shorts-image-ack-description';
    descriptionDiv.textContent = pageBackground.description;
    ack.appendChild(descriptionDiv);
    
    const photographerDiv = document.createElement('div');
    photographerDiv.className = 'sileotube-shorts-image-ack-photographer';
    photographerDiv.appendChild(document.createTextNode('Photo by '));
    
    const photographerLink = document.createElement('a');
    photographerLink.href = pageBackground.photographer.url;
    photographerLink.target = '_blank';
    photographerLink.rel = 'noopener noreferrer';
    photographerLink.textContent = pageBackground.photographer.name;
    photographerDiv.appendChild(photographerLink);
    
    photographerDiv.appendChild(document.createTextNode(' on '));
    
    const sourceLink = document.createElement('a');
    sourceLink.href = pageBackground.source.url;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = pageBackground.source.name;
    photographerDiv.appendChild(sourceLink);
    
    ack.appendChild(photographerDiv);
    center.appendChild(ack);

    overlayElement.appendChild(center);

    shortsContainer?.appendChild(overlayElement);
}

const addShortsPageOptimizations = () => {
    // mute the shorts page
    applyStyles();
    applyOverlay();
}

const removeShortsPageOptimizations = () => {
    const style = document.getElementById('sileotube-shorts-blocker-focus');
    const overlayElement = document.getElementById('sileotube-shorts-blocker-overlay');
    const ack = document.getElementById('sileotube-shorts-image-ack');
    if (overlayElement) overlayElement.remove();
    if (ack) ack.remove();
    if (style) style.remove();
}



const ShortsPageOptimizations = (enabled: boolean, pagePath: string) => {
    if (pagePath.includes('/shorts')) {
        if (enabled) {
            addShortsPageOptimizations();
        } else {
            removeShortsPageOptimizations();
        }
    } else {
        removeShortsPageOptimizations();
    }
    return;
}

export default ShortsPageOptimizations;