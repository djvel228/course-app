// Загрузочный экран (~2.5 сек) и приветствие при первом входе.
window.Splash = {
  run(onDone) {
    const splash = document.getElementById('splash');
    setTimeout(() => {
      splash.classList.add('splash--out');
      setTimeout(() => { splash.remove(); onDone(); }, 600);
    }, 2500);
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
      <img class="welcome__avatar flow" ${d()} src="img/avatar.jpg" alt="Валерий">
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
