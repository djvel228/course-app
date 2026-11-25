// Экран чтения статьи внутри апки.
window.Reader = {
  open(id) {
    const A = window.ARTICLES;
    const i = A.findIndex((a) => a.id === id);
    const a = A[i];
    const next = A[(i + 1) % A.length];
    const ov = document.getElementById('overlay');
    State.markRead(a.id);

    // Первая картинка – обложка, остальные встают в середину текста
    const [cover, ...rest] = a.images;
    const mid = Math.ceil(a.body.length / 2);
    const body = a.body.map((p, k) =>
      `<p>${p}</p>` + (k === mid - 1 ? rest.map((src) => `<img class="reader__img" src="${src}" alt="">`).join('') : '')
    ).join('');

    ov.innerHTML = `
      <article class="reader">
        <div class="lesson-view__top">
          <button class="back" id="rdBack">‹ База</button>
          <span class="muted small">${a.minutes} мин чтения</span>
        </div>
        ${cover ? `<img class="reader__cover" src="${cover}" alt="">` : ''}
        <div class="reader__tag gold-text">${a.tag}</div>
        <h1 class="reader__title">${a.title}</h1>
        <div class="reader__author">
          <img src="img/avatar.jpg?v=2" alt=""><span><b>Валерий</b><span class="muted small">OnlyFans-агентство</span></span>
        </div>
        <div class="reader__body">${body}</div>

        ${next.id !== a.id ? `
        <div class="section-label">Читать дальше</div>
        <button class="card article" id="rdNext">
          <span class="article__body">
            <span class="article__meta"><span class="article__tag">${next.tag}</span> · ${next.minutes} мин</span>
            <b>${next.title}</b>
          </span>
        </button>` : ''}
        <button class="link-btn muted small" id="rdSource">Открыть пост в канале</button>
      </article>`;
    ov.hidden = false;
    ov.scrollTop = 0;

    const close = () => { ov.hidden = true; ov.innerHTML = ''; TG.backButton(null); App.refresh(); };
    TG.backButton(close);
    document.getElementById('rdBack').onclick = close;
    document.getElementById('rdSource').onclick = () => TG.openTgLink(a.url);
    const n = document.getElementById('rdNext');
    if (n) n.onclick = () => { TG.haptic('light'); Reader.open(next.id); };

    // Ссылки внутри текста открываем средствами Telegram, а не внутри апки
    ov.querySelectorAll('.reader__body a').forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        if (/^https?:\/\/t\.me\//.test(url)) TG.openTgLink(url); else TG.openLink(url);
      };
    });
  },
};
