/**
 * Typography Matcher — 메인 앱
 *
 * 기능:
 *   • 커스텀 폰트 피커 (폰트명 자체 폰트로 렌더, 카테고리별 그룹)
 *   • 제목/본문 각각 잠금 (🔓 → 🔒), 자동추천이 잠긴 슬롯 보존
 *   • 제목/본문 자간 슬라이더 분리
 *   • 자동 추천 / 잠금 제목 / 잠금 본문 — 3가지 추천 모드
 *   • 한/영 폰트 필터, 다크/라이트 토글
 *   • 폰트별 다운로드 링크 — @import URL 복사, TTF 파일 받기, Google Fonts 페이지 열기
 */
(function () {
  'use strict';

  const SAMPLES = {
    latin: {
      title: 'The quick brown fox',
      body:
        'Typography is the craft of endowing human language with a durable visual form. A good pairing makes the title sing and the body breathe — each doing its own job without fighting for attention.'
    },
    korean: {
      title: '좋은 타이포그래피',
      body:
        '타이포그래피는 인간의 언어에 지속 가능한 시각적 형태를 부여하는 기술이다. 좋은 글자 조합은 제목이 노래하게 하고 본문이 호흡하게 한다. 각자가 자신의 역할을 충실히 수행하되, 서로의 영역을 침범하지 않을 때 가장 아름답다.'
    }
  };

  const DEFAULTS = {
    all:    { title: 'Playfair Display', body: 'Source Sans 3' },
    korean: { title: 'Noto Serif KR',    body: 'Noto Sans KR' },
    latin:  { title: 'Playfair Display', body: 'Source Sans 3' }
  };

  const state = {
    titleFont: null,
    bodyFont: null,
    titleSize: 56,
    bodySize: 18,
    titleWeight: 700,
    bodyWeight: 400,
    titleLetterSpacing: 0,
    bodyLetterSpacing: 0,
    theme: 'light',
    script: 'all',
    customTitle: SAMPLES.latin.title,
    customBody: SAMPLES.latin.body,
    userEdited: { title: false, body: false },
    locked: { title: false, body: false }
  };

  // ── DOM refs ─────────────────────────────────────────
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  const pickers = {};

  // ── 초기화 ───────────────────────────────────────────
  function init() {
    const def = DEFAULTS.all;
    state.titleFont = findFont(def.title);
    state.bodyFont  = findFont(def.body);

    pickers.title = createFontPicker('title', name => {
      state.titleFont = findFont(name);
      applyFonts();
    });
    pickers.body = createFontPicker('body', name => {
      state.bodyFont = findFont(name);
      applyFonts();
    });
    pickers.title.updateButton();
    pickers.body.updateButton();

    applyFonts();
    bindEvents();
    runAuto();

    // 폰트 링크 팝오버 (제목/본문 각각)
    setupFontLinkButton('title');
    setupFontLinkButton('body');

    // 백그라운드로 모든 폰트 프리로드
    setTimeout(() => window.FontLoader.preload(window.FONT_LIBRARY), 1500);
  }

  // ── 커스텀 폰트 피커 ─────────────────────────────────
  function createFontPicker(target, onSelect) {
    const root    = document.querySelector(`.font-picker[data-target="${target}"]`);
    const btn     = root.querySelector('.font-picker__btn');
    const current = root.querySelector('.font-picker__current');
    const menu    = root.querySelector('.font-picker__menu');
    const list    = root.querySelector('.font-picker__list');

    function renderOptions() {
      const lib = filteredLibrary();
      list.innerHTML = '';
      const currentFont = target === 'title' ? state.titleFont : state.bodyFont;

      for (const cat of window.FONT_CATEGORIES) {
        const fonts = lib.filter(x => x.category === cat);
        if (fonts.length === 0) continue;
        const group = document.createElement('div');
        group.className = 'font-picker__group';
        const label = document.createElement('div');
        label.className = 'font-picker__group-label';
        label.textContent = window.CATEGORY_LABEL[cat];
        group.appendChild(label);
        for (const font of fonts) {
          const opt = document.createElement('button');
          opt.type = 'button';
          opt.className = 'font-picker__option';
          if (font.name === currentFont.name) opt.classList.add('font-picker__option--active');
          opt.dataset.value = font.name;
          opt.style.fontFamily = `"${font.name}", ${fallback(font.category)}`;
          opt.textContent = font.name;
          opt.addEventListener('click', () => {
            onSelect(font.name);
            close();
          });
          group.appendChild(opt);
        }
        list.appendChild(group);
      }
    }

    function open() {
      if (state.locked[target]) return;
      Object.entries(pickers).forEach(([k, p]) => {
        if (k !== target) p.close();
      });
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      renderOptions();
    }

    function close() {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }

    function updateButton() {
      const f = target === 'title' ? state.titleFont : state.bodyFont;
      current.style.fontFamily = `"${f.name}", ${fallback(f.category)}`;
      current.textContent = f.name;
      btn.disabled = state.locked[target];
      root.classList.toggle('font-picker--locked', state.locked[target]);
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (state.locked[target]) return;
      if (menu.hidden) open();
      else close();
    });
    list.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', e => {
      if (!root.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) close();
    });

    return { open, close, updateButton, renderOptions };
  }

  // ── 폰트 링크 버튼 ───────────────────────────────────
  /**
   * @param {String} target 'title' | 'body'
   *
   * 동작:
   *   🔗 버튼 클릭 → 작은 팝오버
   *     · @import URL (전체 선택, 복사 가능)
   *     · "URL 복사" 버튼
   *     · "TTF 받기" 버튼 — Google Fonts CSS를 fetch → woff/ttf URL 파싱 → 다운로드
   *     · "Google Fonts" 페이지 링크
   */
  function setupFontLinkButton(target) {
    const btn     = $(`#${target}Link`);
    const popover = $(`#${target}LinkPopover`);
    const urlEl   = $(`#${target}LinkURL`);
    const pageEl  = $(`#${target}LinkPage`);

    function refresh() {
      const font = target === 'title' ? state.titleFont : state.bodyFont;
      urlEl.textContent = fontImportURL(font);
      pageEl.href = googleFontsPageURL(font);
    }
    function open() {
      refresh();
      // 다른 링크 팝오버는 닫기
      ['title', 'body'].forEach(t => {
        if (t !== target) {
          const p = $(`#${t}LinkPopover`);
          if (p) p.hidden = true;
        }
      });
      popover.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      popover.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (popover.hidden) open();
      else close();
    });
    popover.addEventListener('click', e => e.stopPropagation());
    popover.addEventListener('click', e => {
      const action = e.target.closest('button')?.dataset.action;
      if (!action) return;
      const font = target === 'title' ? state.titleFont : state.bodyFont;
      if (action === 'copy') {
        copyToClipboard(fontImportURL(font), `📋 ${font.name} @import URL 복사됨`);
      } else if (action === 'download') {
        downloadFontFile(font);
      }
    });
    document.addEventListener('click', e => {
      if (!popover.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !popover.hidden) close();
    });
  }

  // ── 매뉴얼 모달 ─────────────────────────────────────
  /**
   * ❓ 버튼 → manual.html을 fetch해서 모달 안에 주입.
   * 한 번만 로드하고 캐시. 같은 도메인이므로 CORS 안전.
   */
  async function openManual() {
    const modal = $('#manualModal');
    if (!modal.dataset.loaded) {
      try {
        const res = await fetch('manual.html');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const toc = doc.querySelector('.toc');
        const content = doc.querySelector('.content');
        if (toc) $('#modalToc ul').innerHTML = toc.querySelector('ul').innerHTML;
        if (content) $('#modalContent').innerHTML = content.innerHTML;
        setupModalToc();
        modal.dataset.loaded = 'true';
      } catch (e) {
        console.error(e);
        $('#modalContent').innerHTML =
          '<div class="callout"><strong>⚠️ 매뉴얼을 불러올 수 없어요.</strong><br/>잠시 후 다시 시도해주세요.</div>';
      }
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // 헤더로 스크롤
    const content = $('#modalContent');
    if (content) content.scrollTop = 0;
  }

  function closeManual() {
    const modal = $('#manualModal');
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function setupModalToc() {
    const links = $$('#modalToc a');
    const content = $('#modalContent');
    if (!content) return;
    const sections = content.querySelectorAll('section[id]');

    // 부드러운 스크롤
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = content.querySelector(link.getAttribute('href'));
        if (target) {
          content.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
        }
      });
    });

    // 스크롤 스파이
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { root: content, rootMargin: '0px 0px -80% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }

  // ── 이벤트 바인딩 ────────────────────────────────────
  function bindEvents() {
    bindSlider('#titleSize',  v => { state.titleSize = v; },            v => v + 'px',         'titleSizeVal');
    bindSlider('#bodySize',   v => { state.bodySize = v; },             v => v + 'px',         'bodySizeVal');
    bindSlider('#titleWeight',v => { state.titleWeight = v; },          v => String(v),        'titleWeightVal');
    bindSlider('#bodyWeight', v => { state.bodyWeight = v; },           v => String(v),        'bodyWeightVal');
    bindSlider('#titleLetterSpacing', v => { state.titleLetterSpacing = v / 100; }, v => v.toFixed(2) + 'em', 'titleLetterSpacingVal');
    bindSlider('#bodyLetterSpacing',  v => { state.bodyLetterSpacing  = v / 100; }, v => v.toFixed(2) + 'em', 'bodyLetterSpacingVal');

    $('#customTitle').addEventListener('input', e => {
      state.userEdited.title = true;
      state.customTitle = e.target.value || ' ';
      $('#previewTitle').textContent = state.customTitle;
    });
    $('#customBody').addEventListener('input', e => {
      state.userEdited.body = true;
      state.customBody = e.target.value || ' ';
      $('#previewBody').textContent = state.customBody;
    });

    $('#themeToggle').addEventListener('click', toggleTheme);
    $('#autoBtn').addEventListener('click', runAuto);
    $('#swapBtn').addEventListener('click', swap);
    $('#randomBtn').addEventListener('click', randomPair);
    $('#helpBtn').addEventListener('click', openManual);

    // 매뉴얼 모달 — backdrop / X 버튼 / ESC
    $('#manualModal').addEventListener('click', e => {
      if (e.target.dataset.close !== undefined) closeManual();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#manualModal').hidden) closeManual();
    });

    $('#titleLock').addEventListener('click', () => toggleLock('title'));
    $('#bodyLock').addEventListener('click', () => toggleLock('body'));

    $$('.lang-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => setScript(btn.dataset.script));
    });
  }

  function bindSlider(id, onChange, format, valId) {
    const el = $(id);
    el.addEventListener('input', e => {
      const v = Number(e.target.value);
      onChange(v);
      $(`#${valId}`).textContent = format(v);
      applyStyles();
    });
  }

  // ── 잠금 ─────────────────────────────────────────────
  function toggleLock(target) {
    state.locked[target] = !state.locked[target];
    const btn = $(`#${target}Lock`);
    btn.setAttribute('aria-pressed', state.locked[target]);
    btn.textContent = state.locked[target] ? '🔒' : '🔓';
    btn.title = state.locked[target]
      ? `${target === 'title' ? '제목' : '본문'} 고정됨 — 클릭으로 해제`
      : `${target === 'title' ? '제목' : '본문'} 고정하기`;
    pickers[target].updateButton();
    runAuto();
  }

  // ── 언어 필터 ────────────────────────────────────────
  function setScript(script) {
    if (script === state.script) return;
    state.script = script;

    $$('.lang-toggle__btn').forEach(b => {
      const active = b.dataset.script === script;
      b.classList.toggle('lang-toggle__btn--active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const def = DEFAULTS[script];
    if (script !== 'all') {
      if (!state.titleFont.scripts.includes(script)) {
        state.titleFont = findFont(def.title);
      }
      if (!state.bodyFont.scripts.includes(script)) {
        state.bodyFont = findFont(def.body);
      }
    }

    if (!state.userEdited.title) {
      state.customTitle = SAMPLES[script].title;
      $('#customTitle').value = state.customTitle;
      $('#previewTitle').textContent = state.customTitle;
    }
    if (!state.userEdited.body) {
      state.customBody = SAMPLES[script].body;
      $('#customBody').value = state.customBody;
      $('#previewBody').textContent = state.customBody;
    }

    pickers.title.renderOptions();
    pickers.body.renderOptions();
    pickers.title.updateButton();
    pickers.body.updateButton();
    applyFonts();
    runAuto();
  }

  // ── 폰트/스타일 적용 ─────────────────────────────────
  function applyFonts() {
    if (!state.titleFont || !state.bodyFont) return;
    window.FontLoader.preload([state.titleFont, state.bodyFont]);
    window.FontLoader.whenReady([state.titleFont, state.bodyFont]).then(applyStyles);
    applyStyles();
    updateMeta();
  }

  function applyStyles() {
    if (!state.titleFont || !state.bodyFont) return;
    const t = $('#previewTitle');
    const b = $('#previewBody');

    t.style.fontFamily = `"${state.titleFont.name}", ${fallback(state.titleFont.category)}`;
    t.style.fontSize = state.titleSize + 'px';
    t.style.fontWeight = state.titleWeight;
    t.style.letterSpacing = state.titleLetterSpacing + 'em';

    b.style.fontFamily = `"${state.bodyFont.name}", ${fallback(state.bodyFont.category)}`;
    b.style.fontSize = state.bodySize + 'px';
    b.style.fontWeight = state.bodyWeight;
    b.style.letterSpacing = state.bodyLetterSpacing + 'em';
  }

  function fallback(category) {
    return {
      'serif':      'Georgia, "Times New Roman", "Noto Serif KR", serif',
      'sans-serif': '-apple-system, "Helvetica Neue", "Noto Sans KR", Arial, sans-serif',
      'display':    'Impact, "Black Han Sans", sans-serif',
      'handwriting':'"Comic Sans MS", "Nanum Pen Script", cursive',
      'monospace':  '"SF Mono", Menlo, "Nanum Gothic Coding", monospace'
    }[category] || 'sans-serif';
  }

  function updateMeta() {
    $('#metaTitle').textContent = state.titleFont.name;
    $('#metaBody').textContent  = state.bodyFont.name;
    $('#metaTitleCat').textContent = window.CATEGORY_LABEL[state.titleFont.category];
    $('#metaBodyCat').textContent  = window.CATEGORY_LABEL[state.bodyFont.category];
    $('#metaScore').textContent =
      window.PairingEngine.score(state.titleFont, state.bodyFont);
  }

  function filteredLibrary() {
    if (state.script === 'all') return window.FONT_LIBRARY;
    return window.FONT_LIBRARY.filter(f => (f.scripts || ['latin']).includes(state.script));
  }

  // ── 추천 ─────────────────────────────────────────────
  function runAuto() {
    const grid = $('#recGrid');
    grid.innerHTML = '';

    if (state.locked.title && state.locked.body) {
      grid.innerHTML = `<div class="rec-empty">🔒 제목과 본문 모두 고정됨<br/><span style="font-size:12px">둘 중 하나를 해제하면 추천이 보여요</span></div>`;
      $('#recTitle').textContent = '🔒 모두 고정됨';
      return;
    }

    if (state.locked.title) {
      showLockedTitleRecommendations();
      $('#recTitle').textContent = `🔒 "${state.titleFont.name}" 고정 — 어울리는 본문`;
      return;
    }

    if (state.locked.body) {
      showLockedBodyRecommendations();
      $('#recTitle').textContent = `🔒 "${state.bodyFont.name}" 고정 — 어울리는 제목`;
      return;
    }

    showAutoRecommendations();
    $('#recTitle').textContent =
      state.script === 'korean' ? '한글 추천 페어' :
      state.script === 'latin'  ? '영문 추천 페어' :
      '에디토리얼 추천';
  }

  function showAutoRecommendations() {
    const lib = filteredLibrary();
    const cards = [];
    const seen = new Set();
    const PE = window.PairingEngine;

    const presets = PE.autoPair(lib, 5, state.script);
    presets.forEach(p => {
      const t = findFont(p.title);
      const b = findFont(p.body);
      if (!t || !b) return;
      const key = `${t.name}→${b.name}`;
      if (seen.has(key)) return;
      seen.add(key);
      cards.push({ title: t, body: b, score: PE.score(t, b), reason: p.reason });
    });

    const fillers = [];
    for (const t of shuffle(lib)) {
      if (fillers.length >= 50) break;
      const b = pick(lib.filter(f => f.name !== t.name));
      const key = `${t.name}→${b.name}`;
      if (seen.has(key)) continue;
      const sc = PE.score(t, b);
      if (sc < 60) continue;
      seen.add(key);
      fillers.push({ title: t, body: b, score: sc, reason: PE.explain(t, b, sc) });
    }
    fillers.sort((a, b) => b.score - a.score);
    cards.push(...fillers.slice(0, 4));

    const final = shuffle(cards).slice(0, 9);
    final.forEach(c => renderRecCard(c.title, c.body, c.score, c.reason));
  }

  function showLockedTitleRecommendations() {
    const lib = filteredLibrary().filter(f => f.name !== state.titleFont.name);
    const PE = window.PairingEngine;
    const candidates = [];
    for (const b of shuffle(lib).slice(0, 60)) {
      const sc = PE.score(state.titleFont, b);
      if (sc < 30) continue;
      candidates.push({ title: state.titleFont, body: b, score: sc, reason: PE.explain(state.titleFont, b, sc) });
    }
    candidates.sort((a, b) => b.score - a.score);
    const top = shuffle(candidates.slice(0, 9));
    top.forEach(c => renderRecCard(c.title, c.body, c.score, c.reason));
  }

  function showLockedBodyRecommendations() {
    const lib = filteredLibrary().filter(f => f.name !== state.bodyFont.name);
    const PE = window.PairingEngine;
    const candidates = [];
    for (const t of shuffle(lib).slice(0, 60)) {
      const sc = PE.score(t, state.bodyFont);
      if (sc < 30) continue;
      candidates.push({ title: t, body: state.bodyFont, score: sc, reason: PE.explain(t, state.bodyFont, sc) });
    }
    candidates.sort((a, b) => b.score - a.score);
    const top = shuffle(candidates.slice(0, 9));
    top.forEach(c => renderRecCard(c.title, c.body, c.score, c.reason));
  }

  function renderRecCard(title, body, score, reason) {
    window.FontLoader.preload([title, body]);
    const grid = $('#recGrid');

    const isTitleLocked = state.locked.title;
    const isBodyLocked = state.locked.body;

    const card = document.createElement('button');
    card.className = 'rec-card';
    card.type = 'button';
    card.innerHTML = `
      <div class="rec-card__head">
        <span class="rec-card__reason">${escape(reason)}</span>
        <span class="rec-card__score">${score}</span>
      </div>
      <div class="rec-card__title" style="font-family: '${title.name}', ${fallback(title.category)}; font-weight: 700; ${isTitleLocked ? 'opacity:0.45;' : ''}">
        ${escape(title.name)}${isTitleLocked ? ' 🔒' : ''}
      </div>
      <div class="rec-card__body" style="font-family: '${body.name}', ${fallback(body.category)}; ${isBodyLocked ? 'opacity:0.45;' : ''}">
        ${escape(body.name)}${isBodyLocked ? ' 🔒' : ''}
      </div>
      <div class="rec-card__cats">
        <span>${window.CATEGORY_LABEL[title.category]}</span>
        <span class="rec-card__arrow">→</span>
        <span>${window.CATEGORY_LABEL[body.category]}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      if (!state.locked.title) state.titleFont = title;
      if (!state.locked.body) state.bodyFont = body;
      pickers.title.updateButton();
      pickers.body.updateButton();
      applyFonts();
    });
    grid.appendChild(card);
  }

  // ── 도구 ─────────────────────────────────────────────
  function swap() {
    if (state.locked.title || state.locked.body) {
      flashMessage('🔒 잠긴 폰트가 있어서 스왑할 수 없어요');
      return;
    }
    const tmp = state.titleFont;
    state.titleFont = state.bodyFont;
    state.bodyFont = tmp;
    pickers.title.updateButton();
    pickers.body.updateButton();
    applyFonts();
  }

  function randomPair() {
    if (state.locked.title && state.locked.body) {
      flashMessage('🔒 둘 다 고정됨');
      return;
    }
    const lib = filteredLibrary();
    if (state.locked.title) {
      const b = pick(lib.filter(f => f.name !== state.titleFont.name && f.category !== 'handwriting'));
      state.bodyFont = b;
    } else if (state.locked.body) {
      const t = pick(lib.filter(f => f.name !== state.bodyFont.name && f.category !== 'handwriting'));
      state.titleFont = t;
    } else {
      const t = pick(lib.filter(f => f.category !== 'handwriting'));
      const b = pick(lib.filter(f => f.name !== t.name));
      state.titleFont = t;
      state.bodyFont = b;
    }
    pickers.title.updateButton();
    pickers.body.updateButton();
    applyFonts();
  }

  function flashMessage(text) {
    const existing = document.querySelector('.flash');
    if (existing) existing.remove();
    const flash = document.createElement('div');
    flash.className = 'flash';
    flash.textContent = text;
    document.body.appendChild(flash);
    requestAnimationFrame(() => flash.classList.add('flash--show'));
    setTimeout(() => {
      flash.classList.remove('flash--show');
      setTimeout(() => flash.remove(), 250);
    }, 1800);
  }

  // ── 폰트 링크 / 다운로드 ────────────────────────────
  function fontImportURL(font) {
    const family = encodeURIComponent(font.name).replace(/%20/g, '+');
    const weights = font.weights.join(';');
    return `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
  }

  function googleFontsPageURL(font) {
    return `https://fonts.google.com/specimen/${encodeURIComponent(font.name).replace(/%20/g, '+')}`;
  }

  // Google Fonts CSS의 format() 토큰 → 파일 확장자
  const FORMAT_TO_EXT = {
    'woff2':             'woff2',
    'woff':              'woff',
    'truetype':          'ttf',
    'opentype':          'otf',
    'embedded-opentype': 'eot',
    'svg':               'svg'
  };

  /**
   * Google Fonts CSS를 fetch → 첫 번째 @font-face의 src url + format() 추출 → fetch → 다운로드.
   *
   * Google Fonts API는 User-Agent 기준으로 포맷을 결정:
   *   - 모던 브라우저 (Chrome/Firefox/Safari/Edge) → woff2
   *   - IE 11 등 옛날 브라우저                      → ttf
   *   - 일부 모바일                                  → ttf
   *
   * 브라우저의 fetch()는 User-Agent 헤더를 설정할 수 없어서 (forbidden header)
   * TTF를 강제로 받을 방법은 없음. 그래서 받은 그대로 저장.
   * WOFF2가 사실 더 작고 효율적이라 웹용으로는 더 권장됨.
   * TTF가 꼭 필요하면 Google Fonts 페이지에서 직접 받으면 됨.
   */
  async function downloadFontFile(font) {
    try {
      flashMessage(`⬇ ${font.name} 다운로드 중…`);
      const cssRes = await fetch(fontImportURL(font));
      if (!cssRes.ok) throw new Error('CSS 요청 실패 (' + cssRes.status + ')');
      const css = await cssRes.text();

      // 첫 번째 @font-face의 src url() 추출
      const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
      if (!urlMatch) throw new Error('폰트 파일 URL을 찾을 수 없음');
      const fileURL = urlMatch[1];

      // format() 토큰으로 실제 포맷 확인 (url 확장자보다 신뢰성 높음)
      const formatMatch = css.match(/url\([^)]+\)\s+format\(['"]?([\w-]+)['"]?\)/);
      const format = formatMatch ? formatMatch[1] : 'truetype';
      const ext = FORMAT_TO_EXT[format] || (fileURL.match(/\.(\w+)$/) || [, 'ttf'])[1];

      const fileRes = await fetch(fileURL);
      if (!fileRes.ok) throw new Error('파일 요청 실패 (' + fileRes.status + ')');
      const blob = await fileRes.blob();

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${font.name.replace(/\s+/g, '-')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 100);

      // TTF 외 포맷이면 TTF 받는 법 안내
      const hint = format === 'truetype' ? '' : ' · TTF가 필요하면 Google Fonts 페이지에서 받으세요';
      flashMessage(`✅ ${font.name}.${ext} (${format})${hint}`);
    } catch (e) {
      console.error(e);
      flashMessage('❌ 다운로드 실패 — CORS 또는 네트워크 문제');
    }
  }

  // ── 클립보드 ─────────────────────────────────────────
  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => flashMessage(successMsg))
        .catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      flashMessage(successMsg);
    } catch {
      flashMessage('❌ 복사 실패 — 직접 선택해서 복사해주세요');
    }
    ta.remove();
  }

  // ── 유틸 ─────────────────────────────────────────────
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function findFont(name) {
    return window.FONT_LIBRARY.find(f => f.name === name);
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    $('#themeToggle').textContent = state.theme === 'light' ? '🌙' : '☀️';
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ── 부트 ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();
