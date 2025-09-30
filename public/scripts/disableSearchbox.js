(() => {
  // 1. Remove the cloned search box if it exists
  const searchBoxClone = document.querySelector('#centerClone');
  if (searchBoxClone instanceof HTMLElement) {
    searchBoxClone.remove();
  }

  // 2. Restore the original search box
  const searchBox = document.querySelector('#masthead > #container > #center');
  if (searchBox instanceof HTMLElement) {
    // Reset inline styles
    Object.assign(searchBox.style, {
      display: '',
      position: '',
      top: '',
      left: '',
      transform: '',
      zIndex: '',
      width: ''
    });

    // Move it back to its original parent (masthead)
    const masthead = document.querySelector('ytd-masthead #masthead-search-container')
      || document.querySelector('ytd-masthead > #container > #center')
      || document.querySelector('ytd-masthead'); // fallback
    if (masthead instanceof HTMLElement) {
      masthead.appendChild(searchBox);
    }
  }

  // 3. Restore all children inside #contents
  const contentsChildren = document.querySelectorAll('#contents *');
  contentsChildren.forEach((child) => {
    if (child instanceof HTMLElement) {
      child.style.display = '';
    }
  });

  // Clear background styles on #contents
  const recommendationContent = document.querySelector('#contents');
  if (recommendationContent instanceof HTMLElement) {
    recommendationContent.style.backgroundImage = '';
    recommendationContent.style.backgroundRepeat = '';
    recommendationContent.style.backgroundPosition = '';
    recommendationContent.style.backgroundSize = '';
  }

  // 4. Restore the right arrow
  const rightArrow = document.querySelector('#right-arrow');
  if (rightArrow instanceof HTMLElement) {
    rightArrow.style.display = '';
  }
})();