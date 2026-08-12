/**
 * 폰트 로더 — Google Fonts + Noonnu 두 소스 지원.
 *
 *  - Google Fonts: CSS API를 통해 한 번에 묶어서 로드
 *      https://fonts.googleapis.com/css2?family=Font+Name:wght@400;700&display=swap
 *
 *  - Noonnu: 각 폰트별로 <style>@font-face</style> 인젝션
 *      src는 jsdelivr CDN (https://cdn.jsdelivr.net/gh/projectnoonnu/...)
 *
 * 이미 로드된 폰트는 재요청하지 않고, 새 폰트는 <link>/<style> 태그로 주입.
 * 로딩 완료 시 콜백을 호출해서 미리보기 폰트를 즉시 swap.
 */
window.FontLoader = (function () {
  const loadedGoogle = new Set();
  const loadedNoonnu = new Set();

  // ── Google Fonts ────────────────────────────────────
  function googleFontParam(font) {
    const family = font.name.replace(/ /g, '+');
    if (!font.weights || font.weights.length === 0) {
      return family;
    }
    return `${family}:wght@${font.weights.join(';')}`;
  }
  function googleUrlFor(fonts) {
    const params = fonts.map(googleFontParam).join('&family=');
    return `https://fonts.googleapis.com/css2?family=${params}&display=swap`;
  }
  function preloadGoogle(fonts) {
    if (!fonts || fonts.length === 0) return;
    const needed = fonts.filter(f => !loadedGoogle.has(f.name));
    if (needed.length === 0) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = googleUrlFor(needed);
    link.setAttribute('data-fonts', needed.map(f => f.name).join('|'));
    document.head.appendChild(link);
    needed.forEach(f => loadedGoogle.add(f.name));
  }

  // ── Noonnu (@font-face 인젝션) ──────────────────────
  function formatFor(url) {
    if (/\.woff2(\?|$)/i.test(url)) return 'woff2';
    if (/\.woff(\?|$)/i.test(url))  return 'woff';
    if (/\.otf(\?|$)/i.test(url))   return 'opentype';
    if (/\.ttf(\?|$)/i.test(url))   return 'truetype';
    return 'woff2';
  }
  function noonnuStyleEl(name, src) {
    const el = document.createElement('style');
    el.setAttribute('data-font', name);
    el.textContent =
      "@font-face {\n" +
      `  font-family: '${name}';\n` +
      `  src: url('${src}') format('${formatFor(src)}');\n` +
      `  font-display: swap;\n` +
      "}\n";
    return el;
  }
  function preloadNoonnu(fonts) {
    if (!fonts || fonts.length === 0) return;
    fonts.forEach(f => {
      if (loadedNoonnu.has(f.name)) return;
      if (!f.src) return; // src 없으면 skip
      document.head.appendChild(noonnuStyleEl(f.name, f.src));
      loadedNoonnu.add(f.name);
    });
  }

  // ── 통합 ────────────────────────────────────────────
  function preload(fonts) {
    if (!fonts || fonts.length === 0) return;
    const google = fonts.filter(f => f.source === 'noonnu' ? false : true);
    const noonnu = fonts.filter(f => f.source === 'noonnu');
    if (google.length) preloadGoogle(google);
    if (noonnu.length) preloadNoonnu(noonnu);
  }

  /**
   * 폰트가 실제로 화면에 그려질 준비가 끝날 때까지 기다림.
   * document.fonts API 사용.
   */
  function whenReady(fonts) {
    const promises = fonts.map(f => {
      const family = f.name;
      const weight = (f.weights && f.weights[0]) || 400;
      return document.fonts.load(`${weight} 16px "${family}"`).catch(() => null);
    });
    return Promise.all(promises);
  }

  return { preload, whenReady };
})();
