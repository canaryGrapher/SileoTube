// Homepage distraction remover plain JS content script

const getRandomBackgroundImage = () => {
  const backgroundImages = [
    {
      url: 'https://ik.imagekit.io/canarygrapher/sileotube/images/photo-1761807446688-d87aea44ecb2_7xuNdATP_.jpg?updatedAt=1761851430009',
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
      url: "https://ik.imagekit.io/canarygrapher/sileotube/images/photo-1761074499285-5ab0e10b07ee_U-WfwKOAk.jpg?updatedAt=1761851429999",
      description: "A squirrel sitting on a wooden post",
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
      url: "https://ik.imagekit.io/canarygrapher/sileotube/images/deadlifting_2U_KrIN0y.jpeg?updatedAt=1761851083757",
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
      url: "https://ik.imagekit.io/canarygrapher/sileotube/images/photo-1513113406068-fff36fa8f987_hzU4MquCFc.jpg",
      description: "Two people riding in car on road",
      photographer: {
        name: "Nick Brugiono",
        url: "https://unsplash.com/@nickbrugioni"
      },
      source: {
        name: "Unsplash",
        url: "https://unsplash.com/photos/two-people-riding-in-car-on-road-RsAMlfzza9Y"
      }
    }
  ]
  return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
}

const insertSearchBar = () => {
  const targetContent = document.querySelector("#content")
  const searchBarDivision = document.createElement('div');
  searchBarDivision.id = 'sileotube-search-bar';
  const heading = document.createElement('h1');
  heading.id = 'sileotube-search-bar-heading';
  heading.textContent = 'What are you watching today?';
  searchBarDivision.appendChild(heading);
  const searchBarContainer = document.createElement('div');
  searchBarContainer.id = 'sileotube-search-bar-box';
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
  searchBarInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selfButton = document.getElementById('sileotube-search-bar-button') as HTMLButtonElement | null;
      selfButton?.click();
    }
  });
}

const removeSearchBar = () => {
  const searchBar = document.getElementById('sileotube-search-bar');
  if (searchBar) {
    searchBar.remove();
  }
}

const AddHomePageOptimizations = () => {
  const _style = document.getElementById('sileotube-homepage-focus');
  if (_style) {
    return
  }

  
  const sileotubeStyles = document.createElement('style')
  sileotubeStyles.id = 'sileotube-homepage-focus'
  const bg = getRandomBackgroundImage();
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
          background-image: url('${bg.url}');
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

        #background {
          display: none;
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
          font-size: 5rem;
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
          box-shadow: 0 0 8px 2px rgb(166, 0, 0), 0 0 8px 2px rgb(166, 0, 0);
          border: 1px solid rgb(166, 0, 0);
        }

        #sileotube-search-bar-box {
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          border: 1px solid #000;
          border-radius: 10px;
          overflow: hidden;
        }

        #sileotube-search-bar > div > input {
          width: 35vw;
          height: 50px;
          border: none;
          outline: none;
          font-size: 16px;
          border-radius: 10px 0 0 10px;
          padding: 0 15px;
          background-color: rgba(18, 18, 18, 0.7);
          color: white;
        }

        #sileotube-search-bar > div > button {
          width: 120px;
          height: 50px;
          border: none;
          outline: none;
          background-color: #FF0000;
          color: white;
          border-radius: 0 10px 10px 0;
          cursor: pointer;
        }

        #sileotube-search-bar-button:hover {
          background-color:rgb(166, 0, 0);
        }

        #center > yt-searchbox, #center > yt-icon-button, #center > #voice-search-button, #center > #ai-companion-button {
          visibility: hidden;
        }

        #sileotube-image-ack {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.9);
          font-size: 12px;
          text-align: center;
        }

        .sileotube-image-ack-description {
          font-size: 18px;
          text-align: center;
          padding-bottom: 10px;
        }

        .sileotube-image-ack-photographer { 
          color: #979797; 
          font-size: 12px;
        }

        .sileotube-image-ack-photographer a { 
          color: #979797;    
          text-decoration: underline; 
          cursor: pointer;
        }
      `
  document.documentElement.appendChild(sileotubeStyles)
  setTimeout(() => {
    insertSearchBar();
    const existingAck = document.getElementById('sileotube-image-ack');
    if (existingAck) existingAck.remove();
    const ack = document.createElement('div');
    ack.id = 'sileotube-image-ack';
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'sileotube-image-ack-description';
    descriptionDiv.textContent = bg.description;
    ack.appendChild(descriptionDiv);
    
    const photographerDiv = document.createElement('div');
    photographerDiv.className = 'sileotube-image-ack-photographer';
    photographerDiv.textContent = 'Photo by ';
    
    const photographerLink = document.createElement('a');
    photographerLink.href = bg.photographer.url;
    photographerLink.target = '_blank';
    photographerLink.rel = 'noopener noreferrer';
    photographerLink.textContent = bg.photographer.name;
    photographerDiv.appendChild(photographerLink);
    
    photographerDiv.appendChild(document.createTextNode(' on '));
    
    const sourceLink = document.createElement('a');
    sourceLink.href = bg.source.url;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = bg.source.name;
    photographerDiv.appendChild(sourceLink);
    
    ack.appendChild(photographerDiv);
    document.body.appendChild(ack);
  }, 500);
  return;
}


const RemoveHomePageOptimizations = () => {
  const _style = document.getElementById('sileotube-homepage-focus');
  if (_style) _style.remove();

  setTimeout(() => {
    removeSearchBar();
    const ack = document.getElementById('sileotube-image-ack');
    if (ack) ack.remove();
  }, 500);
  return;
}

const HomePageOptimizations = (enabled: boolean, pagePath: string) => {
  if(pagePath === '/') {
    if(enabled) {
      AddHomePageOptimizations();
    } else {
      RemoveHomePageOptimizations();
    }
  } else {
    RemoveHomePageOptimizations();
  }
  return;
}

export default HomePageOptimizations;