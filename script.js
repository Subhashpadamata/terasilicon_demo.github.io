const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

/* =========================================================
   MOBILE MENU
   ========================================================= */

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});


/* =========================================================
   NAVIGATION
   - No arrows
   - Active line stays after clicking
   - Only one navigation item active at a time
   ========================================================= */

const navItems = document.querySelectorAll(
  '.nav > a:not(.nav-cta), .nav-dropdown'
);

navItems.forEach(item => {

  const clickable = item.matches('.nav-dropdown')
    ? item.querySelector('.nav-dropdown-toggle')
    : item;

  clickable?.addEventListener('click', () => {

    // Remove active state from all navigation items
    navItems.forEach(navItem => {
      navItem.classList.remove('active');
    });

    // Add active state to selected item
    item.classList.add('active');

    // Close mobile navigation
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });

});


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING A NORMAL LINK
   ========================================================= */

document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});


/* =========================================================
   CLOSE DROPDOWN WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener('click', event => {

  if (!nav?.contains(event.target)) {
    navItems.forEach(item => {
      item.classList.remove('active');
    });
  }

});


/* =========================================================
   TERASILICON IQ ORBIT SYSTEM
   ========================================================= */

const logoTarget = document.querySelector('.solutions-visual p');

if (logoTarget) {
  logoTarget.outerHTML = `
    <div
      class="orbit-system"
      aria-label="Terasilicon IQ engineering roles"
    >

      <div class="orbit-core">
        <img
          src="assets/terasilicon-iq-logo-lockup.png"
          alt="Terasilicon IQ"
        >
      </div>

      <div class="role-orbit orbit-rtl">
        <button
          class="role-node"
          type="button"
          aria-label="RTL Design"
        >
          <b>01</b>
          <span>RTL Design</span>
        </button>
      </div>

      <div class="role-orbit orbit-dv">
        <button
          class="role-node"
          type="button"
          aria-label="Design Verification"
        >
          <b>02</b>
          <span>Design Verification</span>
        </button>
      </div>

      <div class="role-orbit orbit-dft">
        <button
          class="role-node"
          type="button"
          aria-label="Design for Test"
        >
          <b>03</b>
          <span>DFT</span>
        </button>
      </div>

      <div class="role-orbit orbit-pd">
        <button
          class="role-node"
          type="button"
          aria-label="Physical Design"
        >
          <b>04</b>
          <span>Physical Design</span>
        </button>
      </div>

    </div>
  `;
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealTargets = document.querySelectorAll(
  '.statement,' +
  '.metrics,' +
  '.service-card,' +
  '.industries-heading,' +
  '.industry-grid,' +
  '.solutions-copy,' +
  '.article-grid,' +
  '.contact'
);

revealTargets.forEach(item => {
  item.classList.add('reveal-on-scroll');
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }

    });
  },
  {
    threshold: 0.12
  }
);

revealTargets.forEach(item => {
  observer.observe(item);
});


/* =========================================================
   METRIC COUNTERS
   ========================================================= */

const metricObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {
        return;
      }

      entry.target
        .querySelectorAll('[data-count]')
        .forEach(counter => {

          const target = Number(counter.dataset.count);
          const duration = 900;
          const started = performance.now();

          const tick = now => {

            const progress = Math.min(
              (now - started) / duration,
              1
            );

            const value = Math.round(
              target * (1 - Math.pow(1 - progress, 3))
            );

            counter.firstChild.nodeValue = value;

            if (progress < 1) {
              requestAnimationFrame(tick);
            }

          };

          requestAnimationFrame(tick);

        });

      metricObserver.unobserve(entry.target);

    });

  },
  {
    threshold: 0.5
  }
);

const metrics = document.querySelector('.metrics');

if (metrics) {
  metricObserver.observe(metrics);
}

/* =========================================================
   NAVIGATION — DROPDOWN + SECTION NAVIGATION
   ========================================================= */

const navDropdownTargets = {
  Services: '#expertise',
  Solutions: '#solutions',
  Domains: '#industries',
  Insights: '#insights',
  Company: '#about'
};

document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const button = dropdown.querySelector('.nav-dropdown-toggle');

  if (!button) return;

  const label = button.textContent.trim();

  button.addEventListener('click', () => {

    const target = navDropdownTargets[label];

    if (!target) return;

    const section = document.querySelector(target);

    if (!section) return;

    /* Active navigation item */
    document.querySelectorAll('.nav-dropdown, .nav > a').forEach(item => {
      item.classList.remove('active');
    });

    dropdown.classList.add('active');

    /* Smooth scroll */
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    /* Update URL */
    history.pushState(null, '', target);

    /* Close mobile menu */
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');

    /* Remove focus so dropdown doesn't stay open */
    button.blur();
  });
});