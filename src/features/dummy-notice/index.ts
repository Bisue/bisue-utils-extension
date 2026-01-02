import { Feature } from '../../types';

export const dummyNoticeFeature: Feature = {
    id: 'dummy-notice',
    name: '더미 알림',
    description: '모든 페이지 상단에 확장프로그램 실행 중임을 알리는 배너를 표시합니다.',
    matches: [], // Match all URLs
    initialState: true,
    execute: () => {
        const banner = document.createElement('div');
        banner.id = 'dummy-notice-banner';
        banner.innerText = 'Chrome Extension Active: 더미 알림 기능 실행 중';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#ffcc00';
        banner.style.color = '#000';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '999999';
        banner.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        document.body.appendChild(banner);
    },
    cleanup: () => {
        const banner = document.getElementById('dummy-notice-banner');
        if (banner) {
            banner.remove();
        }
    },
};
