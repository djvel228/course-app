// Общие контуры логотипа OF (координаты исходной картинки 640x640)
window.LOGO = {
  O: 'M95 330 a150 150 0 1 0 300 0 a150 150 0 1 0 -300 0 Z M200 330 a45 45 0 1 0 90 0 a45 45 0 1 0 -90 0 Z',
  W: 'M245 480 L318 258 C328 225 345 200 378 192 C430 180 490 178 545 180 C535 230 490 282 416 292 C445 296 475 296 497 292 C485 345 440 385 382 390 A150 150 0 0 1 245 480 Z',
  viewBox: '70 80 500 500',
  // Градиенты золота: p – префикс id, чтобы на странице не было повторов
  defs(p) {
    return `
      <linearGradient id="${p}o" x1="0" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="#F6D896"/><stop offset=".5" stop-color="#D4A24E"/><stop offset="1" stop-color="#94662A"/>
      </linearGradient>
      <linearGradient id="${p}w" x1="0" y1="0" x2=".4" y2="1">
        <stop offset="0" stop-color="#FFF4D2"/><stop offset=".45" stop-color="#F5D688"/><stop offset="1" stop-color="#DDB063"/>
      </linearGradient>
      <linearGradient id="${p}s" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="${p}clip"><path d="${this.O}" clip-rule="evenodd"/><path d="${this.W}"/></clipPath>`;
  },
  // Сплошной логотип (без анимаций)
  solid(p) {
    return `<path d="${this.O}" fill-rule="evenodd" fill="url(#${p}o)"/>
            <path d="${this.W}" fill="url(#${p}w)" filter="url(#${p}sh)"/>`;
  },
  shadowFilter(p) {
    return `<filter id="${p}sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="-10" dy="4" stdDeviation="9" flood-color="#000" flood-opacity=".5"/></filter>`;
  },
};
