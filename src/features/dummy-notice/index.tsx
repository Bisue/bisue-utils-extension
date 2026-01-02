import { Feature } from '../../types';

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
    // No execute/cleanup needed anymore!
    component: ({ settings }) => {
        return (
            <div 
                className= "fixed top-0 left-0 w-full p-3 text-center shadow-md z-[9999]"
        style = {{ backgroundColor: settings.backgroundColor || '#ffcc00' }
    }
            >
    <span className="font-bold text-black text-sm" >
        { settings.text || 'Chrome Extension Active' }
        </span>
        </div>
        );
    }
};

export default dummyNoticeFeature;
