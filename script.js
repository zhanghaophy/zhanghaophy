(() => {
  const root = document.documentElement;
  const languageButtons = document.querySelectorAll('[data-language]');
  const translatedElements = document.querySelectorAll('[data-en][data-zh]');
  const navigationLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('[data-page-section]');

  function setLanguage(language) {
    const nextLanguage = language === 'zh' ? 'zh' : 'en';
    root.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en';
    document.title = nextLanguage === 'zh' ? '张昊 | 个人主页' : 'Hao Y. Zhang | Personal Homepage';

    translatedElements.forEach((element) => {
      element.textContent = element.dataset[nextLanguage];
    });

    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === nextLanguage));
    });

    try {
      window.localStorage.setItem('preferred-language', nextLanguage);
    } catch (_) {
      // Language preference is optional when storage is unavailable.
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navigationLinks.forEach((item) => item.classList.toggle('active', item === link));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === visible.target.id);
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });

  sections.forEach((section) => observer.observe(section));

  let savedLanguage;
  try {
    savedLanguage = window.localStorage.getItem('preferred-language');
  } catch (_) {
    savedLanguage = null;
  }
  const browserLanguage = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  setLanguage(savedLanguage || browserLanguage);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
