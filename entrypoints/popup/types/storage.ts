interface ExtensionSettingsProps {
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

interface SettingsPanelProps {
    onSettingChange?: (category: keyof ExtensionSettingsProps, key: string, value: boolean) => void;
}


interface SettingToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export type { ExtensionSettingsProps, SettingsPanelProps, SettingToggleProps };