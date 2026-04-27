# LocalAI Studio - 사용자 클라이언트

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node 버전](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![React 버전](https://img.shields.io/badge/react-18.2-blue.svg)](package.json)

---

## 🌐 언어 전환

| 언어 | 링크 |
|------|------|
| 🇨🇳 简体中文 | [简体中文](README_zh.md) |
| 🇺🇸 English | [English](README_en.md) |
| 🇯🇵 日本語 | [日本語](README_ja.md) |
| 🇰🇷 한국어 | [이 문서](README_ko.md) |

---

## 📖 프로젝트 소개

**LocalAI Studio - 사용자 클라이언트**는 AI 기반 콘텐츠 제작을 위한 최신 웹 애플리케이션입니다. 사용자는 텍스트 프롬프트에서 이미지와 비디오를 생성할 수 있습니다. Vite + React + TypeScript로 구축되어 직관적인 창작 워크플로우 인터페이스를 제공합니다.

### 주요 기능

- 🎨 **AI 이미지 생성** - 다양한 AI 모델을 사용하여 텍스트 프롬프트에서 이미지 생성
- 🎬 **AI 비디오 생성** - 사용자 정의 가능한 매개변수로 비디오 생성
- 📁 **작품 관리** - 모든 창작물 정리 및 관리
- 📚 **자료실** - 창작 에셋 저장 및 관리
- 💎 **포인트 시스템** - 크레딧 기반 사용량 추적
- 🔐 **보안 인증** - Canvas 검증이 포함된 RSA-OAEP 암호화 로그인

### 기술 스택

| 카테고리 | 기술 |
|----------|------|
| 프레임워크 | React 18.2 + TypeScript 5.5 |
| 빌드 도구 | Vite 5.0 |
| 라우팅 | React Router DOM 6.14 |
| UI 라이브러리 | Ant Design 5.10 |
| 상태 관리 | Zustand 4.4 |
| HTTP 클라이언트 | Axios 1.15 |
| 스타일링 | Tailwind CSS 3.4 |
| 암호화 | node-forge (RSA-OAEP) |

---

## 🚀 빠른 시작

### 전제 조건

- Node.js >= 18.0.0
- pnpm (권장) 또는 npm

### 설치

```bash
# 리포지토리 클론
git clone https://github.com/php-chen/LocalAI-Studio-User-Client.git
cd LocalAI-Studio-User-Client

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

### 프로덕션 빌드

```bash
pnpm build
pnpm preview
```

---

## 📁 프로젝트 구조

```
src/
├── api/                    # API 클라이언트 및 정의
│   ├── index.ts           # Axios 인스턴스, 인터셉터, 인증 API
│   └── openapi.json       # 백엔드 API 문서
├── components/            # 재사용 가능한 UI 컴포넌트
│   ├── CanvasVerify.tsx   # Canvas 슬라이더 캡차
│   ├── Header.tsx         # 네비게이션 헤더
│   ├── Footer.tsx         # 페이지 푸터
│   ├── WorksManagement.tsx # 작품 관리 카드
│   ├── MaterialLibrary.tsx # 자료실 카드
│   ├── ProgressBoard.tsx   # 진행 상황 대시보드
│   └── StyleRecommendation.tsx # 스타일 추천
├── layouts/
│   └── MainLayout.tsx     # 메인 레이아웃 래퍼
├── pages/                 # 페이지 컴포넌트
│   ├── Home.tsx          # 홈 페이지
│   ├── ImageLab.tsx       # AI 이미지 생성 실험실
│   ├── VideoEngine.tsx    # AI 비디오 생성 엔진
│   ├── Works.tsx          # 작품 관리 센터
│   ├── Materials.tsx      # 자료실
│   ├── Login.tsx         # 로그인 페이지
│   ├── Register.tsx       # 등록 페이지
│   ├── Agreement.tsx      # 서비스 약관
│   └── Privacy.tsx       # 개인정보 처리방침
├── routes/
│   └── index.tsx         # 라우터 구성
├── store/
│   ├── authStore.ts      # 인증 상태
│   └── verifyStore.ts    # 캡차 잠금 로직
└── utils/
    └── passwordEncryptor.ts # RSA-OAEP 비밀번호 암호화
```

---

## 🔌 API 문서

백엔드 API 문서는 [openapi.json](src/api/openapi.json)에서 확인할 수 있습니다. 주요 API 엔드포인트:

### 인증
- `POST /api/auth/login` - 사용자 로그인
- `POST /api/auth/logout` - 사용자 로그아웃
- `POST /api/auth/refresh` - 액세스 토큰 갱신

### 작품
- `POST /api/work/create` - 새 작품 생성
- `POST /api/work/list` - 작품 목록 조회
- `POST /api/work/detail` - 작품 상세 조회

### AI 모델
- `POST /api/ai-model/list` - 사용 가능한 AI 모델 목록 조회

### 포인트
- `POST /api/point/balance` - 사용자 포인트 잔액 조회

---

## 🔒 보안 기능

1. **입력 검증** - SQL 인젝션 탐지 및 HTML 이스케이프
2. **비밀번호 암호화** - SHA-256을 사용한 RSA-OAEP
3. **Canvas 캡차** - 순차 클릭 검증
4. **로그인 잠금** - 비정상적 행위 감지 시 계정 일시 잠금
5. **토큰 갱신** - 401 응답 시 자동으로 액세스 토큰 갱신

---

## 🤝 기여

기여를 환영합니다! Pull Request를 제출해 주세요.

1. 리포지토리 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 열기

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 공개되어 있습니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👨‍💻 작성자

**php-chen** - [GitHub](https://github.com/php-chen)

---

<p align="center">
  <strong>⭐ 이 프로젝트가 도움이 되셨다면 star를 눌러주세요!</strong>
</p>
