# Bisue Utils Extension

**Bisue Utils Extension**은 다양한 웹사이트 유틸리티 기능을 하나의 확장프로그램으로 통합 관리하기 위한 프로젝트입니다.
React, TypeScript, Vite를 기반으로 하며, 높은 유지보수성과 확장성을 위해 **모듈형 아키텍처(Feature-based Architecture)**를 채택했습니다.

## 🛠 기술 스택

- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build**: [Vite](https://vitejs.dev/) (Multi-page & Content Script Bundling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Architecture**: Declarative UI Injection (Shadow DOM + React)

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
   ```bash
   pnpm build:dev
   ```

3. **Chrome에 로드**
   - `chrome://extensions` 접속 -> 개발자 모드 ON -> 압축해제된 확장 프로그램 로드 -> `dist/` 폴더 선택

## ✨ 새로운 기능 추가하기 (How to Contribute)

### 1. 기능 모듈 생성
`src/features/` 아래에 새 폴더를 만들고 `index.tsx`를 생성합니다. (UI가 있다면 `.tsx`, 로직만 있다면 `.ts`)

### 2. 기능 정의 (`Feature<T>`)
React 컴포넌트를 사용해 UI를 정의하세요. **Shadow DOM과 스타일 격리는 자동으로 처리됩니다.**

```tsx
import { Feature } from '../../types';

interface MySettings {
  visible: boolean;
}

const myNewFeature: Feature<MySettings> = {
  id: 'hello-world',
  name: 'Hello World',
  description: '화면에 인사를 표시합니다.',
  matches: ['example.com'], // 모든 사이트는 []
  initialState: true,
  
  settingsSchema: [
    { key: 'visible', type: 'boolean', label: '보이기', defaultValue: true }
  ],

  // React 컴포넌트로 UI 정의 (props로 settings 전달됨)
  component: ({ settings }) => {
    if (!settings.visible) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-[99999]">
        Hello, Extension!
      </div>
    );
  }
};

export default myNewFeature;
```

### 3. 완료!
저장하면 자동으로 등록됩니다. `pnpm build:dev` 후 웹페이지를 새로고침해서 확인하세요.

## 🏗 프로젝트 구조

```
src/
├── features/            # 기능 모듈 (자동 등록)
├── content/             # React UI 주입기 (Shadow DOM + Style Injection)
├── popup/               # 설정 팝업
└── index.css            # Tailwind Global Styles
```
