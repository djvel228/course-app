// Экран «Курс пройден»: подарки.
// Подарок 1 – разбор кейса (это твой сайт: видео-кейс, программа, тарифы).
// Подарок 2 – открытая база знаний.
window.Gift = {
  open() {
    const ov = document.getElementById('overlay');
    State.get().giftClaimed = true;
    State.save();

    ov.innerHTML = `
      <div class="gift">
        <div class="gift__burst">${Array.from({ length: 16 }, (_, k) =>
          `<i style="--a:${k * 22.5}deg;animation-delay:${(k % 4) * 0.05}s"></i>`).join('')}</div>
        <div class="gift__box flow">🎁</div>
        <div class="gift__label gold-text flow" style="animation-delay:.3s">Курс пройден</div>
        <h1 class="gift__title flow" style="animation-delay:.5s">Ты дошёл до конца.<br>Держи подарки</h1>

        <div class="card card--gold gift__item flow" style="animation-delay:.9s">
          <div class="gift__num gold-text">Подарок 1</div>
          <b>Видео-разбор кейса моих учеников</b>
          <p class="muted small">Как ребята сделали $5 600 в первый месяц. Интервью, цифры и что именно они делали по шагам</p>
          <button class="btn" id="gCase">Смотреть разбор</button>
        </div>

        <div class="card gift__item flow" style="animation-delay:1.2s">
          <div class="gift__num gold-text">Подарок 2</div>
          <b>Открыта база знаний</b>
          <p class="muted small">Все мои статьи про OnlyFans-агентство: рынок, трафик, запуск, команда</p>
          <button class="btn btn--ghost" id="gBase">Открыть базу</button>
        </div>

        <button class="link-btn flow" style="animation-delay:1.5s" id="gCabinet">Перейти в мой кабинет</button>
      </div>`;
    ov.hidden = false;
    ov.scrollTop = 0;
    TG.haptic('heavy');

    const close = (tab) => { ov.hidden = true; ov.innerHTML = ''; TG.backButton(null); App.showTab(tab); };
    TG.backButton(() => close('course'));
    document.getElementById('gCase').onclick = () => TG.openLink(CONFIG.links.caseAndTariffs);
    document.getElementById('gBase').onclick = () => close('base');
    document.getElementById('gCabinet').onclick = () => close('cabinet');
  },
};
