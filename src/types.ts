export type FeatureSettingType = 'color' | 'text' | 'boolean' | 'number';

export interface FeatureSetting {
    key: string;
    type: FeatureSettingType;
    label: string;
    defaultValue: any;
    description?: string;
    // Options for select/radio, min/max for number, etc. could be added here
}

export interface Feature<T = any> {
    id: string;
    name: string;
    description: string;
    matches: (string | RegExp)[];
    initialState: boolean;
    settingsSchema?: FeatureSetting[];
    execute: (settings?: T) => void | Promise<void>;
    cleanup?: () => void | Promise<void>;
}
