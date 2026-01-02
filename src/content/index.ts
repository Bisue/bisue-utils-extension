import { features } from '../features/registry';
import { storage, FeatureStateMap, FeatureSettingsMap } from '../utils/storage';
import { isUrlMatched } from '../utils/url-matcher';
import { Feature } from '../types';

const activeFeatures = new Set<string>();

async function toggleFeature(feature: Feature, shouldEnable: boolean) {
    if (shouldEnable) {
        // Enable or Update
        const settings = await storage.getFeatureSettings(feature.id);
        console.log(`[Extension] Executing feature: ${feature.name} with settings:`, settings);
        await feature.execute(settings);
        activeFeatures.add(feature.id);
    } else {
        // Disable
        if (activeFeatures.has(feature.id)) {
            console.log(`[Extension] Disabling feature: ${feature.name}`);
            if (feature.cleanup) {
                await feature.cleanup();
            }
            activeFeatures.delete(feature.id);
        }
    }
}

async function init() {
    const currentUrl = window.location.href;
    console.log('[Extension] Content script loaded for:', currentUrl);

    const states = await storage.getFeatureStates();

    // 1. Initial Load
    for (const feature of features) {
        if (isUrlMatched(currentUrl, feature.matches)) {
            const isEnabled = states[feature.id] ?? feature.initialState;
            await toggleFeature(feature, isEnabled);
        }
    }

    // 2. Real-time Updates Listener (State & Settings)
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
        if (areaName !== 'local') return;

        // Feature State Change
        if (changes['feature_states']) {
            const newStates = (changes['feature_states'].newValue || {}) as FeatureStateMap;
            for (const feature of features) {
                if (isUrlMatched(currentUrl, feature.matches)) {
                    const isEnabled = newStates[feature.id] ?? feature.initialState;
                    toggleFeature(feature, isEnabled);
                }
            }
        }

        // Feature Settings Change
        if (changes['feature_settings']) {
            const newSettingsMap = (changes['feature_settings'].newValue || {}) as FeatureSettingsMap;
            for (const feature of features) {
                if (activeFeatures.has(feature.id)) {
                    if (newSettingsMap[feature.id]) {
                        const settings = newSettingsMap[feature.id];
                        console.log(`[Extension] Settings updated for ${feature.name}`, settings);
                        await feature.execute(settings);
                    }
                }
            }
        }
    });
}

init();
