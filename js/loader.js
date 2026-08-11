/**
 * Google Fonts CSS API를 통해 폰트를 동적으로 로드.
 *
 *   https://fonts.googleapis.com/css2?family=Font+Name:wght@400;700&display=swap
 *
 * 이미 로드된 폰트는 재요청하지 않고, 새 폰트는 <link> 태그로 주입.
 * 로딩 완료 시 콜백을 호출해서 미리보기 폰트를 즉시 swap.
 */
window.FontLoader = (function () {
  const loaded = new Set();

  function fontParam(font) {
    const family = font.name.replace(/ /g, '+');
    if (!font.weights || font.weights.length === 0) {
      return family;
    }
    return `${family}:wght@${font.weights.join(';')}`;
  }

  function urlFor(fonts) {
    const params = fonts.map(fontParam).join('&family=');
    return `https://fonts.googleapis.com/css2?family=${params}&display=swap`;
  }

  function preload(fonts) {
    if (!fonts || fonts.length === 0) return;
    const needed = fonts.filter(f => !loaded.has(f.name));
    if (needed.length === 0) return;

    // 한 번에 묶어서 요청 — 브라우저 병렬 fetch
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = urlFor(needed);
    link.setAttribute('data-fonts', needed.map(f => f.name).join('|'));
    document.head.appendChild(link);

    needed.forEach(f => loaded.add(f.name));
  }

  /**
   * 폰트가 실제로 화면에 그려질 준비가 끝날 때까지 기다림.
   * document.fonts API 사용.
   */
  function whenReady(fonts) {
    const promises = fonts.map(f => {
      const family = f.name;
      const weight = (f.weights && f.weights[0]) || 400;
      // italic 0, weight 명시
      return document.fonts.load(`${weight} 16px "${family}"`).catch(() => null);
    });
    return Promise.all(promises);
  }

  return { preload, whenReady };
})();
