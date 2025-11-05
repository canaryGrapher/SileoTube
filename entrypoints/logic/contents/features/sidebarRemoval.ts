const removeSidebar = () => {
    if (document.getElementById('sileotube-sidebar-removal-focus')) {
        return;
    }

    const sileotubeStyles = document.createElement('style')

    sileotubeStyles.id = 'sileotube-sidebar-removal-focus'
    sileotubeStyles.textContent = `
        #guide {
            display: none;
        }
        #guide-button {
            display: none;
        }
        #page-manager {
            margin: 0;
        }
        #content > ytd-mini-guide-renderer {
            display: none;
        }
  `
    document.documentElement.appendChild(sileotubeStyles)
}

const showSidebar = () => {
    const sileotubeStyles = document.getElementById('sileotube-sidebar-removal-focus');
    if (sileotubeStyles) {
        sileotubeStyles.remove();
    }
}

const SidebarRemovalOptimizations = (enabled: boolean) => {
    if (enabled) {
        removeSidebar();
    } else {
        showSidebar();
    }
}

export default SidebarRemovalOptimizations;