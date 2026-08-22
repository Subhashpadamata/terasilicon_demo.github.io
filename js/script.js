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
