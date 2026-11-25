// Вкладка «Кабинет»: прогресс и все следующие шаги в одном месте.
window.Cabinet = {
  render(el) {
    const u = TG.user;
    const name = esc(u ? [u.first_name, u.last_name].filter(Boolean).join(' ') : 'Гость');
    const photo = u && u.photo_url && esc(u.photo_url);
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
        ${this.item('cTariffs', '🎓', 'Тарифы на обучение', 'Программа, кейсы учеников и цены')}
        ${this.item('cSurvey', '📝', 'Записаться на обучение', 'Анкета предзаписи, свяжусь лично')}
        ${this.item('cChat', '🔒', 'Закрытый чат · $45', 'Эфиры, таблицы, живое комьюнити')}
      </div>

      <div class="section-label">Быстрый доступ</div>
      <div class="menu">
        ${this.item('cHome', '🏠', 'Добавить на экран «Домой»', 'Иконка курса на телефоне, как у приложения')}
      </div>

      <div class="section-label">Помощь</div>
      <div class="menu">
        ${this.item('cAsk', '💬', 'Задать вопрос лично', 'Отвечу в Telegram')}
        ${this.item('cChannel', '📢', 'Мой Telegram-канал', '@alexeevonlyyy')}
      </div>

      <div class="section-label">Уведомления</div>
      <div class="menu">
        <label class="menu__item toggle-row">
          <span class="menu__icon">🔔</span>
          <span class="menu__body"><b>Новые материалы</b><span class="muted small">Бот напишет, когда выйдет что-то новое. На доступ к покупкам не влияет</span></span>
          <input type="checkbox" class="toggle" id="cNotify" ${State.get().notify ? 'checked' : ''}>
        </label>
      </div>

      <button class="link-btn muted small" id="cReset">Сбросить прогресс (для теста)</button>
    `;

    const on = (id, fn) => { const b = el.querySelector('#' + id); if (b) b.onclick = fn; };
    on('cContinue', () => App.showTab('course'));
    on('cTariffs', () => TG.openLink(CONFIG.links.caseAndTariffs));
    on('cSurvey', () => TG.openLink(CONFIG.links.survey));
    on('cChat', () => Pass.open());
    on('cAsk', () => TG.openTgLink(CONFIG.links.support));
    on('cChannel', () => TG.openTgLink(CONFIG.links.channel));
    on('cReset', () => State.reset());
    on('cHome', () => this.addToHome());
    this.homeStatus(el);
    el.querySelector('#cNotify').onchange = (e) => {
      TG.haptic('light');
      State.get().notify = e.target.checked; // в боевом боте сохраним в базу бота
      State.save();
    };
  },

  // Ярлык апки на экране телефона (Telegram 8.0+)
  addToHome() {
    TG.haptic('light');
    const tg = window.Telegram && Telegram.WebApp;
    if (TG.inTelegram && tg.isVersionAtLeast('8.0') && tg.addToHomeScreen) return tg.addToHomeScreen();
    const msg = 'Эта функция работает в свежей версии Telegram. Обнови приложение и попробуй ещё раз';
    if (TG.inTelegram) tg.showAlert(msg); else alert(msg);
  },

  // Если ярлык уже добавлен, пишем об этом в подписи
  homeStatus(el) {
    const tg = window.Telegram && Telegram.WebApp;
    if (!TG.inTelegram || !tg.isVersionAtLeast('8.0') || !tg.checkHomeScreenStatus) return;
    tg.checkHomeScreenStatus((status) => {
      const sub = el.querySelector('#cHome .muted');
      if (status === 'added' && sub) sub.textContent = 'Уже на экране «Домой» ✓';
    });
  },

  // На этапе интеграции кнопка откроет бота сразу на оплате USDT
  buyChat() {
    TG.haptic('medium');
    const msg = 'Оплата подключится, когда перенесём апку в основной бот';
    if (TG.inTelegram) Telegram.WebApp.showAlert(msg); else alert(msg);
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
