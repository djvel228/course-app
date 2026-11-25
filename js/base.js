// Вкладка «База»: закрыта до конца курса, потом статьи + закрытый раздел за $45.
window.Base = {
  tag: 'Все',

  render(el) {
    if (!State.courseDone()) return this.renderLocked(el);
    const list = CONFIG.articles.filter((a) => this.tag === 'Все' || a.tag === this.tag);

    el.innerHTML = `
      <header class="page-head">
        <div class="page-head__label gold-text">Подарок за курс</div>
        <h1>База знаний</h1>
        <p class="muted">${CONFIG.articles.length} статей · пополняется каждую неделю</p>
      </header>

      <div class="chips">
        ${CONFIG.tags.map((t) => `<button class="chip ${t === this.tag ? 'is-active' : ''}" data-tag="${t}">${t}</button>`).join('')}
      </div>

      <div class="articles">
        ${list.map((a, i) => `
          <button class="card article" data-url="${a.url}">
            <span class="article__tag">${a.tag}</span>
            <b>${a.title}</b>
            <span class="article__arrow">›</span>
          </button>`).join('')}
      </div>

      ${this.closedBlock()}
    `;

    el.querySelectorAll('[data-tag]').forEach((b) => {
      b.onclick = () => { this.tag = b.dataset.tag; TG.haptic('light'); this.render(el); };
    });
    el.querySelectorAll('[data-url]').forEach((b) => {
      b.onclick = () => TG.openTgLink(b.dataset.url);
    });
    el.querySelector('#buyChat').onclick = () => Base.buyChat();
  },

  closedBlock() {
    const c = CONFIG.closedChat;
    return `
      <section class="closed">
        <div class="closed__head">
          <span class="closed__lock">🔒</span>
          <div>
            <b>Материалы закрытого чата</b>
            <div class="muted small">Эфиры, таблицы, разборы и живое комьюнити</div>
          </div>
        </div>
        <ul class="points">${c.items.map((x) => `<li>${x}</li>`).join('')}</ul>
        <button class="btn" id="buyChat">Получить доступ · $${c.price}</button>
      </section>`;
  },

  // На этапе интеграции кнопка откроет бота сразу на оплате USDT
  buyChat() {
    TG.haptic('medium');
    const msg = 'Оплата подключится, когда перенесём апку в основной бот';
    if (TG.inTelegram) Telegram.WebApp.showAlert(msg); else alert(msg);
  },

  renderLocked(el) {
    const done = State.get().done.length;
    const total = CONFIG.lessons.length;
    el.innerHTML = `
      <div class="locked">
        <div class="locked__icon">🔒</div>
        <h1>База знаний</h1>
        <p class="muted">Все мои статьи про OnlyFans-агентство откроются в подарок, когда ты пройдёшь базовый курс</p>
        <div class="card progress">
          <div class="progress__row"><span>Пройдено</span><b>${done} из ${total}</b></div>
          <div class="progress__bar"><span style="width:${Math.round(done / total * 100)}%"></span></div>
        </div>
        <button class="btn" id="goCourse">Продолжить курс</button>
      </div>`;
    el.querySelector('#goCourse').onclick = () => App.showTab('course');
  },
};
