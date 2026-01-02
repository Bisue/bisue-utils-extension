import { FeatureSettingValue } from '../types';

const STATE_KEY = 'feature_states';
const SETTINGS_KEY = 'feature_settings';

export interface FeatureStateMap {
    [featureId: string]: boolean;
}

export interface FeatureSettingsMap {
    [featureId: string]: Record<string, FeatureSettingValue>;
}

export const storage = {
    // --- Feature States (On/Off) ---
    async getFeatureStates(): Promise<FeatureStateMap> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(STATE_KEY);
            return (result[STATE_KEY] as FeatureStateMap) || {};
        }
        return {};
    },

    async setFeatureState(featureId: string, isEnabled: boolean): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const states = await this.getFeatureStates();
            states[featureId] = isEnabled;
            await chrome.storage.local.set({ [STATE_KEY]: states });
        }
    },

    async isFeatureEnabled(featureId: string, defaultState: boolean): Promise<boolean> {
        const states = await this.getFeatureStates();
        if (featureId in states) {
            return states[featureId];
        }
        return defaultState;
    },

    // --- Feature Settings (Custom Values) ---
    async getFeatureSettingsAll(): Promise<FeatureSettingsMap> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(SETTINGS_KEY);
            return (result[SETTINGS_KEY] as FeatureSettingsMap) || {};
        }
        return {};
    },

    async getFeatureSettings<T = Record<string, FeatureSettingValue>>(featureId: string): Promise<T> {
        const allSettings = await this.getFeatureSettingsAll();
        return (allSettings[featureId] as T) || ({} as T);
    },

    async setFeatureSetting(featureId: string, key: string, value: FeatureSettingValue): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const allSettings = await this.getFeatureSettingsAll();
            if (!allSettings[featureId]) allSettings[featureId] = {};

            allSettings[featureId][key] = value;
            await chrome.storage.local.set({ [SETTINGS_KEY]: allSettings });
        }
    }
};
