/*
 * Terasilicon IQ — navigation active-section tracking
 */
(() => {
  const nav = document.querySelector('.site-header nav');
  if (!nav) return;

  const links = Array.from(
    nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')
  );

  const sections = links
    .map((link) => {
      const id = link.getAttribute('href');
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const getHeaderOffset = () => {
    const header = document.querySelector('.site-header');
    return header ? header.getBoundingClientRect().height : 0;
  };

  let ticking = false;

  const updateActiveSection = () => {
    const offset = getHeaderOffset() + 90;
    const scrollPosition = window.scrollY + offset;

    let current = sections[0];

    for (const section of sections) {
      if (section.offsetTop <= scrollPosition) {
        current = section;
      }
    }

    if (current) {
      setActive(current.id);
    }

    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveSection);
      ticking = true;
    }
  };

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('href');
      if (target) setActive(target.slice(1));
    });
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  updateActiveSection();
})();
