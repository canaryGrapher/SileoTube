const addWatchPageOptimizations = () => {
  const style = document.getElementById('sileotube-watch-page-focus');
  if (style) style.remove();

  const sileotubeStyles = document.createElement('style')
  sileotubeStyles.id = 'sileotube-watch-page-focus'
  sileotubeStyles.textContent = `
    #secondary {
      display: none;
    }
  `
  document.documentElement.appendChild(sileotubeStyles)
}

const removeWatchPageOptimizations = () => {
  const style = document.getElementById('sileotube-watch-page-focus');
  if (style) style.remove();
}

const WatchPageOptimizations = (enabled: boolean, pagePath: string) => {
  if (pagePath === '/watch') {
    if (enabled) {
      addWatchPageOptimizations();
    } else {
      removeWatchPageOptimizations();
    }
  } else {
    removeWatchPageOptimizations();
  }
  return;
}

export default WatchPageOptimizations;