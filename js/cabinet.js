// Вкладка «Кабинет»: прогресс и все следующие шаги в одном месте.
window.Cabinet = {
  render(el) {
    const u = TG.user;
    const name = u ? [u.first_name, u.last_name].filter(Boolean).join(' ') : 'Гость';
    const photo = u && u.photo_url;
    const done = State.get().done.length;
    const total = CONFIG.lessons.length;
    const finished = State.courseDone();

    el.innerHTML = `
      <header class="profile">
        <div class="profile__avatar">${photo ? `<img src="${photo}" alt="">` : name[0]}</div>
        <div>
          <h1>${name}</h1>
          <div class="muted small">${finished ? 'Базовый курс пройден ✓' : `Курс: ${done} из ${total} уроков`}</div>
        </div>
      </header>

      ${finished ? '' : `
        <div class="card card--gold row-card" id="cContinue">
          <div><b>Продолжить курс</b><div class="muted small">Осталось уроков: ${total - done}. В конце – подарки</div></div>
          <span class="row-card__arrow">›</span>
        </div>`}

      <div class="section-label">Обучение</div>
      <div class="menu">
        ${this.item('cCase', '🎓', 'Разбор кейса и тарифы', 'Как ученики сделали $5 600 в первый месяц', !finished)}
        ${this.item('cSurvey', '📝', 'Записаться на групповое обучение', 'Анкета предзаписи, свяжусь лично')}
        ${this.item('cChat', '🔒', 'Закрытый чат · $45', 'Эфиры, таблицы, комьюнити')}
      </div>

      <div class="section-label">Ещё</div>
      <div class="menu">
        ${this.item('cChannel', '📢', 'Мой Telegram-канал', '@alexeevonlyyy')}
        ${this.item('cSupport', '💬', 'Написать в поддержку', 'Ответим на любой вопрос')}
      </div>

      <button class="link-btn muted small" id="cReset">Сбросить прогресс (для теста)</button>
    `;

    const on = (id, fn) => { const b = el.querySelector('#' + id); if (b) b.onclick = fn; };
    on('cContinue', () => App.showTab('course'));
    on('cCase', () => {
      if (!finished) { TG.haptic('rigid'); return; }
      TG.openLink(CONFIG.links.caseAndTariffs);
    });
    on('cSurvey', () => TG.openLink(CONFIG.links.survey));
    on('cChat', () => Base.buyChat());
    on('cChannel', () => TG.openTgLink(CONFIG.links.channel));
    on('cSupport', () => TG.openTgLink(CONFIG.links.support));
    on('cReset', () => State.reset());
  },

  item(id, icon, title, sub, locked) {
    return `
      <button class="menu__item ${locked ? 'is-locked' : ''}" id="${id}">
        <span class="menu__icon">${icon}</span>
        <span class="menu__body"><b>${title}</b><span class="muted small">${locked ? 'Откроется после курса' : sub}</span></span>
        <span class="menu__arrow">${locked ? '🔒' : '›'}</span>
      </button>`;
  },
};
