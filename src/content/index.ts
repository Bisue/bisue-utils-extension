import { features } from '../features/registry';
import { storage } from '../utils/storage';
import { isUrlMatched } from '../utils/url-matcher';
import { Feature } from '../types';

const activeFeatures = new Set<string>();

async function toggleFeature(feature: Feature, shouldEnable: boolean) {
    if (shouldEnable) {
        // Enable or Update
        // Always get fresh settings when enabling/updating
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
            const newStates = (changes['feature_states'].newValue || {}) as { [key: string]: boolean };
            for (const feature of features) {
                if (isUrlMatched(currentUrl, feature.matches)) {
                    const isEnabled = newStates[feature.id] ?? feature.initialState;
                    toggleFeature(feature, isEnabled);
                }
            }
        }

        // Feature Settings Change
        if (changes['feature_settings']) {
            const newSettingsMap = (changes['feature_settings'].newValue || {}) as { [featureId: string]: any };
            for (const feature of features) {
                // If feature is active, re-execute to apply new settings
                if (activeFeatures.has(feature.id)) {
                    // We can optimize by checking if specific feature settings changed, but re-executing is safer/easier
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
