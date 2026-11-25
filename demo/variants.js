// Варианты 1 и 2: «Жидкое золото» и «3D-вращение».
// Повтор = заново вставить разметку: CSS- и SVG-анимации стартуют с нуля.
(function () {
  const L = window.LOGO;
  const vb = L.viewBox;

  const shine = (p, cls) => `
    <g clip-path="url(#${p}clip)"><g transform="rotate(20 320 330)">
      <rect class="${cls}" x="-60" y="0" width="120" height="700" fill="url(#${p}s)"/>
    </g></g>`;

  // Волна, которая поднимается снизу и «заливает» логотип золотом
  const wave = 'M-200 0' + ' q50 -24 100 0 t100 0'.repeat(10) + ' V800 H-200 Z';

  function liquid(stage) {
    const p = 'lq';
    const sparks = Array.from({ length: 16 }, (_, k) =>
      `<i style="--a:${k * 22.5}deg;--d:${90 + (k % 3) * 35}px;--s:${4 + (k % 4)}px"></i>`).join('');

    stage.innerHTML = `
      <div class="lq-flash"></div>
      <svg class="lq" viewBox="${vb}">
        <defs>${L.defs(p)}${L.shadowFilter(p)}
          <mask id="${p}m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="800">
            <path fill="#fff" d="${wave}" transform="translate(0 520)">
              <animateTransform attributeName="transform" type="translate"
                values="0 520; -100 330; -200 140" keyTimes="0;.5;1" dur="1.3s" begin="0.7s" fill="freeze"/>
            </path>
          </mask>
        </defs>
        <g mask="url(#${p}m)">${L.solid(p)}</g>
        <path class="lq-line" d="${L.O}" pathLength="1"/>
        <path class="lq-line lq-line--2" d="${L.W}" pathLength="1"/>
        ${shine(p, 'lq-shine')}
      </svg>
      <div class="lq-sparks">${sparks}</div>`;
  }

  function spin(stage) {
    const p = 'sp';
    // Объём: 10 тёмных копий логотипа одна за другой по глубине
    const layers = Array.from({ length: 10 }, (_, k) => {
      const z = -(10 - k) * 1.6;
      return `<svg class="sp-layer" style="transform:translateZ(${z}px)" viewBox="${vb}">
        <path d="${L.O}" fill-rule="evenodd" fill="#6e4a1a"/><path d="${L.W}" fill="#8a6124"/></svg>`;
    }).join('');

    stage.innerHTML = `
      <div class="sp-rays"></div>
      <div class="sp-glow"></div>
      <div class="sp-scene">
        <div class="sp-logo">
          ${layers}
          <svg class="sp-layer" viewBox="${vb}">
            <defs>${L.defs(p)}${L.shadowFilter(p)}</defs>
            ${L.solid(p)}
            ${shine(p, 'sp-shine')}
          </svg>
        </div>
      </div>`;
  }

  window.VARIANTS = { liquid, spin };
})();
