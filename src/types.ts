export type FeatureSettingType = 'color' | 'text' | 'boolean' | 'number';

export type FeatureSettingValue = string | number | boolean;

export interface FeatureSetting {
    key: string;
    type: FeatureSettingType;
    label: string;
    defaultValue: FeatureSettingValue;
    description?: string;
}

export interface Feature<T = Record<string, FeatureSettingValue>> {
    id: string;
    name: string;
    description: string;
    matches: (string | RegExp)[];
    initialState: boolean;
    settingsSchema?: FeatureSetting[];
    execute: (settings?: T) => void | Promise<void>;
    cleanup?: () => void | Promise<void>;
}
