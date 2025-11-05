// Remove shorts recommendations from result page
// - 1: Check if msg.path is /results
// - 2: Check if storage.local.get('settings').result is true
// - 3: Check if style.id is already in the document
// - if 2 is true and 3 is false, then inject code to remove shorts recommendations
// - if 2 is false, then remove the style.id from the document if 3 is true

const removeShortsRecommendations = async () => {
    const checkStylesExists = document.getElementById('sileotube-shorts-recommendation-removal');
    if (checkStylesExists) {
        return;
    }
    // Inject the style to remove shorts recommendations
    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-shorts-recommendation-removal'
    sileotubeStyles.textContent = `
        #contents > grid-shelf-view-model { 
          display: none; 
        }
        ytd-video-renderer:has(a[href^="/shorts/"]) {
          display: none;
        }
        #items > ytd-mini-guide-entry-renderer[aria-label='Shorts'] {
          display: none;
        }
        ytd-rich-section-renderer {
          display: none;
        }
        #contents > ytd-reel-shelf-renderer {
          display: none;
        }
        ytd-reel-shelf-renderer {
          display: none;
        }
    `
    document.documentElement.appendChild(sileotubeStyles)
}

const showShortsRecommendations = () => {
    const style = document.getElementById('sileotube-shorts-recommendation-removal');
    if (style) {
        style.remove();
    }
}

const ShortsRecommendationsOptimizations = (enabled: boolean) => {
    if (enabled) {
        removeShortsRecommendations();
    } else {
        showShortsRecommendations();
    }
}

export default ShortsRecommendationsOptimizations;