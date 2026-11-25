// Вариант 3: золотые частицы слетаются и складываются в логотип.
// Точки берём прямо из контура логотипа: рисуем его на невидимом холсте
// и собираем координаты закрашенных пикселей.
(function () {
  const L = window.LOGO;
  let targets = null;

  function sampleTargets() {
    const c = document.createElement('canvas');
    c.width = c.height = 500;
    const x = c.getContext('2d');
    x.translate(-70, -80); // сдвиг как у viewBox
    x.fill(new Path2D(L.O), 'evenodd');
    x.fill(new Path2D(L.W));
    const data = x.getImageData(0, 0, 500, 500).data;
    const pts = [];
    for (let y = 0; y < 500; y += 9) {
      for (let xx = 0; xx < 500; xx += 9) {
        if (data[(y * 500 + xx) * 4 + 3] > 128) pts.push([xx / 500, y / 500]);
      }
    }
    return pts;
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const COLORS = ['#FFF4D2', '#F7D774', '#E9B949', '#F2C94C', '#FFE9A8'];

  function particles(stage) {
    targets = targets || sampleTargets();
    const p = 'pt';
    stage.innerHTML = `
      <canvas class="pt-canvas"></canvas>
      <div class="pt-wave"></div>
      <svg class="pt-logo" viewBox="${L.viewBox}">
        <defs>${L.defs(p)}${L.shadowFilter(p)}</defs>${L.solid(p)}
      </svg>`;

    const cv = stage.querySelector('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = stage.clientWidth, H = stage.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    const size = 170; // размер логотипа на экране, как в других вариантах
    const ox = (W - size) / 2, oy = (H - size) / 2;
    const parts = targets.map(([tx, ty]) => {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.max(W, H) * (0.6 + Math.random() * 0.5);
      return {
        sx: W / 2 + Math.cos(ang) * r, sy: H / 2 + Math.sin(ang) * r,
        tx: ox + tx * size, ty: oy + ty * size,
        delay: Math.random() * 500, dur: 900 + Math.random() * 500,
        size: 1.2 + Math.random() * 1.8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        swirl: (Math.random() - 0.5) * 1.6,
      };
    });

    const start = performance.now();
    function frame(now) {
      if (!document.body.contains(cv)) return; // вариант перезапустили
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      let alpha = t > 1900 ? Math.max(0, 1 - (t - 1900) / 500) : 1;
      for (const q of parts) {
        const k = Math.min(1, Math.max(0, (t - q.delay) / q.dur));
        const e = ease(k);
        // Частица летит по дуге: добавляем «закрутку», которая гаснет к концу
        const sw = q.swirl * (1 - e) * 60;
        const x = q.sx + (q.tx - q.sx) * e + sw;
        const y = q.sy + (q.ty - q.sy) * e - sw;
        ctx.globalAlpha = alpha * (0.35 + 0.65 * e);
        ctx.fillStyle = q.color;
        ctx.beginPath();
        ctx.arc(x, y, q.size * (1.6 - 0.6 * e), 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 2500) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.VARIANTS.particles = particles;
})();
