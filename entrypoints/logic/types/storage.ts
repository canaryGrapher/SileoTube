interface ExtensionSettings {
    pages: {
        homepage: boolean;
        shorts: boolean;
        watch: boolean;
    };
    features: {
        comments: boolean;
        sidebar: boolean;
        shortsRecommendations: boolean;
    };
}

export type { ExtensionSettings };