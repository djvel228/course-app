// Запуск вариантов: каждый проигрывается сразу и повторяется каждые 4.5 сек.
document.querySelectorAll('.card').forEach((card) => {
  const stage = card.querySelector('.stage');
  const run = window.VARIANTS[card.dataset.variant];
  let timer;
  const play = () => {
    clearInterval(timer);
    run(stage);
    timer = setInterval(() => run(stage), 4500);
  };
  card.querySelector('.replay').onclick = play;
  play();
});
