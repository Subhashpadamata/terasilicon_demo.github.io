/*
 * Terasilicon IQ — navbar active-page + active-section controller.
 * Works with the existing .site-header nav markup.
 */
(() => {
  const nav = document.querySelector('.site-header nav');
  if (!nav) return;

  const links = Array.from(
    nav.querySelectorAll('a:not(.nav-cta)')
  );

  if (!links.length) return;

  const pageAliases = {
    "formal-verification.html": "capabilities",
    "sta-timing-closure.html": "capabilities",
    "emir-power-integrity.html": "capabilities",
    "physical-design-signoff.html": "capabilities",
    "rtl-dv-dft.html": "capabilities",
    "physical-verification.html": "capabilities",
    "signoff.html": "signoff",
    "solutions.html": "solutions",
    "about.html": "about",
    "capabilities.html": "capabilities"
  };

  const normalize = (value) => {
    if (!value) return "";
    return value
      .split("?")[0]
      .split("#")[0]
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      .toLowerCase();
  };

  const clearActive = () => {
    links.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
  };

  const activate = (link) => {
    if (!link) return;
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  };

  const getHrefParts = (link) => {
    const href = link.getAttribute("href") || "";
    const hashIndex = href.indexOf("#");

    return {
      path: normalize(hashIndex >= 0 ? href.slice(0, hashIndex) : href),
      hash: hashIndex >= 0 ? href.slice(hashIndex + 1) : ""
    };
  };

  const currentFile = normalize(window.location.pathname) || "index.html";
  const currentAlias = pageAliases[currentFile] || null;

  /*
   * Dedicated sub-pages:
   * keep Capabilities active because those pages are reached
   * from the Capabilities section.
   */
  const activateForDedicatedPage = () => {
    if (!currentAlias) return false;

    const targetLink = links.find((link) => {
      const parts = getHrefParts(link);
      return parts.hash === currentAlias;
    });

    if (targetLink) {
      activate(targetLink);
      return true;
    }

    return false;
  };

  /*
   * One-page homepage:
   * determine the active section from the current hash first,
   * then from scroll position.
   */
  const getSectionLinks = () => {
    return links
      .map((link) => {
        const parts = getHrefParts(link);
        if (!parts.hash) return null;

        const section = document.getElementById(parts.hash);
        if (!section) return null;

        return { link, section, id: parts.hash };
      })
      .filter(Boolean);
  };

  const updateHomeActive = () => {
    const sectionLinks = getSectionLinks();
    if (!sectionLinks.length) return;

    const hash = window.location.hash.replace("#", "");

    if (hash) {
      const exact = sectionLinks.find((item) => item.id === hash);
      if (exact) {
        clearActive();
        activate(exact.link);
        return;
      }
    }

    const header = document.querySelector(".site-header");
    const offset = (header?.getBoundingClientRect().height || 0) + 100;
    const position = window.scrollY + offset;

    let current = sectionLinks[0];

    for (const item of sectionLinks) {
      if (item.section.offsetTop <= position) {
        current = item;
      }
    }

    clearActive();
    activate(current.link);
  };

  const updateActive = () => {
    if (currentFile !== "index.html" && currentFile !== "") {
      if (activateForDedicatedPage()) return;
    }

    updateHomeActive();
  };

  let ticking = false;

  const requestUpdate = () => {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });

    ticking = true;
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const parts = getHrefParts(link);

      /*
       * Give the click immediate feedback.
       * The scroll/hash logic will keep it active afterwards.
       */
      clearActive();
      activate(link);

      if (parts.hash && document.getElementById(parts.hash)) {
        window.setTimeout(updateHomeActive, 50);
      }
    });
  });

  window.addEventListener("hashchange", updateActive);
  window.addEventListener("popstate", updateActive);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  updateActive();
})();
