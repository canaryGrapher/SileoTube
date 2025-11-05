import { ExtensionSettings } from "../types";

const DEFAULT_SETTINGS: ExtensionSettings = {
    pages: {
        homepage: false,
        shorts: false,
        watch: false,
    },
    features: {
        comments: false,
        sidebar: false,
        shortsRecommendations: false,
    }
};

export {DEFAULT_SETTINGS};