import { features } from '../features/registry';
import { storage } from '../utils/storage';
import { isUrlMatched } from '../utils/url-matcher';

async function init() {
    const currentUrl = window.location.href;
    console.log('[Extension] Content script loaded for:', currentUrl);

    for (const feature of features) {
        if (isUrlMatched(currentUrl, feature.matches)) {
            const isEnabled = await storage.isFeatureEnabled(feature.id, feature.initialState);
            if (isEnabled) {
                console.log(`[Extension] Executing feature: ${feature.name}`);
                feature.execute();
            }
        }
    }
}

init();
