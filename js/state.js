// Прогресс человека и обёртки над Telegram.
// Пока прогресс хранится в телефоне (localStorage). На этапе интеграции
// он будет храниться в базе бота, чтобы ты видел его в админке.
(function () {
  const KEY = 'course_state_v1';
  const tg = window.Telegram && window.Telegram.WebApp;
  const inTelegram = !!(tg && tg.initData);

  const defaults = { welcomed: false, done: [], giftClaimed: false, read: [] };

  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY))); }
    catch (e) { return Object.assign({}, defaults); }
  }

  const state = load();

  window.State = {
    get: () => state,
    save() { localStorage.setItem(KEY, JSON.stringify(state)); },
    markDone(i) { if (!state.done.includes(i)) state.done.push(i); this.save(); },
    markRead(id) { if (!state.read.includes(id)) state.read.push(id); this.save(); },
    isDone: (i) => state.done.includes(i),
    isOpen: (i) => i === 0 || state.done.includes(i - 1),
    courseDone: () => state.done.length >= window.CONFIG.lessons.length,
    reset() { localStorage.removeItem(KEY); location.reload(); },
  };

  // Экранирование текста от пользователя (имя из Telegram) перед вставкой в HTML
  window.esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  window.TG = {
    inTelegram,
    user: (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || null,
    init() {
      if (!tg) return;
      tg.ready();
      tg.expand();
      try { tg.setHeaderColor('#0a0a0a'); tg.setBackgroundColor('#0a0a0a'); } catch (e) {}
    },
    haptic(type) {
      try { tg.HapticFeedback.impactOccurred(type || 'light'); } catch (e) {}
    },
    // Внешняя ссылка (сайт, анкета): в Telegram открывается во встроенном браузере
    openLink(url) {
      if (inTelegram) tg.openLink(url); else window.open(url, '_blank');
    },
    // Ссылка на Telegram (канал, пост, поддержка): открывается внутри Telegram
    openTgLink(url) {
      if (inTelegram) tg.openTelegramLink(url); else window.open(url, '_blank');
    },
    backButton(onClick) {
      if (!inTelegram) return;
      tg.BackButton.offClick(TG._back || (() => {}));
      TG._back = onClick;
      if (onClick) { tg.BackButton.onClick(onClick); tg.BackButton.show(); }
      else tg.BackButton.hide();
    },
  };
})();
