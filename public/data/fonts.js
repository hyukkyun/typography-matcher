/**
 * Google Fonts 큐레이션 데이터
 *
 * 각 폰트는 Google Fonts의 5개 카테고리 중 하나로 분류됨.
 *  - serif:      고전적/격식 있는 톤 (Playfair, Merriweather, Lora …)
 *  - sans-serif: 모던/깔끔한 톤 (Inter, Roboto, Montserrat …)
 *  - display:    강한 개성/임팩트 (Bebas Neue, Lobster, Oswald …)
 *  - handwriting: 따뜻함/캐주얼 (Caveat, Dancing Script, Pacifico …)
 *  - monospace:  기술적/에디토리얼 (JetBrains Mono, Fira Code, Space Mono …)
 *
 * `weights` 는 미리 받아둘 굵기 셋. CSS API 요청 시 사용.
 * `mood`   는 추천 시 가중치로 쓰는 성격 태그.
 * `scripts` 는 폰트가 어느 문자 체계를 지원하나:
 *   - ['latin']    : 영문/숫자/기본 라틴
 *   - ['korean']   : 한글 (한국어 폰트는 거의 항상 영문도 함께 지원)
 *   - ['latin','korean'] : 둘 다 명시적으로 지원
 */
window.FONT_LIBRARY = [
  // ── SERIF (Latin) ───────────────────────────────────
  { name: 'Playfair Display',     category: 'serif',      weights: [400, 700, 900], mood: ['editorial', 'elegant', 'classic'], scripts: ['latin'] },
  { name: 'Merriweather',          category: 'serif',      weights: [400, 700, 900], mood: ['readable', 'classic', 'editorial'], scripts: ['latin'] },
  { name: 'Lora',                  category: 'serif',      weights: [400, 500, 700], mood: ['readable', 'warm', 'editorial'], scripts: ['latin'] },
  { name: 'PT Serif',              category: 'serif',      weights: [400, 700],      mood: ['classic', 'editorial'], scripts: ['latin'] },
  { name: 'Cormorant Garamond',    category: 'serif',      weights: [400, 500, 700], mood: ['elegant', 'refined', 'classic'], scripts: ['latin'] },
  { name: 'EB Garamond',           category: 'serif',      weights: [400, 500, 700], mood: ['classic', 'refined', 'elegant'], scripts: ['latin'] },
  { name: 'Crimson Text',          category: 'serif',      weights: [400, 600, 700], mood: ['editorial', 'readable', 'classic'], scripts: ['latin'] },
  { name: 'Libre Baskerville',     category: 'serif',      weights: [400, 700],      mood: ['classic', 'editorial'], scripts: ['latin'] },
  { name: 'Source Serif 4',        category: 'serif',      weights: [400, 600, 700], mood: ['readable', 'modern', 'editorial'], scripts: ['latin'] },
  { name: 'Bitter',                category: 'serif',      weights: [400, 500, 700], mood: ['readable', 'warm'], scripts: ['latin'] },
  { name: 'Domine',                category: 'serif',      weights: [400, 500, 700], mood: ['editorial', 'classic'], scripts: ['latin'] },
  { name: 'Frank Ruhl Libre',      category: 'serif',      weights: [400, 500, 700], mood: ['elegant', 'editorial'], scripts: ['latin'] },
  { name: 'Spectral',              category: 'serif',      weights: [400, 500, 700], mood: ['editorial', 'elegant'], scripts: ['latin'] },
  { name: 'Cinzel',                category: 'serif',      weights: [400, 700, 900], mood: ['elegant', 'refined', 'formal'], scripts: ['latin'] },
  { name: 'Vollkorn',              category: 'serif',      weights: [400, 500, 700], mood: ['editorial', 'classic'], scripts: ['latin'] },
  { name: 'Roboto Slab',           category: 'serif',      weights: [400, 500, 700], mood: ['modern', 'readable'], scripts: ['latin'] },
  { name: 'Zilla Slab',            category: 'serif',      weights: [400, 500, 700], mood: ['modern', 'readable'], scripts: ['latin'] },
  { name: 'Noto Serif',            category: 'serif',      weights: [400, 700],      mood: ['readable', 'modern', 'neutral'], scripts: ['latin'] },
  { name: 'Tinos',                 category: 'serif',      weights: [400, 700],      mood: ['classic', 'neutral'], scripts: ['latin'] },

  // ── SANS-SERIF (Latin) ──────────────────────────────
  { name: 'Inter',                 category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'clean', 'tech'], scripts: ['latin'] },
  { name: 'Roboto',                category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'clean', 'neutral'], scripts: ['latin'] },
  { name: 'Open Sans',             category: 'sans-serif', weights: [400, 500, 700],      mood: ['clean', 'readable', 'neutral'], scripts: ['latin'] },
  { name: 'Lato',                  category: 'sans-serif', weights: [400, 700, 900],      mood: ['clean', 'modern', 'warm'], scripts: ['latin'] },
  { name: 'Montserrat',            category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'geometric', 'bold'], scripts: ['latin'] },
  { name: 'Poppins',               category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'geometric', 'friendly'], scripts: ['latin'] },
  { name: 'Source Sans 3',         category: 'sans-serif', weights: [400, 600, 700],      mood: ['clean', 'readable', 'modern'], scripts: ['latin'] },
  { name: 'Raleway',               category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'elegant', 'thin'], scripts: ['latin'] },
  { name: 'Nunito',                category: 'sans-serif', weights: [400, 700, 900],      mood: ['friendly', 'rounded', 'warm'], scripts: ['latin'] },
  { name: 'Work Sans',             category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'clean'], scripts: ['latin'] },
  { name: 'Rubik',                 category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'rounded', 'friendly'], scripts: ['latin'] },
  { name: 'DM Sans',               category: 'sans-serif', weights: [400, 500, 700],      mood: ['modern', 'clean', 'tech'], scripts: ['latin'] },
  { name: 'Manrope',               category: 'sans-serif', weights: [400, 500, 700, 800], mood: ['modern', 'tech', 'clean'], scripts: ['latin'] },
  { name: 'IBM Plex Sans',         category: 'sans-serif', weights: [400, 500, 700],      mood: ['tech', 'clean', 'editorial'], scripts: ['latin'] },
  { name: 'Karla',                 category: 'sans-serif', weights: [400, 500, 700, 800], mood: ['modern', 'editorial'], scripts: ['latin'] },
  { name: 'Mulish',                category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'clean', 'readable'], scripts: ['latin'] },
  { name: 'PT Sans',               category: 'sans-serif', weights: [400, 700],           mood: ['clean', 'classic'], scripts: ['latin'] },
  { name: 'Noto Sans',             category: 'sans-serif', weights: [400, 500, 700],      mood: ['neutral', 'readable', 'modern'], scripts: ['latin'] },
  { name: 'Outfit',                category: 'sans-serif', weights: [400, 500, 700, 900], mood: ['modern', 'geometric'], scripts: ['latin'] },
  { name: 'Plus Jakarta Sans',     category: 'sans-serif', weights: [400, 500, 700, 800], mood: ['modern', 'friendly'], scripts: ['latin'] },
  { name: 'Quicksand',             category: 'sans-serif', weights: [400, 500, 700],      mood: ['friendly', 'rounded', 'warm'], scripts: ['latin'] },

  // ── DISPLAY (Latin) ─────────────────────────────────
  { name: 'Abril Fatface',         category: 'display',    weights: [400],                mood: ['impact', 'editorial', 'elegant'], scripts: ['latin'] },
  { name: 'Bebas Neue',            category: 'display',    weights: [400],                mood: ['impact', 'condensed', 'bold'], scripts: ['latin'] },
  { name: 'Oswald',                category: 'display',    weights: [400, 500, 700],      mood: ['condensed', 'impact', 'editorial'], scripts: ['latin'] },
  { name: 'Anton',                 category: 'display',    weights: [400],                mood: ['impact', 'condensed', 'bold'], scripts: ['latin'] },
  { name: 'Righteous',             category: 'display',    weights: [400],                mood: ['playful', 'bold', 'retro'], scripts: ['latin'] },
  { name: 'Bungee',                category: 'display',    weights: [400],                mood: ['playful', 'impact', 'bold'], scripts: ['latin'] },
  { name: 'Alfa Slab One',         category: 'display',    weights: [400],                mood: ['impact', 'bold', 'retro'], scripts: ['latin'] },
  { name: 'Bowlby One',            category: 'display',    weights: [400],                mood: ['playful', 'bold', 'impact'], scripts: ['latin'] },
  { name: 'Fjalla One',            category: 'display',    weights: [400],                mood: ['condensed', 'impact', 'editorial'], scripts: ['latin'] },
  { name: 'Russo One',             category: 'display',    weights: [400],                mood: ['tech', 'impact', 'bold'], scripts: ['latin'] },
  { name: 'Black Ops One',         category: 'display',    weights: [400],                mood: ['tech', 'impact', 'military'], scripts: ['latin'] },
  { name: 'Permanent Marker',      category: 'display',    weights: [400],                mood: ['handwritten', 'bold', 'casual'], scripts: ['latin'] },
  { name: 'Lobster',               category: 'display',    weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['latin'] },
  { name: 'Pacifico',              category: 'display',    weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['latin'] },

  // ── HANDWRITING (Latin) ─────────────────────────────
  { name: 'Dancing Script',        category: 'handwriting',weights: [400, 500, 700],      mood: ['script', 'casual', 'elegant'], scripts: ['latin'] },
  { name: 'Great Vibes',           category: 'handwriting',weights: [400],                mood: ['script', 'elegant', 'formal'], scripts: ['latin'] },
  { name: 'Sacramento',            category: 'handwriting',weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['latin'] },
  { name: 'Caveat',                category: 'handwriting',weights: [400, 500, 700],      mood: ['casual', 'warm', 'casual'], scripts: ['latin'] },
  { name: 'Kalam',                 category: 'handwriting',weights: [400, 700],           mood: ['casual', 'warm', 'readable'], scripts: ['latin'] },
  { name: 'Indie Flower',          category: 'handwriting',weights: [400],                mood: ['casual', 'playful', 'warm'], scripts: ['latin'] },
  { name: 'Patrick Hand',          category: 'handwriting',weights: [400],                mood: ['casual', 'readable', 'warm'], scripts: ['latin'] },
  { name: 'Shadows Into Light',    category: 'handwriting',weights: [400],                mood: ['casual', 'playful'], scripts: ['latin'] },
  { name: 'Architects Daughter',   category: 'handwriting',weights: [400],                mood: ['casual', 'tech', 'playful'], scripts: ['latin'] },
  { name: 'Amatic SC',             category: 'handwriting',weights: [400, 700],           mood: ['casual', 'handwritten', 'playful'], scripts: ['latin'] },
  { name: 'Satisfy',               category: 'handwriting',weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['latin'] },
  { name: 'Homemade Apple',        category: 'handwriting',weights: [400],                mood: ['casual', 'warm', 'authentic'], scripts: ['latin'] },

  // ── MONOSPACE (Latin) ───────────────────────────────
  { name: 'Roboto Mono',           category: 'monospace',  weights: [400, 500, 700],      mood: ['tech', 'editorial', 'clean'], scripts: ['latin'] },
  { name: 'Source Code Pro',       category: 'monospace',  weights: [400, 500, 700],      mood: ['tech', 'editorial', 'readable'], scripts: ['latin'] },
  { name: 'JetBrains Mono',        category: 'monospace',  weights: [400, 500, 700, 800], mood: ['tech', 'clean', 'editorial'], scripts: ['latin'] },
  { name: 'Fira Code',             category: 'monospace',  weights: [400, 500, 700],      mood: ['tech', 'clean', 'ligatures'], scripts: ['latin'] },
  { name: 'IBM Plex Mono',         category: 'monospace',  weights: [400, 500, 700],      mood: ['tech', 'editorial', 'clean'], scripts: ['latin'] },
  { name: 'Space Mono',            category: 'monospace',  weights: [400, 700],           mood: ['tech', 'retro', 'editorial'], scripts: ['latin'] },
  { name: 'Inconsolata',           category: 'monospace',  weights: [400, 700],           mood: ['tech', 'readable', 'editorial'], scripts: ['latin'] },
  { name: 'Cousine',               category: 'monospace',  weights: [400, 700],           mood: ['tech', 'clean', 'neutral'], scripts: ['latin'] },
  { name: 'PT Mono',               category: 'monospace',  weights: [400],                mood: ['tech', 'classic'], scripts: ['latin'] },

  // ── KOREAN — SERIF (명조) ────────────────────────────
  { name: 'Noto Serif KR',         category: 'serif',      weights: [200, 300, 400, 500, 600, 700, 900], mood: ['editorial', 'classic', 'readable'], scripts: ['korean'] },
  { name: 'Nanum Myeongjo',        category: 'serif',      weights: [400, 700, 800],      mood: ['classic', 'refined', 'elegant'], scripts: ['korean'] },
  { name: 'Song Myung',            category: 'serif',      weights: [400],                mood: ['classic', 'refined', 'formal'], scripts: ['korean'] },
  { name: 'IBM Plex Serif KR',     category: 'serif',      weights: [400, 500, 700],      mood: ['editorial', 'tech', 'clean'], scripts: ['korean'] },

  // ── KOREAN — SANS-SERIF (고딕) ──────────────────────
  { name: 'Noto Sans KR',          category: 'sans-serif', weights: [100, 300, 400, 500, 700, 900], mood: ['clean', 'readable', 'modern'], scripts: ['korean'] },
  { name: 'Nanum Gothic',          category: 'sans-serif', weights: [400, 700, 800],      mood: ['clean', 'readable', 'neutral'], scripts: ['korean'] },
  { name: 'Nanum Square',          category: 'sans-serif', weights: [400, 700, 800],      mood: ['modern', 'clean', 'geometric'], scripts: ['korean'] },
  { name: 'IBM Plex Sans KR',      category: 'sans-serif', weights: [400, 500, 700],      mood: ['tech', 'clean', 'editorial'], scripts: ['korean'] },
  { name: 'Jua',                   category: 'sans-serif', weights: [400],                mood: ['friendly', 'rounded', 'warm'], scripts: ['korean'] },
  { name: 'Gmarket Sans',          category: 'sans-serif', weights: [300, 500, 700, 900], mood: ['modern', 'clean', 'tech'], scripts: ['korean'] },

  // ── KOREAN — DISPLAY ────────────────────────────────
  { name: 'Black Han Sans',        category: 'display',    weights: [400],                mood: ['impact', 'bold', 'condensed'], scripts: ['korean'] },
  { name: 'Do Hyeon',              category: 'display',    weights: [400],                mood: ['playful', 'bold', 'casual'], scripts: ['korean'] },
  { name: 'Gugi',                  category: 'display',    weights: [400],                mood: ['playful', 'rounded', 'casual'], scripts: ['korean'] },
  { name: 'East Sea Dokdo',        category: 'display',    weights: [400],                mood: ['elegant', 'refined', 'casual'], scripts: ['korean'] },
  { name: 'Yeon Sung',             category: 'display',    weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['korean'] },

  // ── KOREAN — HANDWRITING ────────────────────────────
  { name: 'Nanum Brush Script',    category: 'handwriting',weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['korean'] },
  { name: 'Nanum Pen Script',      category: 'handwriting',weights: [400],                mood: ['script', 'casual', 'handwritten'], scripts: ['korean'] },
  { name: 'Single Day',            category: 'handwriting',weights: [400],                mood: ['casual', 'handwritten', 'playful'], scripts: ['korean'] },
  { name: 'Hi Melody',             category: 'handwriting',weights: [400],                mood: ['script', 'casual', 'warm'], scripts: ['korean'] },
  { name: 'Cute Font',             category: 'handwriting',weights: [400],                mood: ['playful', 'casual', 'warm'], scripts: ['korean'] },
  { name: 'Gaegu',                 category: 'handwriting',weights: [400],                mood: ['casual', 'handwritten', 'warm'], scripts: ['korean'] },

  // ── KOREAN — MONOSPACE ──────────────────────────────
  { name: 'Nanum Gothic Coding',   category: 'monospace',  weights: [400, 700],           mood: ['tech', 'clean', 'readable'], scripts: ['korean'] },
  { name: 'D2 Coding',             category: 'monospace',  weights: [400, 500, 700],      mood: ['tech', 'clean', 'ligatures'], scripts: ['korean'] }
];

window.FONT_CATEGORIES = ['serif', 'sans-serif', 'display', 'handwriting', 'monospace'];

window.CATEGORY_LABEL = {
  'serif':      'Serif',
  'sans-serif': 'Sans-serif',
  'display':    'Display',
  'handwriting':'Handwriting',
  'monospace':  'Monospace'
};

// ── 한국어 폰트 수 카운트 (디버그/UI 용) ──────────────
window.KOREAN_FONT_COUNT = window.FONT_LIBRARY.filter(f => f.scripts.includes('korean')).length;
