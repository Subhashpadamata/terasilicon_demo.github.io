/*
 * ============================================================
 * TERASILICON IQ — MAIN SCRIPT
 * ============================================================
 *
 * This file contains all front-end JavaScript in one place:
 *
 * 1. Mobile navigation
 * 2. Navbar active-page / active-section underline
 * 3. Formal Verification flow animation
 *
 * Keeping these features together makes the website easier
 * to read, debug, and maintain.
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  /*
   * ==========================================================
   * 1. MOBILE NAVIGATION
   * ==========================================================
   */

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-header nav");

  if (menuToggle && siteNav) {

    // Give the navigation an ID if it does not already have one.
    if (!siteNav.id) {
      siteNav.id = "primary-navigation";
    }

    menuToggle.setAttribute(
      "aria-controls",
      siteNav.id
    );

    /*
     * Close the mobile navigation.
     */
    const closeMobileMenu = () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    };

    /*
     * Open / close the mobile navigation button.
     */
    menuToggle.addEventListener("click", () => {

      const isOpen = siteNav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    /*
     * Close the mobile menu after selecting a page.
     */
    siteNav.querySelectorAll("a").forEach((link) => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );
    });

    /*
     * Close the menu when clicking outside it.
     */
    document.addEventListener("click", (event) => {

      const clickedInsideNav =
        siteNav.contains(event.target);

      const clickedToggle =
        menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMobileMenu();
      }
    });

    /*
     * Close the menu with the Escape key.
     */
    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    /*
     * Close mobile navigation when returning to desktop width.
     */
    window.addEventListener("resize", () => {

      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }


  /*
   * ==========================================================
   * 2. NAVBAR ACTIVE PAGE / ACTIVE SECTION
   * ==========================================================
   *
   * Adds the "active" class to the current navbar item.
   *
   * The CSS controls the actual underline animation.
   *
   * Example:
   *   <a class="active">Capabilities</a>
   *
   * Dedicated capability pages keep "Capabilities" active.
   * ==========================================================
   */

  const navigation = document.querySelector(
    ".site-header nav"
  );

  if (navigation) {

    const navigationLinks = Array.from(
      navigation.querySelectorAll(
        ":scope > a:not(.nav-cta), :scope > .nav-capabilities > .nav-capabilities-main > a:not(.nav-cta)"
      )
    );

    /*
     * Map individual capability pages back to
     * their main navbar section.
     */
    const pageAliases = {

      "formal-verification.html": "capabilities",

      "sta-timing-closure.html": "capabilities",

      "emir-power-integrity.html": "capabilities",

      "physical-design-signoff.html": "capabilities",

      "rtl-dv-dft.html": "capabilities",

      "physical-verification.html": "capabilities",

    };


    /*
     * Convert a URL/path into a simple filename.
     */
    const normalizePath = (value) => {

      if (!value) {
        return "";
      }

      return value
        .split("?")[0]
        .split("#")[0]
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        .toLowerCase();
    };


    /*
     * Remove the active state from every navbar item.
     */
    const clearActiveNavigation = () => {

      navigationLinks.forEach((link) => {

        link.classList.remove("active");

        link.removeAttribute(
          "aria-current"
        );
      });
    };


    /*
     * Mark one navbar item as active.
     */
    const activateNavigation = (link) => {

      if (!link) {
        return;
      }

      link.classList.add("active");

      link.setAttribute(
        "aria-current",
        "page"
      );
    };


    /*
     * Separate the path and #hash from a link.
     *
     * Example:
     *   hash = formal
     */
    const getLinkParts = (link) => {

      const href =
        link.getAttribute("href") || "";

      const hashIndex =
        href.indexOf("#");

      return {

        path: normalizePath(
          hashIndex >= 0
            ? href.slice(0, hashIndex)
            : href
        ),

        hash:
          hashIndex >= 0
            ? href.slice(hashIndex + 1)
            : ""
      };
    };


    /*
     * Find the current page filename.
     */
    const currentFile =
      normalizePath(window.location.pathname)
      || "index.html";


    const currentAlias =
      pageAliases[currentFile] || null;


    /*
     * ----------------------------------------------------------
     * Dedicated sub-pages
     * ----------------------------------------------------------
     *
     * Example:
     * formal-verification.html
     *
     * keeps "Capabilities" underlined.
     */
    const activateDedicatedPage = () => {

      if (!currentAlias) {
        return false;
      }

      const targetLink =
        navigationLinks.find((link) => {

          const parts =
            getLinkParts(link);

          return parts.hash === currentAlias;
        });

      if (targetLink) {

        clearActiveNavigation();

        activateNavigation(
          targetLink
        );

        return true;
      }

      return false;
    };


    /*
     * ----------------------------------------------------------
     * Homepage section detection
     * ----------------------------------------------------------
     *
     * Determines which section is currently visible.
     */
    const getSectionLinks = () => {

      return navigationLinks
        .map((link) => {

          const parts =
            getLinkParts(link);

          if (!parts.hash) {
            return null;
          }

          const section =
            document.getElementById(
              parts.hash
            );

          if (!section) {
            return null;
          }

          return {

            link: link,

            section: section,

            id: parts.hash
          };
        })
        .filter(Boolean);
    };


    /*
     * Update the active navbar item on the homepage.
     */
    const updateHomepageNavigation = (ignoreHash = false) => {

      const sectionLinks =
        getSectionLinks();

      if (!sectionLinks.length) {
        return;
      }


      /*
       * If the URL contains a hash,
       * use that section immediately.
       */
      const currentHash =
        window.location.hash.replace(
          "#",
          ""
        );


      if (!ignoreHash && currentHash) {

        const exactSection =
          sectionLinks.find(
            (item) =>
              item.id === currentHash
          );

        if (exactSection) {

          clearActiveNavigation();

          activateNavigation(
            exactSection.link
          );

          return;
        }
      }


      /*
       * Otherwise determine the section
       * from the current scroll position.
       */
      const header =
        document.querySelector(
          ".site-header"
        );


      const headerHeight =
        header
          ? header.getBoundingClientRect().height
          : 0;


      const scrollOffset =
        headerHeight + 100;


      const currentPosition =
        window.scrollY + scrollOffset;


      let currentSection =
        sectionLinks[0];


      sectionLinks.forEach((item) => {

        if (
          item.section.offsetTop
          <= currentPosition
        ) {

          currentSection = item;
        }
      });


      clearActiveNavigation();

      activateNavigation(
        currentSection.link
      );
    };


    /*
     * Decide whether the current page is:
     *
     * - a dedicated sub-page
     * - or the homepage.
     */
    const updateNavigation = (ignoreHash = false) => {

      if (
        currentFile !== "index.html"
        && currentFile !== ""
      ) {

        if (
          activateDedicatedPage()
        ) {
          return;
        }
      }

      updateHomepageNavigation(ignoreHash);
    };


    /*
     * Prevent excessive scroll calculations.
     */
    let navigationTicking = false;


    const requestNavigationUpdate = () => {

      if (navigationTicking) {
        return;
      }

      navigationTicking = true;


      window.requestAnimationFrame(() => {

        updateNavigation(true);

        navigationTicking = false;
      });
    };


    /*
     * Give immediate underline feedback after clicking.
     */
    navigationLinks.forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          const parts =
            getLinkParts(link);

          clearActiveNavigation();

          activateNavigation(link);


          /*
           * For homepage #sections,
           * let the browser perform the scroll,
           * then recalculate the active section.
           */
          if (
            parts.hash
            && document.getElementById(
              parts.hash
            )
          ) {

            window.setTimeout(
              () => updateHomepageNavigation(true),
              80
            );
          }
        }
      );
    });


    /*
     * Browser navigation events.
     */
    window.addEventListener(
      "hashchange",
      updateNavigation
    );

    window.addEventListener(
      "popstate",
      updateNavigation
    );


    /*
     * Update underline while scrolling.
     */
    window.addEventListener(
      "scroll",
      requestNavigationUpdate,
      { passive: true }
    );


    /*
     * Recalculate after resizing.
     */
    window.addEventListener(
      "resize",
      requestNavigationUpdate
    );


    /*
     * Set the correct active item on page load.
     */
    updateNavigation();
  }


  /*
   * ==========================================================
   * 3. FORMAL VERIFICATION FLOW ANIMATION
   * ==========================================================
   *
   * Flow:
   *
   * RTL
   *   ↓
   * SYNTHESIS
   *   ↓
   * FLOORPLAN
   *   ↓
   * PLACEMENT
   *   ↓
   * CTS
   *   ↓
   * ROUTING
   *   ↓
   * STA
   *   ↓
   * EMIR
   *   ↓
   * PHYSICAL VERIFICATION
   *   ↓
   * SIGNOFF
   *
   * Signoff remains the fixed terminal stage.
   * ==========================================================
   */

  const flowStages =
    document.querySelectorAll(
      ".flow-row > div"
    );


  const flowSection =
    document.querySelector(
      ".flow-section"
    );


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /*
   * Only start the animation if the required
   * flow elements exist on the current page.
   */
  if (
    flowStages.length
    && flowSection
  ) {

    let currentStage = 0;

    let animationTimer;


    /*
     * Update the visual state of every flow stage.
     */
    const updateFlow = () => {

      flowStages.forEach(
        (stage, index) => {

          /*
           * The Signoff block is the fixed
           * terminal endpoint.
           */
          const isSignoff =
            stage.classList.contains(
              "terminal"
            );


          /*
           * Completed implementation stages
           * remain active.
           */
          stage.classList.toggle(
            "flow-active",

            !isSignoff
            && index <= currentStage
          );
        }
      );


      /*
       * Move forward through the flow.
       *
       * The last non-terminal stage is
       * Physical Verification.
       */
      if (
        currentStage
        < flowStages.length - 2
      ) {

        currentStage += 1;

      } else {

        /*
         * Restart from RTL.
         */
        currentStage = 0;
      }
    };


    /*
     * Start / restart the flow animation.
     */
    const startFlow = () => {

      window.clearInterval(
        animationTimer
      );


      currentStage = 0;

      updateFlow();


      /*
       * Respect the user's reduced-motion
       * accessibility preference.
       */
      if (!reduceMotion) {

        animationTimer =
          window.setInterval(
            updateFlow,
            1000
          );
      }
    };


    /*
     * Stop the animation when the flow
     * is outside the viewport.
     */
    const stopFlow = () => {

      window.clearInterval(
        animationTimer
      );
    };


    /*
     * Only animate when the flow is visible.
     * This avoids running the animation
     * unnecessarily when the user is elsewhere
     * on the page.
     */
    if (
      "IntersectionObserver"
      in window
    ) {

      const flowObserver =
        new IntersectionObserver(
          (entries) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting
                ) {

                  startFlow();

                } else {

                  stopFlow();
                }
              }
            );
          },
          {
            threshold: 0.45
          }
        );


      flowObserver.observe(
        flowSection
      );

    } else {

      /*
       * Fallback for older browsers.
       */
      startFlow();
    }
  }


  /*
   * ==========================================================
   * END OF MAIN SCRIPT
   * ==========================================================
   */
});


/* ============================================================
 * FLOW STAGE CLICK / KEYBOARD NAVIGATION
 * ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const stages = document.querySelectorAll(".flow-row > div");
  const targets = [
    "#capabilities", "#signoff", "#capabilities", "#capabilities",
    "#signoff", "#signoff", "#signoff", "#signoff", "#capabilities", "#contact"
  ];

  stages.forEach((stage, index) => {
    const target = targets[index];
    if (!target || !document.querySelector(target)) return;

    stage.setAttribute("role", "link");
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("aria-label", `Go to ${target.replace("#", "")}`);

    const go = () => {
      document.querySelector(target)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };

    stage.addEventListener("click", go);
    stage.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });

  /*
   * ==========================================================
   * 4. FORMAL VERIFICATION — INTERACTIVE BACKGROUND
   * ==========================================================
   * Keeps the page visually connected to the main site while
   * adding a restrained pointer-responsive technical grid.
   */
  const formalPage = document.querySelector(".formal-verification-page");
  const formalBackground = document.querySelector(".fv-background");

  if (formalPage && formalBackground && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let rafId = 0;

    const updateFormalBackground = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 70;
      const y = (event.clientY / window.innerHeight - 0.5) * 55;

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        formalPage.style.setProperty("--fv-mx", `${x}px`);
        formalPage.style.setProperty("--fv-my", `${y}px`);
      });
    };

    window.addEventListener("pointermove", updateFormalBackground, { passive: true });

    window.addEventListener("pointerleave", () => {
      formalPage.style.setProperty("--fv-mx", "0px");
      formalPage.style.setProperty("--fv-my", "0px");
    });
  }


  /*
   * ==========================================================
   * 3. CAPABILITIES SUB-PAGE DROPDOWN
   * ==========================================================
   */
  const capabilitiesMenu = document.querySelector(".nav-capabilities");
  const capabilitiesToggle = document.querySelector(".capabilities-toggle");

  if (capabilitiesMenu && capabilitiesToggle) {
    capabilitiesToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = capabilitiesMenu.classList.toggle("open");
      capabilitiesToggle.setAttribute("aria-expanded", String(isOpen));
    });

    capabilitiesMenu.querySelectorAll(".capabilities-dropdown a").forEach((link) => {
      link.addEventListener("click", () => {
        capabilitiesMenu.classList.remove("open");
        capabilitiesToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!capabilitiesMenu.contains(event.target)) {
        capabilitiesMenu.classList.remove("open");
        capabilitiesToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        capabilitiesMenu.classList.remove("open");
        capabilitiesToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

});
