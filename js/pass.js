// «Пропуск» в закрытый чат: золотая карточка в базе и экран с подробностями.
window.Pass = {
  // Карточка под дашбордом базы (как промо-блок у конкурента, но в золоте)
  card() {
    const c = CONFIG.pass;
    return `
      <section class="pass" id="passCard">
        <div class="pass__shine"></div>
        <div class="pass__label">${c.label}</div>
        <h2 class="pass__title">${c.title}</h2>
        <p class="pass__text">${c.short}</p>
        <button class="pass__more">Подробнее <span>›</span></button>
      </section>`;
  },

  bind(root) {
    const el = root.querySelector('#passCard');
    if (el) el.onclick = () => { TG.haptic('light'); Pass.open(); };
  },

  open() {
    const c = CONFIG.pass;
    const ov = document.getElementById('overlay');
    ov.innerHTML = `
      <div class="lesson-view pass-view">
        <div class="lesson-view__top">
          <button class="back" id="psBack">‹ Назад</button>
          <span class="muted small">Закрытый чат</span>
        </div>

        <section class="pass pass--static">
          <div class="pass__shine"></div>
          <div class="pass__label">${c.label}</div>
          <h2 class="pass__title">${c.title}</h2>
          <p class="pass__text">${c.short}</p>
        </section>

        <div class="section-label">Кому будет полезен</div>
        <div class="card"><ul class="points">${c.forWhom.map((x) => `<li>${x}</li>`).join('')}</ul></div>

        <div class="section-label">Что внутри</div>
        <div class="pass-inside">
          ${c.inside.map((x) => `
            <div class="card pass-item">
              <span class="pass-item__icon">${x.icon}</span>
              <span><b>${x.title}</b><span class="muted small">${x.text}</span></span>
            </div>`).join('')}
        </div>

        <div class="pass-price card card--gold">
          <span class="muted small">Стоимость сейчас</span>
          <b class="gold-text">$${c.price}</b>
        </div>

        <div class="lesson-view__cta">
          <button class="btn" id="psBuy">Получить доступ · $${c.price}</button>
        </div>
      </div>`;
    ov.hidden = false;
    ov.scrollTop = 0;

    const close = () => { ov.hidden = true; ov.innerHTML = ''; TG.backButton(null); App.refresh(); };
    TG.backButton(close);
    document.getElementById('psBack').onclick = close;
    document.getElementById('psBuy').onclick = () => Cabinet.buyChat();
  },
};
