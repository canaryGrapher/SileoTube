const showComments = () => {
    const style = document.getElementById('sileotube-watch-page-comments-focus');
    if (style) {
        style.remove();
    }
}

const removeComments = () => {
    const style = document.getElementById('sileotube-watch-page-comments-focus');

    if (style) {
        style.remove();
    }
    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-watch-page-comments-focus'
    sileotubeStyles.textContent = `
    .ytd-comments {
      display: none;
    }
  `
    document.documentElement.appendChild(sileotubeStyles)
}

const WatchCommentsOptimizations = (enabled: boolean) => {
    if (enabled) {
        removeComments();
    } else {
        showComments();
    }
}

export default WatchCommentsOptimizations;