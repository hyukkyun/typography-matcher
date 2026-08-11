# Typography Matcher

Google Fonts API 기반 **제목-본문 폰트 페어링 추천 도구**.
카테고리(Serif / Sans-serif / Display / Handwriting / Monospace) 대비와 무드 매칭으로 어울리는 조합을 추천합니다.
**한글/영문 폰트 필터**, **한국어 샘플 텍스트 자동 전환** 지원.

## 실행

브라우저에서 `index.html` 열면 끝. 별도 빌드/서버 필요 없음.

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
├── styles.css          # 스타일 (라이트/다크)
├── data/
│   └── fonts.js        # 큐레이션된 Google Fonts 데이터
└── js/
    ├── pairing.js      # 페어링 점수 엔진
    ├── loader.js       # Google Fonts CSS API 동적 로더
    └── app.js          # UI 와이어링
```

## 동작 원리

1. **`data/fonts.js`** — 약 80개 인기 Google Fonts를 5개 카테고리 + 무드 태그로 큐레이션.
2. **`js/loader.js`** — Google Fonts CSS API (`fonts.googleapis.com/css2?...`) 로 필요한 폰트만 동적 로드.
3. **`js/pairing.js`** — 카테고리 페어 점수표(`PAIR_SCORE`) + 무드 교집합 보너스로 0~100점 환산.
4. **`js/app.js`** — UI 이벤트, 라이브 미리보기, 추천 카드 렌더링.

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

## 확장 아이디어

- `familyBase` 자동 감지 → 동일 패밀리 자동 그룹화
- Google Fonts Developer API 키 연동 (전체 카탈로그 1500+ 폰트)
- 페어 저장/공유 (URL 인코딩)
- 실제 웹페이지 스크린샷 미리보기
- 한국어/일본어/중국어 폰트 카테고리 추가
