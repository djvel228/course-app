// Точка входа: загрузка → приветствие (первый раз) → вкладки.
(function () {
  const tabs = { course: window.Course, base: window.Base, cabinet: window.Cabinet };
  let current = 'course';

  function showTab(name) {
    current = name;
    document.querySelectorAll('.tab').forEach((t) => { t.hidden = t.id !== `tab-${name}`; });
    document.querySelectorAll('.tabbar button').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.tab === name);
    });
    tabs[name].render(document.getElementById(`tab-${name}`));
    window.scrollTo(0, 0);
  }

  function startApp() {
    document.getElementById('app').hidden = false;
    document.getElementById('tabbar').hidden = false;
    showTab(current);
  }

  // Доступно из других модулей: переключить вкладку, перерисовать текущую
  window.App = {
    showTab,
    refresh: () => showTab(current),
  };

  document.querySelectorAll('.tabbar button').forEach((b) => {
    b.onclick = () => { TG.haptic('light'); showTab(b.dataset.tab); };
  });

  // ?reset=1 в адресе – сбросить прогресс (для теста)
  if (new URLSearchParams(location.search).get('reset') === '1') {
    localStorage.clear();
    history.replaceState(null, '', location.pathname);
  }

  TG.init();
  Splash.run(() => {
    if (State.get().welcomed) {
      startApp();
    } else {
      Splash.showWelcome(() => { startApp(); Course.openLesson(0); });
    }
  });
})();
