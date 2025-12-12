import { ExtensionSettings } from "../types";

const DEFAULT_SETTINGS: ExtensionSettings = {
    extensionEnabled: true,
    pages: {
        homepage: true,
        shorts: true,
        watch: true,
    },
    features: {
        comments: true,
        sidebar: false,
        shortsRecommendations: true,
        grayscaleThumbnails: true,
    }
};

export {DEFAULT_SETTINGS};