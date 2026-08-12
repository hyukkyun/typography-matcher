# Typography Matcher

Google Fonts API 기반 **제목-본문 폰트 페어링 추천 도구**.
카테고리(Serif / Sans-serif / Display / Handwriting / Monospace) 대비와 무드 매칭으로 어울리는 조합을 추천합니다.
**한글/영문 폰트 필터**, **한국어 샘플 텍스트 자동 전환** 지원.

## 실행

### 개발 모드 (권장)

Vite 개발 서버를 사용하면 Vercel Web Analytics와 함께 실행할 수 있습니다:

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

### 간단히 (빌드 없이)

브라우저에서 `index.html` 열면 동작합니다 (Vercel Analytics 제외).

```bash
open index.html
# 또는 로컬 서버
python3 -m http.server 8000
# → http://localhost:8000
```

## 파일 구조

```
TypographyMatcher/
├── index.html          # 메인 UI
├── manual.html         # 사용법 매뉴얼
├── styles.css          # 스타일 (라이트/다크)
├── data/
│   ├── fonts.js        # 큐레이션된 Google Fonts 데이터
│   └── noonnuFonts.js  # Noonnu 한글 폰트 데이터
├── js/
│   ├── pairing.js      # 페어링 점수 엔진
│   ├── loader.js       # Google Fonts CSS API 동적 로더
│   ├── app.js          # UI 와이어링
│   └── analytics.js    # Vercel Web Analytics 초기화
├── public/             # Vite 빌드 시 dist/로 복사되는 정적 파일
├── package.json        # npm 의존성
└── vite.config.mjs     # Vite 설정
```

## 동작 원리

1. **`data/fonts.js`** — 약 98개 인기 Google Fonts를 5개 카테고리 + 무드 태그로 큐레이션.
2. **`data/noonnuFonts.js`** — Noonnu 인기 한글 폰트 100선.
3. **`js/loader.js`** — Google Fonts CSS API (`fonts.googleapis.com/css2?...`) 로 필요한 폰트만 동적 로드.
4. **`js/pairing.js`** — 카테고리 페어 점수표(`PAIR_SCORE`) + 무드 교집합 보너스로 0~100점 환산.
5. **`js/app.js`** — UI 이벤트, 라이브 미리보기, 추천 카드 렌더링.
6. **`js/analytics.js`** — Vercel Web Analytics 자동 추적 (Vercel 배포 시).

## 페어링 규칙 (PAIR_SCORE)

| 제목 → 본문 | 점수 | 의미 |
|---|---|---|
| serif → sans-serif | 92 | 에디토리얼 클래식 |
| sans-serif → serif | 90 | 모던 에디토리얼 |
| display → sans-serif | 88 | 임팩트 + 가독성 |
| display → serif | 82 | 패션 에디토리얼 |
| monospace → sans-serif | 80 | 테크 에디토리얼 |
| handwriting → sans-serif | 78 | 따뜻함 + 가독 |
| serif → serif | 68 | 톤 통일 (주의) |
| sans-serif → sans-serif | 64 | 톤 통일 (주의) |
| display ↔ display | 20 | 권장 안함 |
| handwriting ↔ * | 10-30 | 권장 안함 (clash) |

## Vercel Web Analytics

이 프로젝트는 Vercel Web Analytics가 설정되어 있습니다. Vercel에 배포하면:

1. Vercel 대시보드에서 프로젝트의 Analytics 섹션으로 이동
2. "Enable Web Analytics" 버튼 클릭
3. 배포 후 자동으로 페이지 뷰, 사용자 통계 수집 시작

Analytics는 개발 모드(`npm run dev`)에서도 디버그 모드로 동작하며, 프로덕션 배포 시 자동으로 활성화됩니다.

자세한 내용: [Vercel Analytics Quickstart](https://vercel.com/docs/analytics/quickstart)

## 확장 아이디어

- `familyBase` 자동 감지 → 동일 패밀리 자동 그룹화
- Google Fonts Developer API 키 연동 (전체 카탈로그 1500+ 폰트)
- 페어 저장/공유 (URL 인코딩)
- 실제 웹페이지 스크린샷 미리보기
- 한국어/일본어/중국어 폰트 카테고리 추가
