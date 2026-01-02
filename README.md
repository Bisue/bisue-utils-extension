# Bisue Utils Extension

**Bisue Utils Extension**은 다양한 웹사이트 유틸리티 기능을 하나의 확장프로그램으로 통합 관리하기 위한 프로젝트입니다.
React, TypeScript, Vite를 기반으로 하며, 높은 유지보수성과 확장성을 위해 **모듈형 아키텍처(Feature-based Architecture)**를 채택했습니다.

## 🛠 기술 스택

- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build**: [Vite](https://vitejs.dev/) (Multi-page & Content Script Bundling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Headless Components), [Lucide React](https://lucide.dev/) (Icons)

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
- Node.js 18+
- pnpm

### 설치 및 실행

1. **프로젝트 클론 및 의존성 설치**
   ```bash
   git clone <repository-url>
   cd bisue-utils-extension
   pnpm install
   ```

2. **개발용 빌드 (권장)**
   소스코드를 난독화하지 않고 SourceMap을 포함하여 디버깅이 용이합니다.
   ```bash
   pnpm build:dev
   ```

3. **프로덕션 빌드**
   배포를 위해 코드를 최적화하고 압축합니다.
   ```bash
   pnpm build
   ```

4. **Chrome에 로드**
   - Chrome 주소창에 `chrome://extensions` 입력
   - 우측 상단 **개발자 모드** 켜기
   - **압축해제된 확장 프로그램을 로드합니다** 클릭
   - 프로젝트 내 `dist/` 폴더 선택

## 🏗 프로젝트 아키텍처

이 프로젝트는 새로운 기능을 쉽게 추가하고 관리할 수 있도록 설계되었습니다.

```
src/
├── features/            # [핵심] 모든 기능 모듈이 위치하는 곳 (자동 등록됨)
│   ├── dummy-notice/    # 개별 기능 폴더 (예시)
│   │   └── index.ts     # 기능 정의 (Feature 인터페이스 구현)
│   └── registry.ts      # 기능 레지스트리 (import.meta.glob 사용)
├── content/             # Content Script 진입점 (URL 매칭 및 기능 실행 담당)
├── popup/               # 팝업 UI (기능 목록 및 설정 UI 자동 렌더링)
├── background/          # Background Service Worker
└── utils/               # 공용 유틸리티 (Storage, URL Matcher, Shadow DOM 등)
```

### 핵심 개념: Feature Registry 패턴
- 모든 기능은 `src/features/` 아래에 독립적인 모듈로 존재합니다.
- **자동 등록**: `src/features` 폴더에 `index.ts` 파일을 생성하면 자동으로 감지됩니다.
- `popup/App.tsx`는 등록된 기능을 읽어 설정 UI(On/Off 스위치, 옵션 입력 폼)를 자동으로 생성합니다.

## ✨ 새로운 기능 추가하기 (How to Contribute)

새로운 기능을 추가하려면 다음 단계를 따르세요.

### 1단계: 기능 모듈 생성
`src/features/` 아래에 새 폴더를 만들고 `index.ts`를 생성합니다.

### 2단계: 인터페이스 구현
`Feature<SettingsType>` 제네릭 인터페이스에 맞춰 기능을 정의하고, `createShadowWrapper`로 스타일을 격리합니다.

```typescript
import { Feature } from '../../types';
import { createShadowWrapper, removeShadowWrapper } from '../../utils/dom';

// 1. 설정 타입 정의 (Type-Safety)
interface MySettings {
  bgColor: string;
}

const myNewFeature: Feature<MySettings> = {
  id: 'my-feature-id',       // 고유 ID
  name: 'My New Feature',    // UI에 표시될 이름
  description: '이 기능은 이러이러한 동작을 합니다.',
  matches: ['example.com'],  // 실행될 URL 패턴 (문자열 또는 정규식)
  initialState: true,        // 기본 활성화 여부
  
  // (선택) 설정 스키마 정의 -> 팝업에 설정 UI 자동 생성됨
  settingsSchema: [
    {
      key: 'bgColor',
      type: 'color',
      label: '배경 색상',
      defaultValue: '#ffffff'
    }
  ],

  // 기능 실행 로직
  execute: (settings) => {
    // 자동완성 지원
    const color = settings?.bgColor || '#ffffff';
    
    // 2. 스타일 격리 (Shadow DOM 사용)
    const { container } = createShadowWrapper('my-feature-host');
    
    const element = document.createElement('div');
    element.style.backgroundColor = color;
    element.innerText = "Hello Isolated World!";
    
    container.appendChild(element);
  },

  // (중요) 기능 종료/정리 로직
  // 사용자가 기능을 끄거나 설정을 바꿨을 때 호출됩니다.
  cleanup: () => {
    // 3. Shadow DOM 제거 유틸리티 사용
    removeShadowWrapper('my-feature-host');
  }
};

// 4. default export 필수 (자동 등록을 위함)
export default myNewFeature;
```

### 3단계: 완료!
별도의 등록 절차 없이 저장하고 빌드(`pnpm build:dev`)하면 자동으로 적용됩니다!

## 🐞 디버깅 가이드

- **Content Script 디버깅**: 웹페이지에서 F12(개발자 도구)를 열고 Console 탭 확인. SourceMap이 적용되어 있어 TS 원본 파일에 중단점을 걸 수 있습니다.
- **Popup 디버깅**: 확장프로그램 아이콘 우클릭 -> "팝업 검사" 선택.
- **수정사항 미반영 시**: 
    1. `pnpm build:dev`가 성공적으로 끝났는지 확인.
    2. `chrome://extensions`에서 **새로고침 아이콘** 클릭.
    3. 테스트 중인 웹페이지 **새로고침**.
