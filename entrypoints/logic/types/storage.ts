interface ExtensionSettings {
    extensionEnabled: boolean;
    pages: {
        homepage: boolean;
        shorts: boolean;
        watch: boolean;
    };
    features: {
        comments: boolean;
        sidebar: boolean;
        shortsRecommendations: boolean;
        grayscaleThumbnails: boolean;
    };
}

export type { ExtensionSettings };