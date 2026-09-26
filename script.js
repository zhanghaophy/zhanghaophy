(() => {
  const root = document.documentElement;
  const languageButtons = document.querySelectorAll('[data-language]');
  const translatedElements = document.querySelectorAll('[data-en][data-zh]');
  const navigationLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('[data-page-section]');

  function setLanguage(language) {
    const nextLanguage = language === 'zh' ? 'zh' : 'en';
    root.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en';
    document.title = document.body.dataset[nextLanguage === 'zh' ? 'titleZh' : 'titleEn']
      || (nextLanguage === 'zh' ? '张昊 | 个人主页' : 'Hao Y. Zhang | Personal Homepage');

    translatedElements.forEach((element) => {
      element.textContent = element.dataset[nextLanguage];
    });

    document.querySelectorAll('[data-alt-en][data-alt-zh]').forEach((element) => {
      element.alt = element.dataset[nextLanguage === 'zh' ? 'altZh' : 'altEn'];
    });
    document.querySelectorAll('[data-aria-en][data-aria-zh]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[nextLanguage === 'zh' ? 'ariaZh' : 'ariaEn']);
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

  const portraits = Array.from(document.querySelectorAll('[data-portrait]'));
  const slideshowToggle = document.querySelector('[data-slideshow-toggle]');
  if (portraits.length > 1 && slideshowToggle) {
    let currentPortrait = 0;
    let paused = false;
    slideshowToggle.hidden = false;
    window.setInterval(() => {
      if (paused || document.hidden) return;
      portraits[currentPortrait].hidden = true;
      currentPortrait = (currentPortrait + 1) % portraits.length;
      portraits[currentPortrait].hidden = false;
    }, 10000);
    slideshowToggle.addEventListener('click', () => {
      paused = !paused;
      slideshowToggle.setAttribute('aria-pressed', String(paused));
      slideshowToggle.dataset.en = paused ? 'Play photos' : 'Pause photos';
      slideshowToggle.dataset.zh = paused ? '继续轮播' : '暂停轮播';
      slideshowToggle.textContent = slideshowToggle.dataset[root.lang === 'zh-CN' ? 'zh' : 'en'];
    });
  }
})();
