// Загрузочный экран и приветствие при первом входе.
window.Splash = {
  MIN_MS: 1800,   // заливка не быстрее этого, чтобы анимацию успели увидеть
  MAX_MS: 7000,   // при плохом интернете дольше не держим
  HOLD_AT: 0.9,   // пока страница не загрузилась, золото стоит на 90%

  // Логотип заливается золотом = индикатор загрузки.
  // Уровень растёт со временем, но до 100% доходит только когда
  // загрузились шрифты, скрипты и картинки (событие load).
  run(onDone) {
    const splash = document.getElementById('splash');
    const wave = document.getElementById('ofWave');
    const pct = document.getElementById('splashPct');
    const start = performance.now();
    let ready = document.readyState === 'complete';
    if (!ready) window.addEventListener('load', () => { ready = true; }, { once: true });

    let p = 0;
    const tick = (now) => {
      const t = now - start;
      const cap = ready || t > this.MAX_MS ? 1 : this.HOLD_AT;
      const goal = Math.min(cap, Math.max(0, (t - 250) / this.MIN_MS));
      p += (goal - p) * 0.15;              // плавно догоняем цель
      if (goal >= 1 && p > 0.995) p = 1;

      // Волна поднимается снизу (y=495 – пусто) вверх (y=155 – полный логотип)
      // и всё время бежит вбок, чтобы золото «плескалось»
      const y = 495 - p * 340;
      const x = -((t * 0.12) % 200);
      wave.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      pct.textContent = Math.round(p * 100) + '%';

      if (p < 1) return requestAnimationFrame(tick);
      this.finish(splash, onDone);
    };
    requestAnimationFrame(tick);
  },

  // Долилось до 100%: вспышка, искры, блик – и открываем апку
  finish(splash, onDone) {
    splash.classList.add('splash--done');
    TG.haptic('medium');
    setTimeout(() => {
      splash.classList.add('splash--out');
      setTimeout(() => { splash.remove(); onDone(); }, 600);
    }, 1000);
  },

  // Строки приветствия «вытекают» по очереди. Кнопка появляется последней
  // и ждёт нажатия: человек читает в своём темпе, ничего не исчезает само.
  showWelcome(onStart) {
    const w = CONFIG.welcome;
    const el = document.getElementById('welcome');
    const name = TG.user && esc(TG.user.first_name);
    const step = 0.55; // секунды между строками
    let n = 0;
    const d = () => `style="animation-delay:${(n++ * step).toFixed(2)}s"`;

    el.innerHTML = `
      <img class="welcome__avatar flow" ${d()} src="img/avatar.jpg?v=2" alt="Валерий">
      <div class="welcome__label gold-text flow" ${d()}>${w.label}</div>
      <h1 class="welcome__title flow" ${d()}>${name ? `${name}, привет!<br>Это&nbsp;Валерий&nbsp;👋` : w.title}</h1>
      <p class="welcome__text flow" ${d()}>${w.text}</p>
      <ul class="welcome__list">
        ${w.points.map((p) => `<li class="flow" ${d()}>${p}</li>`).join('')}
      </ul>
      <div class="welcome__gift flow" ${d()}>${w.gift}</div>
      <button class="btn flow" ${d()} id="welcomeStart">${w.button} →</button>
    `;
    el.hidden = false;

    document.getElementById('welcomeStart').onclick = () => {
      TG.haptic('medium');
      State.get().welcomed = true;
      State.save();
      el.classList.add('welcome--out');
      setTimeout(() => { el.hidden = true; onStart(); }, 500);
    };
  },
};
