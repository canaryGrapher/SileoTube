// Apply grayscale filter to all YouTube thumbnails
const applyGrayscaleThumbnails = async () => {
    // Check if styles already exist to prevent duplicates
    const existingStyles = document.getElementById('sileotube-grayscale-thumbnails');
    console.log('Styles already applied: ', existingStyles);
    if (existingStyles) {
        return; // Already applied
    }

    const sileotubeStyles = document.createElement('style')
    sileotubeStyles.id = 'sileotube-grayscale-thumbnails'
    sileotubeStyles.textContent = `
        #thumbnail > yt-image > img, 
        yt-thumbnail-view-model > div > img, 
        .yt-spec-avatar-shape__image,
        #img {
            filter: grayscale(100%) !important;
        }
    `
    console.log('Applying grayscale thumbnails styles: ', sileotubeStyles);
    document.documentElement.appendChild(sileotubeStyles);

}

const removeGrayscaleThumbnails = async () => {
    console.log('Removing grayscale thumbnails styles');
    const grayscaleStyles = document.getElementById('sileotube-grayscale-thumbnails');
    if (grayscaleStyles) {
        grayscaleStyles.remove();
    }
}


const GrayscaleThumbnailsOptimizations = (enabled: boolean) => {
    console.log('Grayscale thumbnails optimizations: ', enabled);
    if (enabled) {
        applyGrayscaleThumbnails();
    } else {
        removeGrayscaleThumbnails();
    }
}

export default GrayscaleThumbnailsOptimizations;