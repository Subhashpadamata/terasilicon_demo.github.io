/* ==========================================================
   TSIQ DEEP TECH LAB
   Header and page interaction
   ========================================================== */

const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

const navLinks = [
  ...document.querySelectorAll('.desktop-nav a[href^="#"]'),
  ...document.querySelectorAll('.mobile-menu a[href^="#"]')
];

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  mobileMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "Menu";
}

function openMobileMenu() {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  mobileMenu.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.textContent = "Close";
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const headerHeight = header ? header.offsetHeight : 0;
  const targetTop =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth"
  });
}

function handleAnchorClick(event) {
  const href = event.currentTarget.getAttribute("href");

  if (!href || !href.startsWith("#")) {
    return;
  }

  const targetId = href.substring(1);

  if (!document.getElementById(targetId)) {
    return;
  }

  event.preventDefault();
  history.replaceState(null, "", href);
  scrollToTarget(targetId);
  closeMobileMenu();
}

navLinks.forEach((link) => {
  link.addEventListener("click", handleAnchorClick);
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

document.addEventListener("click", (event) => {
  if (window.innerWidth > 820 || !mobileMenu?.classList.contains("open")) {
    return;
  }

  if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMobileMenu();
  }
});

/* Highlight the header link for the section currently in view. */
const sectionIds = ["home", "program", "tracks", "environment"];
const sectionElements = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) {
        return;
      }

      const activeId = visible[0].target.id;

      document.querySelectorAll('.desktop-nav a[href^="#"]').forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${activeId}`
        );
      });
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: [0.1, 0.3, 0.6]
    }
  );

  sectionElements.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* Support direct links such as index.html#tracks. */
window.addEventListener("load", () => {
  const targetId = window.location.hash.substring(1);

  if (targetId && document.getElementById(targetId)) {
    setTimeout(() => {
      scrollToTarget(targetId);
    }, 80);
  }
});

/* V10.24 — draw hero connectors from the TSIQ circle edge to each box edge.
   Geometry is calculated from the actual rendered boxes, so links never enter
   the circle or cross one another. */
(function initHeroConnectors() {
  const stage = document.querySelector('.chip-stage');
  const core = document.querySelector('.chip-core');
  const svg = document.querySelector('.chip-connectors');
  const nodes = [...document.querySelectorAll('.chip-stage .chip-chip')];

  if (!stage || !core || !svg || !nodes.length) return;

  const colors = ['orange','purple','purple','orange','purple','orange','purple','orange'];

  function draw() {
    const sr = stage.getBoundingClientRect();
    const cr = core.getBoundingClientRect();
    const cx = cr.left - sr.left + cr.width / 2;
    const cy = cr.top - sr.top + cr.height / 2;
    const radius = Math.min(cr.width, cr.height) / 2 + 3;

    svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    svg.setAttribute('width', sr.width);
    svg.setAttribute('height', sr.height);
    svg.replaceChildren();

    nodes.forEach((node, index) => {
      const nr = node.getBoundingClientRect();
      const nx = nr.left - sr.left + nr.width / 2;
      const ny = nr.top - sr.top + nr.height / 2;
      const vx = nx - cx;
      const vy = ny - cy;
      const length = Math.hypot(vx, vy) || 1;
      const ux = vx / length;
      const uy = vy / length;

      // Start just outside the TSIQ circle.
      const x1 = cx + ux * radius;
      const y1 = cy + uy * radius;

      // End exactly at the near edge of the label rectangle.
      const halfW = nr.width / 2;
      const halfH = nr.height / 2;
      const tx = halfW / Math.max(Math.abs(ux), 0.0001);
      const ty = halfH / Math.max(Math.abs(uy), 0.0001);
      const edgeDistance = Math.min(tx, ty) + 2;
      const x2 = nx - ux * edgeDistance;
      const y2 = ny - uy * edgeDistance;
      const lineLength = Math.hypot(x2 - x1, y2 - y1);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.classList.add(colors[index] || 'purple');
      line.style.setProperty('--line-length', `${lineLength.toFixed(1)}`);
      line.style.setProperty('--line-delay', `${0.18 + index * 0.07}s`);
      svg.appendChild(line);
    });
  }

  let resizeTimer;
  function scheduleDraw() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 40);
  }

  // Wait until the entrance transforms have settled, then keep geometry stable.
  window.addEventListener('load', () => setTimeout(draw, 1100));
  window.addEventListener('resize', scheduleDraw);
  window.addEventListener('orientationchange', scheduleDraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleDraw);
  setTimeout(draw, 1250);
})();
