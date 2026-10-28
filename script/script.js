"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const copyrightYear = document.querySelector("#copyright-year");

  if (copyrightYear) {
    copyrightYear.textContent = String(new Date().getFullYear());
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu",
      );
      navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  const tabList = document.querySelector("[role='tablist']");
  const tabs = tabList ? Array.from(tabList.querySelectorAll("[role='tab']")) : [];
  const panels = Array.from(document.querySelectorAll("[role='tabpanel']"));

  const activateTab = (tab, shouldFocus = false) => {
    const panelId = tab.getAttribute("aria-controls");

    tabs.forEach((item) => {
      const isSelected = item === tab;
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isSelected = panel.id === panelId;
      panel.hidden = !isSelected;
    });

    if (shouldFocus) {
      tab.focus();
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);
      let nextIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      }
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (!reducedMotion && "IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.body.classList.add("js-reveal-ready");
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const heroImage = document.querySelector(".hero-image");

  if (heroImage && !reducedMotion) {
    let animationFrame = 0;

    const updateHeroParallax = () => {
      const offset = Math.min(window.scrollY * 0.12, 42);
      heroImage.style.setProperty("--hero-parallax", `${offset}px`);
      animationFrame = 0;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (animationFrame === 0) {
          animationFrame = window.requestAnimationFrame(updateHeroParallax);
        }
      },
      { passive: true },
    );
  }
});