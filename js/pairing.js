/**
 * 타이포그래피 페어링 추천 엔진
 *
 * 점수 모델 (0 ~ 100):
 *   1) 카테고리 페어 점수     — 분류 대비 규칙 기반 (가장 큰 비중)
 *   2) 무드 일치 보너스        — mood 태그 교집합 수
 *   3) 동일 폰트 패널티        — 같은 폰트 두 번 추천 X (페이지 용도 분리)
 *   4) 동일 패밀리 보너스      — 같은 이름이면 일관성 +5
 *
 * 30점 이상이면 추천 풀에 들어옴. 점수 내림차순 정렬.
 */
window.PairingEngine = (function () {

  // (titleCategory → bodyCategory) → 기본 점수
  // 타이포그래피 베스트 프랙티스에서 검증된 조합.
  const PAIR_SCORE = {
    // 고전 대비 — 가장 안정적
    'serif|sans-serif':       92,
    'sans-serif|serif':       90,
    // 동일 카테고리 — 신중히
    'serif|serif':            68,
    'sans-serif|sans-serif':  64,
    'monospace|monospace':    30,
    // 디스플레이
    'display|sans-serif':     88,
    'display|serif':          82,
    'display|monospace':      62,
    'display|display':        20,
    'display|handwriting':    18,
    // 필기체
    'handwriting|sans-serif': 78,
    'handwriting|serif':      68,
    'handwriting|monospace':  35,
    'handwriting|display':    22,
    'handwriting|handwriting':10,
    // 모노스페이스
    'monospace|sans-serif':   80,
    'monospace|serif':        66,
    'monospace|display':      60,
    'monospace|handwriting':  24
  };

  function pairKey(titleCat, bodyCat) {
    return `${titleCat}|${bodyCat}`;
  }

  function score(title, body) {
    if (title.name === body.name) return 0;

    let base = PAIR_SCORE[pairKey(title.category, body.category)] ?? 40;

    // 무드 일치 보너스: 교집합 1개당 +3 (최대 +9)
    const overlap = (title.mood || []).filter(m => (body.mood || []).includes(m));
    base += Math.min(overlap.length, 3) * 3;

    // 동일 카테고리 내 무드 일치시 보너스 (테마 일관성)
    if (title.category === body.category && overlap.length >= 1) {
      base += 4;
    }

    // 동일 패밀리 (예: Inter Light + Inter Bold) — 같은 이름은 아니지만 모듈화 가능
    if (title.familyBase && body.familyBase && title.familyBase === body.familyBase) {
      base += 5;
    }

    // 너무 큰 임팩트 + 너무 작은 가독성 = 권장하지 않음
    if (title.category === 'display' && body.category === 'handwriting') {
      base -= 5;
    }

    return Math.max(0, Math.min(100, Math.round(base)));
  }

  /**
   * 제목 폰트가 주어지면 본문 후보 상위 N개 추천.
   * @param {Object} titleFont - { name, category, ... }
   * @param {Array}  library   - 전체 폰트 목록
   * @param {Number} n         - 반환 개수
   * @param {String} script    - 'all' | 'korean' | 'latin' — 현재 언어 필터
   */
  function recommendBodies(titleFont, library, n = 6, script = 'all') {
    const filtered = library.filter(f => {
      if (f.name === titleFont.name) return false;
      if (script === 'all') return true;
      return (f.scripts || ['latin']).includes(script);
    });
    const scored = filtered
      .map(body => ({
        body,
        score: score(titleFont, body),
        reason: explain(titleFont, body, score(titleFont, body))
      }))
      .filter(x => x.score >= 30)
      .sort((a, b) => b.score - a.score);

    // 다양성 보장: 상위 카테고리가 몰리지 않도록 카테고리별로 분산
    const picked = [];
    const seen = new Set();
    const buckets = ['sans-serif', 'serif', 'monospace', 'display', 'handwriting'];

    for (const cat of buckets) {
      const sameCat = scored.filter(s => s.body.category === cat);
      const need = cat === titleFont.category ? 0 : Math.ceil(n / 4);
      for (const s of sameCat) {
        if (picked.length >= n) break;
        if (seen.has(s.body.name)) continue;
        if (picked.filter(p => p.body.category === cat).length >= need + 1) break;
        picked.push(s);
        seen.add(s.body.name);
      }
    }

    // 남은 슬롯은 점수순으로 채움
    for (const s of scored) {
      if (picked.length >= n) break;
      if (seen.has(s.body.name)) continue;
      picked.push(s);
      seen.add(s.body.name);
    }

    return picked.slice(0, n);
  }

  /**
   * 점수와 카테고리 조합에 대한 짧은 추천 사유.
   */
  function explain(title, body, score) {
    if (title.category === body.category) {
      return `같은 ${window.CATEGORY_LABEL[title.category]} — 톤 통일`;
    }
    const t = window.CATEGORY_LABEL[title.category];
    const b = window.CATEGORY_LABEL[body.category];
    if (title.category === 'serif' && body.category === 'sans-serif') {
      return '에디토리얼 클래식 — 제목에 격식, 본문에 가독성';
    }
    if (title.category === 'sans-serif' && body.category === 'serif') {
      return '모던 에디토리얼 — 차분한 제목, 따뜻한 본문';
    }
    if (title.category === 'display' && body.category === 'sans-serif') {
      return '임팩트 + 가독성 — 강한 제목, 깔끔한 본문';
    }
    if (title.category === 'display' && body.category === 'serif') {
      return '패션 에디토리얼 — 강한 인상의 제목 + 우아한 본문';
    }
    if (title.category === 'handwriting' && body.category === 'sans-serif') {
      return '따뜻함 + 가독성 — 사람미 + 깔끔한 본문';
    }
    if (title.category === 'monospace' && body.category === 'sans-serif') {
      return '테크 에디토리얼 — 코드 느낌 제목 + 가독 본문';
    }
    if (title.category === 'monospace' && body.category === 'serif') {
      return '에디토리얼 대비 — 타입라이터 제목 + 클래식 본문';
    }
    return `${t} 제목 + ${b} 본문`;
  }

  /**
   * 본문 폰트가 주어지면 제목 후보 추천 (대칭 API).
   */
  function recommendTitles(bodyFont, library, n = 6, script = 'all') {
    return recommendBodies(bodyFont, library, n, script).map(x => ({
      title: x.body,
      body: bodyFont,
      score: x.score,
      reason: x.reason
    }));
  }

  /**
   * "Auto" 추천 — 카테고리만 고르면 그 안에서 잘 어울리는 페어 생성.
   * @param {Array}  library  - 전체 폰트
   * @param {Number} n        - 반환 개수
   * @param {String} script   - 'all' | 'korean' | 'latin' — 현재 언어 필터
   */
  function autoPair(library, n = 6, script = 'all') {
    const latinPresets = [
      { title: 'Playfair Display',  body: 'Source Sans 3',     reason: '에디토리얼 클래식' },
      { title: 'Montserrat',        body: 'Merriweather',      reason: '모던 에디토리얼' },
      { title: 'Abril Fatface',     body: 'Lato',              reason: '임팩트 + 가독성' },
      { title: 'Bebas Neue',        body: 'Source Sans 3',     reason: '포스터 / 헤드라인' },
      { title: 'Inter',             body: 'Inter',             reason: '단일 패밀리 — 깔끔' },
      { title: 'Caveat',            body: 'Open Sans',         reason: '캐주얼 + 가독' },
      { title: 'Space Mono',        body: 'Inter',             reason: '테크 에디토리얼' },
      { title: 'Cormorant Garamond',body: 'Karla',             reason: '우아 + 친근' },
      { title: 'Oswald',            body: 'Lora',              reason: '헤드라인 + 따뜻함' },
      { title: 'JetBrains Mono',    body: 'IBM Plex Sans',     reason: '개발자 에디토리얼' }
    ];

    // 한국어 추천 페어 — 명조+고딕 대비를 기본으로, 캐주얼+임팩트 보조
    const koreanPresets = [
      { title: 'Noto Serif KR',     body: 'Noto Sans KR',      reason: '명조 + 고딕 클래식' },
      { title: 'Nanum Myeongjo',    body: 'Nanum Gothic',      reason: '전통 명조 + 깔끔 고딕' },
      { title: 'Noto Sans KR',      body: 'Noto Serif KR',     reason: '모던 고딕 + 따뜻 명조' },
      { title: 'Black Han Sans',    body: 'Nanum Gothic',      reason: '임팩트 헤드라인 + 가독' },
      { title: 'Song Myung',        body: 'Nanum Square',      reason: '격식 있는 제목 + 모던 본문' },
      { title: 'Do Hyeon',          body: 'Noto Sans KR',      reason: '캐주얼 헤드라인 + 깔끔' },
      { title: 'IBM Plex Sans KR',  body: 'IBM Plex Serif KR', reason: '테크 에디토리얼' },
      { title: 'Nanum Square',      body: 'Nanum Myeongjo',    reason: '모던 고딕 + 전통 명조' },
      { title: 'Jua',               body: 'Nanum Gothic',      reason: '친근한 둥근 고딕' },
      { title: 'Nanum Gothic Coding', body: 'Nanum Gothic',     reason: '코드 + 본문 — 개발자' }
    ];

    if (script === 'korean') return koreanPresets.slice(0, n);
    if (script === 'latin')  return latinPresets.slice(0, n);
    // all: 섞어서
    return koreanPresets.slice(0, Math.ceil(n / 2))
      .concat(latinPresets.slice(0, Math.floor(n / 2)))
      .slice(0, n);
  }

  return { score, recommendBodies, recommendTitles, autoPair, explain };
})();
