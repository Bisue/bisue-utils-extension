import { Feature } from '../../types';
import { createShadowWrapper, removeShadowWrapper } from '../../utils/dom';

interface DummyNoticeSettings {
    backgroundColor: string;
    text: string;
}

const dummyNoticeFeature: Feature<DummyNoticeSettings> = {
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
        const bgColor = settings?.backgroundColor || '#ffcc00';
        const text = settings?.text || 'Chrome Extension Active: 더미 알림 기능 실행 중';

        // Use Shadow DOM wrapper
        const { container } = createShadowWrapper('dummy-notice-host');

        // We can now safely use innerHTML or appendChild without affecting the main page
        // And use styles that won't leak out, or be affected by page styles (mostly)

        // Reset container content
        container.innerHTML = '';

        const banner = document.createElement('div');
        banner.innerText = text;
        banner.style.width = '100%';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.backgroundColor = bgColor;
        banner.style.color = '#000';
        banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        container.appendChild(banner);
    },
    cleanup: () => {
        removeShadowWrapper('dummy-notice-host');
    },
};

export default dummyNoticeFeature;
