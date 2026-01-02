import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import { features } from '../features/registry';
import { storage, FeatureStateMap, FeatureSettingsMap } from '../utils/storage';
import { isUrlMatched } from '../utils/url-matcher';
import { Feature } from '../types';
import { createShadowWrapper, removeShadowWrapper } from '../utils/dom';
import styles from '../index.css?inline';

const activeFeatures = new Set<string>();
const activeRoots = new Map<string, Root>();

async function toggleFeature(feature: Feature, shouldEnable: boolean) {
    if (shouldEnable) {
        // Enable or Update
        const settings = await storage.getFeatureSettings(feature.id);
        console.log(`[Extension] Executing feature: ${feature.name}`);

        // 1. Handle 'execute' function
        if (feature.execute) {
            await feature.execute(settings);
        }

        // 2. Handle React Component
        if (feature.component) {
            // Create Shadow DOM wrapper
            const wrapperId = `${feature.id}-root`;
            // Check if already exists (for updates)
            let { shadowRoot, container } = createShadowWrapper(wrapperId);

            // Inject Styles (Tailwind) if not present
            if (!shadowRoot.querySelector('style[data-extension-styles]')) {
                const styleTag = document.createElement('style');
                styleTag.setAttribute('data-extension-styles', '');
                styleTag.textContent = styles;
                shadowRoot.appendChild(styleTag);
            }

            // Render React Component
            let root = activeRoots.get(feature.id);
            if (!root) {
                root = createRoot(container);
                activeRoots.set(feature.id, root);
            }

            const Component = feature.component;
            root.render(React.createElement(Component, { settings }));
        }

        activeFeatures.add(feature.id);
    } else {
        // Disable
        if (activeFeatures.has(feature.id)) {
            console.log(`[Extension] Disabling feature: ${feature.name}`);

            // 1. Cleanup 'execute' logic
            if (feature.execute && feature.cleanup) {
                await feature.cleanup();
            }

            // 2. Cleanup React Component
            if (feature.component) {
                const root = activeRoots.get(feature.id);
                if (root) {
                    root.unmount();
                    activeRoots.delete(feature.id);
                }
                removeShadowWrapper(`${feature.id}-root`);
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
                        // If settings changed, re-execute/re-render
                        // toggleFeature handles "update" logic when passed true
                        toggleFeature(feature, true);
                    }
                }
            }
        }
    });
}

init();
