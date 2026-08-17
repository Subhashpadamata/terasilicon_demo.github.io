const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
const navItems = document.querySelectorAll('.site-header nav > a:not(.nav-cta), .nav-dropdown');
const dropdowns = document.querySelectorAll('.nav-dropdown');

const closeDropdowns = () => {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
    dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
  });
};

const closeMobileMenu = () => {
  nav?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
};

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  toggle.setAttribute('aria-expanded', String(open));
  if (!open) closeDropdowns();
});

dropdowns.forEach(dropdown => {
  const button = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');
  if (!button || !menu) return;

  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');

  button.addEventListener('click', () => {
    const willOpen = !dropdown.classList.contains('active');
    closeDropdowns();
    if (willOpen) {
      dropdown.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

document.querySelectorAll('.site-header nav > a').forEach(link => {
  link.addEventListener('click', () => {
    navItems.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    closeDropdowns();
    closeMobileMenu();
  });
});

document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    closeDropdowns();
    closeMobileMenu();
  });
});

document.addEventListener('click', event => {
  if (!nav?.contains(event.target) && !toggle?.contains(event.target)) closeDropdowns();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeDropdowns();
    closeMobileMenu();
  }
});

const logoTarget = document.querySelector('.solutions-visual p');

if (logoTarget) {
  logoTarget.outerHTML = `
    <div class="orbit-system" aria-label="Terasilicon IQ engineering roles">
      <div class="orbit-core"><img src="assets/terasilicon-iq-logo-lockup.png" alt="Terasilicon IQ"></div>
      <div class="role-orbit orbit-rtl"><button class="role-node" type="button" aria-label="RTL Design"><b>01</b><span>RTL Design</span></button></div>
      <div class="role-orbit orbit-dv"><button class="role-node" type="button" aria-label="Design Verification"><b>02</b><span>Design Verification</span></button></div>
      <div class="role-orbit orbit-dft"><button class="role-node" type="button" aria-label="Design for Test"><b>03</b><span>DFT</span></button></div>
      <div class="role-orbit orbit-pd"><button class="role-node" type="button" aria-label="Physical Design"><b>04</b><span>Physical Design</span></button></div>
    </div>
  `;
}

const revealTargets = document.querySelectorAll(
  '.statement, .metrics, .service-card, .industries-heading, .industry-grid, .solutions-copy, .article-grid, .contact'
);

revealTargets.forEach(item => item.classList.add('reveal-on-scroll'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(item => observer.observe(item));
} else {
  revealTargets.forEach(item => item.classList.add('is-visible'));
}

const metrics = document.querySelector('.metrics');

const startCounters = container => {
  container.querySelectorAll('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count);
    const started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / 900, 1);
      counter.firstChild.nodeValue = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

if (metrics) {
  if ('IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounters(entry.target);
          metricObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    metricObserver.observe(metrics);
  } else {
    startCounters(metrics);
  }
}

const flowNodes = document.querySelectorAll('.signoff-flow__node');

if (flowNodes.length) {
  let activeFlowNode = 0;
  const animateFlow = () => {
    flowNodes.forEach((node, index) => {
      node.classList.toggle('signoff-flow__node--active', index <= activeFlowNode);
    });
    activeFlowNode = (activeFlowNode + 1) % flowNodes.length;
  };

  animateFlow();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(animateFlow, 750);
  }
}
