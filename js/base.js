// Вкладка «База»: дашборд, статьи по разделам, полезные материалы.
// Закрыта, пока не пройден курс.
window.Base = {
  tag: 'Все',
  section: 'articles', // articles | materials

  render(el) {
    if (!State.courseDone()) return this.renderLocked(el);
    const A = window.ARTICLES;
    const M = CONFIG.materials;
    const read = State.get().read || [];

    el.innerHTML = `
      <section class="kb-hero">
        <div class="kb-hero__shine"></div>
        <div class="kb-hero__top">
          <img src="img/avatar.jpg" alt="">
          <span class="kb-hero__badge">Подарок за курс</span>
        </div>
        <h1>База знаний<br><span class="gold-text">OnlyFans-агентства</span></h1>
        <p>Мой опыт без воды: трафик, продажи, управление командой</p>
        <div class="kb-stats">
          <div><b>${A.length}</b><span>статей</span></div>
          <div><b>${M.length}</b><span>материалов</span></div>
          <div><b>${read.length}</b><span>прочитано</span></div>
        </div>
      </section>

      <div class="segment">
        <button data-sec="articles" class="${this.section === 'articles' ? 'is-active' : ''}">Статьи</button>
        <button data-sec="materials" class="${this.section === 'materials' ? 'is-active' : ''}">Материалы</button>
      </div>

      <div id="kbList">${this.section === 'articles' ? this.articlesHtml(A, read) : this.materialsHtml(M)}</div>
    `;

    el.querySelectorAll('[data-sec]').forEach((b) => {
      b.onclick = () => { this.section = b.dataset.sec; TG.haptic('light'); this.render(el); };
    });
    el.querySelectorAll('[data-tag]').forEach((b) => {
      b.onclick = () => { this.tag = b.dataset.tag; TG.haptic('light'); this.render(el); };
    });
    el.querySelectorAll('[data-article]').forEach((b) => {
      b.onclick = () => Reader.open(b.dataset.article);
    });
    el.querySelectorAll('[data-material]').forEach((b) => {
      b.onclick = () => this.openMaterial(M[+b.dataset.material]);
    });
  },

  articlesHtml(A, read) {
    const list = A.filter((a) => this.tag === 'Все' || a.tag === this.tag);
    return `
      <div class="chips">
        ${CONFIG.tags.map((t) => `<button class="chip ${t === this.tag ? 'is-active' : ''}" data-tag="${t}">${t}</button>`).join('')}
      </div>
      <div class="articles">
        ${list.length ? list.map((a) => `
          <button class="card article" data-article="${a.id}">
            ${a.images.length
              ? `<span class="article__cover" style="background-image:url('${a.images[0]}')"></span>`
              : `<span class="article__cover article__cover--empty"><span class="gold-text">${a.tag}</span></span>`}
            <span class="article__body">
              <span class="article__meta"><span class="article__tag">${a.tag}</span> · ${a.minutes} мин${read.includes(a.id) ? ' · <span class="article__read">прочитано ✓</span>' : ''}</span>
              <b>${a.title}</b>
            </span>
          </button>`).join('') : '<p class="muted empty">В этом разделе статьи скоро появятся</p>'}
      </div>`;
  },

  materialsHtml(M) {
    return `
      <div class="materials">
        ${M.map((m, i) => `
          <button class="card material" data-material="${i}">
            <span class="material__type material__type--${m.type.toLowerCase()}">${m.type}</span>
            <span class="material__body"><b>${m.title}</b><span class="muted small">${m.sub}</span></span>
            <span class="material__get">${m.file ? 'Открыть' : 'Скоро'}</span>
          </button>`).join('')}
      </div>`;
  },

  openMaterial(m) {
    TG.haptic('light');
    if (m.file) return TG.openLink(new URL(m.file, location.href).href);
    const msg = 'Этот материал скоро появится в базе';
    if (TG.inTelegram) Telegram.WebApp.showAlert(msg); else alert(msg);
  },

  renderLocked(el) {
    const done = State.get().done.length;
    const total = CONFIG.lessons.length;
    el.innerHTML = `
      <div class="locked">
        <div class="locked__icon">🔒</div>
        <h1>База знаний</h1>
        <p class="muted">${window.ARTICLES.length} статей и ${CONFIG.materials.length} полезных материалов откроются в подарок, когда ты пройдёшь базовый курс</p>
        <div class="card progress">
          <div class="progress__row"><span>Пройдено</span><b>${done} из ${total}</b></div>
          <div class="progress__bar"><span style="width:${Math.round(done / total * 100)}%"></span></div>
        </div>
        <button class="btn" id="goCourse">Продолжить курс</button>
      </div>`;
    el.querySelector('#goCourse').onclick = () => App.showTab('course');
  },
};
