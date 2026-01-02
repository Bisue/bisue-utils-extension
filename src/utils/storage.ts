const STORAGE_KEY = 'feature_states';

export interface FeatureStateMap {
    [featureId: string]: boolean;
}

export const storage = {
    async getFeatureStates(): Promise<FeatureStateMap> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(STORAGE_KEY);
            return (result[STORAGE_KEY] as FeatureStateMap) || {};
        }
        return {};
    },

    async setFeatureState(featureId: string, isEnabled: boolean): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const states = await this.getFeatureStates();
            states[featureId] = isEnabled;
            await chrome.storage.local.set({ [STORAGE_KEY]: states });
        }
    },

    async isFeatureEnabled(featureId: string, defaultState: boolean): Promise<boolean> {
        const states = await this.getFeatureStates();
        if (featureId in states) {
            return states[featureId];
        }
        return defaultState;
    },
};
