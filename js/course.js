// Вкладка «Курс»: список уроков и экран урока с видео.
window.Course = {
  render(el) {
    const L = CONFIG.lessons;
    const done = State.get().done.length;
    const pct = Math.round((done / L.length) * 100);
    const gift = State.courseDone();

    el.innerHTML = `
      <header class="hero">
        <img class="hero__avatar" src="img/avatar.jpg" alt="">
        <div>
          <div class="hero__label gold-text">Базовый курс</div>
          <h1 class="hero__title">OnlyFans-агентство с&nbsp;нуля</h1>
        </div>
      </header>

      <div class="card progress">
        <div class="progress__row"><span>Твой прогресс</span><b>${done} из ${L.length} уроков</b></div>
        <div class="progress__bar"><span style="width:${pct}%"></span></div>
      </div>

      <div class="lessons">
        ${L.map((l, i) => this.lessonCard(l, i)).join('')}
        ${gift ? `
        <div class="card lesson lesson--finished">
          <span class="lesson__num">✓</span>
          <span class="lesson__body">
            <b>Курс пройден</b>
            <span class="muted small">Уроки можно пересматривать в любое время</span>
          </span>
        </div>` : `
        <div class="card lesson is-locked">
          <span class="lesson__num">🎁</span>
          <span class="lesson__body">
            <b>Подарки после курса</b>
            <span class="muted small">Откроются после 3-го урока</span>
          </span>
          <span class="lesson__state">🔒</span>
        </div>`}
      </div>
    `;

    el.querySelectorAll('[data-lesson]').forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.lesson;
        if (!State.isOpen(i)) { TG.haptic('rigid'); return; }
        this.openLesson(i);
      };
    });
  },

  lessonCard(l, i) {
    const open = State.isOpen(i);
    const done = State.isDone(i);
    const cls = done ? 'is-done' : open ? 'is-open' : 'is-locked';
    const status = done ? '✓' : open ? '▶' : '🔒';
    return `
      <button class="card lesson ${cls}" data-lesson="${i}">
        <span class="lesson__num">${i + 1}</span>
        <span class="lesson__body">
          <b>${l.title}</b>
          <span class="muted small">${done ? 'Просмотрено' : open ? 'Урок ' + (i + 1) : 'Откроется после урока ' + i}</span>
        </span>
        <span class="lesson__state">${status}</span>
      </button>`;
  },

  openLesson(i) {
    const l = CONFIG.lessons[i];
    const last = i === CONFIG.lessons.length - 1;
    const ov = document.getElementById('overlay');
    const already = State.isDone(i);

    ov.innerHTML = `
      <div class="lesson-view">
        <div class="lesson-view__top">
          <button class="back" id="lvBack">‹ Назад</button>
          <span class="muted small">Урок ${i + 1} из ${CONFIG.lessons.length}</span>
        </div>
        <div class="video">
          <iframe src="https://www.youtube.com/embed/${l.youtube}?rel=0&modestbranding=1&playsinline=1"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
        </div>
        <h2 class="lesson-view__title">${l.title}</h2>
        <div class="card">
          <div class="lesson-view__label gold-text">Что в видео</div>
          <ul class="points">${l.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="hint">🎁 Пройди все ${CONFIG.lessons.length} урока до конца – в конце тебя ждут подарки</div>
        <div class="lesson-view__cta">
          <button class="btn" id="lvNext" disabled></button>
        </div>
      </div>`;
    ov.hidden = false;
    ov.scrollTop = 0;

    const close = () => { ov.hidden = true; ov.innerHTML = ''; TG.backButton(null); App.refresh(); };
    document.getElementById('lvBack').onclick = close;
    TG.backButton(close);

    const btn = document.getElementById('lvNext');
    const label = last ? '🎁 Получить подарки' : 'Следующий урок →';
    const unlock = () => { btn.disabled = false; btn.textContent = label; };

    // Кнопка открывается не сразу, чтобы человек начал смотреть видео
    if (already) unlock();
    else {
      let left = CONFIG.unlockAfterSec;
      const tick = () => {
        if (!document.body.contains(btn)) return;
        if (left <= 0) return unlock();
        btn.textContent = `${label.replace(' →', '')} · через ${left} сек`;
        left--; setTimeout(tick, 1000);
      };
      tick();
    }

    btn.onclick = () => {
      TG.haptic('medium');
      State.markDone(i);
      if (last) { ov.hidden = true; TG.backButton(null); App.refresh(); Gift.open(); }
      else this.openLesson(i + 1);
    };
  },
};
