import { features } from '../features/registry';
import { storage } from '../utils/storage';
import { isUrlMatched } from '../utils/url-matcher';
import { Feature } from '../types';

const activeFeatures = new Set<string>();

async function toggleFeature(feature: Feature, shouldEnable: boolean) {
    if (shouldEnable) {
        if (!activeFeatures.has(feature.id)) {
            console.log(`[Extension] Enabling feature: ${feature.name}`);
            await feature.execute();
            activeFeatures.add(feature.id);
        }
    } else {
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

    const states = await storage.getFeatureStates(); // Load all states once

    // 1. Initial Load
    for (const feature of features) {
        if (isUrlMatched(currentUrl, feature.matches)) {
            const isEnabled = states[feature.id] ?? feature.initialState;
            await toggleFeature(feature, isEnabled);
        }
    }

    // 2. Real-time Updates Listener
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes['feature_states']) {
            const newStates = (changes['feature_states'].newValue || {}) as { [key: string]: boolean };

            for (const feature of features) {
                if (isUrlMatched(currentUrl, feature.matches)) {
                    // If state is not in storage, fallback to initialState (same logic as storage.ts)
                    const isEnabled = newStates[feature.id] ?? feature.initialState;
                    toggleFeature(feature, isEnabled);
                }
            }
        }
    });
}

init();
