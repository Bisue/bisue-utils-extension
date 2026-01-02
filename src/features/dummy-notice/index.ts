import { Feature } from '../../types';

export const dummyNoticeFeature: Feature = {
    id: 'dummy-notice',
    name: '더미 알림',
    description: '모든 페이지 상단에 확장프로그램 실행 중임을 알리는 배너를 표시합니다.',
    matches: [],
    initialState: true,
    settingsSchema: [
        {
            key: 'backgroundColor',
            type: 'color',
            label: '배경 색상',
            defaultValue: '#ffcc00',
        },
        {
            key: 'text',
            type: 'text',
            label: '표시할 텍스트',
            defaultValue: 'Chrome Extension Active: 더미 알림 기능 실행 중'
        }
    ],
    execute: (settings) => {
        // Default values fallback
        const bgColor = settings?.backgroundColor || '#ffcc00';
        const text = settings?.text || 'Chrome Extension Active: 더미 알림 기능 실행 중';

        // Check if checks already exists to update it (Real-time update)
        let banner = document.getElementById('dummy-notice-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'dummy-notice-banner';
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.textAlign = 'center';
            banner.style.padding = '10px';
            banner.style.zIndex = '999999';
            banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            document.body.appendChild(banner);
        }

        // Apply dynamic styles/content
        banner.innerText = text;
        banner.style.backgroundColor = bgColor;
        banner.style.color = '#000'; // Contrast logic could be added here
    },
    cleanup: () => {
        const banner = document.getElementById('dummy-notice-banner');
        if (banner) {
            banner.remove();
        }
    },
};
