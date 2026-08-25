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
const sectionIds = ["home", "vlsi-finishing-school", "tracks", "environment", "contact-details"];
const sectionElements = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActiveNav(targetId) {
  document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isSectionLink = href === `#${targetId}` || href === `index.html#${targetId}`;
    link.classList.toggle('active', isSectionLink);
    if (isSectionLink) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/* The Contact section is short and sits at the very bottom of the page, so
   with the -62% bottom rootMargin below it can end the scroll without ever
   being counted as "intersecting" by the observer. Treat reaching the
   bottom of the page as being in the Contact section as a fallback. */
function isNearBottomOfPage() {
  const scrollBottom = window.scrollY + window.innerHeight;
  return scrollBottom >= document.documentElement.scrollHeight - 4;
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      if (isNearBottomOfPage() && document.getElementById("contact-details")) {
        setActiveNav("contact-details");
        return;
      }

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      setActiveNav(visible[0].target.id);
    },
    {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0.05, 0.15, 0.3, 0.6]
    }
  );

  sectionElements.forEach((section) => sectionObserver.observe(section));

  window.addEventListener(
    "scroll",
    () => {
      if (isNearBottomOfPage() && document.getElementById("contact-details")) {
        setActiveNav("contact-details");
      }
    },
    { passive: true }
  );
}

/* Support direct links such as index.html#tracks. */
window.addEventListener("load", () => {
  const targetId = window.location.hash.substring(1);

  if (targetId && document.getElementById(targetId)) {
    setActiveNav(targetId);
    setTimeout(() => {
      scrollToTarget(targetId);
    }, 80);
  } else {
    setActiveNav("home");
  }
});
