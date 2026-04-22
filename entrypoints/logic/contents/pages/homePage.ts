// Homepage distraction remover plain JS content script
import waitForElement from '../waitForElement';

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

let suggestDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`,
      { credentials: 'omit' }
    );
    const data = await res.json() as [string, string[]];
    return data[1] ?? [];
  } catch {
    return [];
  }
};

const setupSuggestions = (searchBarInput: HTMLInputElement, dropdown: HTMLElement) => {
  const populate = async (query: string) => {
    if (!query.trim()) { dropdown.style.display = 'none'; return; }
    const suggestions = await fetchSuggestions(query);
    while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
    suggestions.slice(0, 8).forEach(text => {
      const div = document.createElement('div');
      div.className = 'sileotube-suggestion-item';
      div.textContent = text;
      div.addEventListener('mousedown', e => {
        e.preventDefault();
        window.location.href = '/results?search_query=' + encodeURIComponent(text);
      });
      dropdown.appendChild(div);
    });
    dropdown.style.display = dropdown.children.length ? 'block' : 'none';
  };

  searchBarInput.addEventListener('input', (e: Event) => {
    const query = (e.target as HTMLInputElement).value;
    if (suggestDebounceTimer) clearTimeout(suggestDebounceTimer);
    suggestDebounceTimer = setTimeout(() => populate(query), 220);
  });
  searchBarInput.addEventListener('focus', () => {
    if (searchBarInput.value.trim()) populate(searchBarInput.value);
  });
  searchBarInput.addEventListener('blur', () =>
    setTimeout(() => { dropdown.style.display = 'none'; }, 150)
  );
};

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
  searchBarContainer.appendChild(searchBarInput);
  const searchBarButton = document.createElement('button');
  searchBarButton.id = 'sileotube-search-bar-button';
  searchBarButton.textContent = 'Search';
  const performSearch = () => {
    const query = searchBarInput.value.trim();
    if (query) window.location.href = '/results?search_query=' + encodeURIComponent(query);
  };

  searchBarButton.addEventListener('click', performSearch);
  searchBarContainer.appendChild(searchBarButton);

  const suggestionsDropdown = document.createElement('div');
  suggestionsDropdown.id = 'sileotube-suggestions-dropdown';

  const searchBarWrapper = document.createElement('div');
  searchBarWrapper.id = 'sileotube-search-bar-wrapper';
  searchBarWrapper.appendChild(searchBarContainer);
  searchBarWrapper.appendChild(suggestionsDropdown);

  searchBarDivision.appendChild(searchBarWrapper);
  targetContent?.prepend(searchBarDivision);

  setupSuggestions(searchBarInput, suggestionsDropdown);
  searchBarInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
}

const removeSearchBar = () => {
  if (suggestDebounceTimer) clearTimeout(suggestDebounceTimer);
  document.getElementById('sileotube-search-bar')?.remove();
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
        ytd-rich-item-renderer,
        ytd-ghost-grid-renderer,
        ytd-continuation-item-renderer,
        ytd-rich-section-renderer,
        #header,
        #frosted-glass,
        #background {
          display: none !important;
        }

        body > ytd-app {
          min-height: 100vh;
          background-color: #111;
          background-image: url('${bg.url}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        body > ytd-app::after {
          content: '';
          position: fixed;
          inset: 0;
          background: linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
          z-index: 0;
        }

        #content {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        #center > yt-icon-button,
        #center > #voice-search-button,
        #center > #ai-companion-button {
          visibility: hidden;
        }

        #center > yt-searchbox {
          opacity: 0 !important;
          pointer-events: none;
        }

        #sileotube-search-bar {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 3rem 4rem;
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          min-width: 560px;
          max-width: 680px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255,255,255,0.06) inset;
          z-index: 2;
        }

        #sileotube-search-bar-heading {
          color: #ffffff;
          font-size: 2.6rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
          letter-spacing: -0.5px;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
        }

        #sileotube-search-bar-box {
          display: flex;
          flex-direction: row;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          transition: border-color 0.2s;
        }

        #sileotube-search-bar-box:focus-within {
          border-color: rgba(255, 255, 255, 0.32);
        }

        #sileotube-search-bar-input {
          flex: 1;
          height: 54px;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 0 20px;
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-family: inherit;
        }

        #sileotube-search-bar-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        #sileotube-search-bar-input:focus {
          background-color: rgba(255, 255, 255, 0.12);
        }

        #sileotube-search-bar-button {
          width: 110px;
          height: 54px;
          border: none;
          outline: none;
          background-color: #FF0000;
          color: #ffffff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          letter-spacing: 0.2px;
          transition: background-color 0.15s;
        }

        #sileotube-search-bar-button:hover {
          background-color: #cc0000;
        }

        #sileotube-search-bar-wrapper {
          position: relative;
          width: 100%;
        }

        #sileotube-suggestions-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: rgba(12, 12, 12, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          overflow: hidden;
          display: none;
          z-index: 10;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        }

        .sileotube-suggestion-item {
          padding: 11px 18px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.1s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sileotube-suggestion-item:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        #sileotube-image-ack {
          position: fixed;
          bottom: 24px;
          right: 28px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 11px;
          text-align: right;
          z-index: 2;
          line-height: 1.5;
        }

        .sileotube-image-ack-description {
          font-size: 13px;
          font-weight: 500;
          padding-bottom: 3px;
          color: rgba(255,255,255,0.85);
        }

        .sileotube-image-ack-photographer {
          color: rgba(255,255,255,0.5);
          font-size: 11px;
        }

        .sileotube-image-ack-photographer a {
          color: rgba(255,255,255,0.55);
          text-decoration: underline;
          cursor: pointer;
          text-underline-offset: 2px;
        }

        .sileotube-image-ack-photographer a:hover {
          color: rgba(255,255,255,0.85);
        }
      `
  document.documentElement.appendChild(sileotubeStyles)
  waitForElement('#content', () => {
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
    document.documentElement.appendChild(ack);
  }, 500);
  return;
}


const RemoveHomePageOptimizations = () => {
  const _style = document.getElementById('sileotube-homepage-focus');
  if (_style) _style.remove();

  removeSearchBar();
  const ack = document.getElementById('sileotube-image-ack');
  if (ack) ack.remove();
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