# Chrome Extension Project

이 프로젝트는 **React**, **TypeScript**, **Vite**를 기반으로 한 Chrome 확장프로그램 스캐폴딩입니다.

## 시작하기

### 필수 요구사항
- Node.js
- pnpm

### 설치

의존성을 설치합니다:

```bash
pnpm install
```

### 개발 및 빌드

개발 서버 실행 (HMR):
```bash
pnpm dev
```

프로덕션 빌드:
```bash
pnpm build
```

빌드가 완료되면 `dist` 폴더가 생성됩니다.

### Chrome에 로드하기

1. Chrome 브라우저 주소창에 `chrome://extensions` 입력.
2. 우측 상단 **개발자 모드** 활성화.
3. **압축해제된 확장 프로그램을 로드합니다** 클릭.
4. 프로젝트의 `dist` 폴더 선택.

## 프로젝트 구조

- `public/manifest.json`: 확장프로그램 설정 파일 (Manifest V3)
- `src/popup`: 팝업 UI (React)
- `src/background`: 백그라운드 스크립트
- `src/content`: 콘텐츠 스크립트
