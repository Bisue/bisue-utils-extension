import { Feature } from '../../types';


interface VolumeBoosterSettings {
    level: number;
}

const volumeBoosterFeature: Feature<VolumeBoosterSettings> = {
    id: 'volume-booster',
    name: '탭 볼륨 증폭기',
    description: '현재 탭의 소리 크기를 최대 500%까지 증폭합니다.',
    matches: [], // All pages
    initialState: false, // Default off
    settingsSchema: [
        {
            key: 'level',
            type: 'range',
            label: '증폭 레벨 (1.0 = 기본)',
            defaultValue: 1.0,
            min: 1.0,
            max: 5.0,
            step: 0.1
        }
    ],
    component: ({ settings }) => {
        // Logic to inject script and send messages
        const level = settings.level || 1.0;

        // 1. Inject Script (idempotent check inside script)
        if (!document.getElementById('bisue-volume-booster-script')) {
            const script = document.createElement('script');
            script.id = 'bisue-volume-booster-script';
            script.src = chrome.runtime.getURL('volume-booster-script.js');
            (document.head || document.documentElement).appendChild(script);
        }

        // 2. Send Message to Update Volume
        window.postMessage({ type: 'BISUE_VOLUME_BOOST', level }, '*');

        // UI Indicator
        if (level <= 1.0) return null;

        return (
            <div className="fixed top-4 right-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg z-[99999] pointer-events-none opacity-90 font-mono text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span>🔊</span>
                <span>{Math.round(level * 100)}%</span>
            </div>
        );
    }
};

export default volumeBoosterFeature;
