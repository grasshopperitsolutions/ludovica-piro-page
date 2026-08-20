import "./style.css";
import strings from "./i18n/en.js";
import { contact, projects, competitions, comingSoon, stories } from "./data.js";
import profilePic from "./assets/profile-pic.jpeg";
import munariPic from "./assets/munari.jpg";
import {
  parsePath,
  buildPath,
  hrefFor,
  routeMeta,
  renderChrome,
  renderPage,
  renderFooter,
  splitWords,
} from "./render.js";

const SITE_ORIGIN = "https://ludovicapiro.com";
// Vite always resolves this to the configured `base`, trailing slash
// included (e.g. "/" at the eventual domain root, or
// "/ludovica-piro-page/" while staged as an org-domain subpath) — every
// in-page link has to carry this prefix or it 404s once deployed.
const BASE = import.meta.env.BASE_URL;

const state = {
  theme: localStorage.getItem("lp-theme") || "auto",
  navOpen: false,
  route: parsePath(window.location.pathname, BASE),
};

function reduceMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Cross-page morph where supported (Chrome/Edge/Safari 18+); everywhere else
// this is a plain synchronous swap, so nothing depends on it.
let activeTransition = null;
function withTransition(fn) {
  if (!document.startViewTransition || reduceMotion()) {
    fn();
    return;
  }
  if (activeTransition) activeTransition.skipTransition();
  const transition = document.startViewTransition(fn);
  activeTransition = transition;
  // A ViewTransition exposes three independently-rejecting promises. Aborting
  // (rapid navigation, or a backgrounded tab) rejects all of them, so every one
  // needs a handler or the console fills with unhandled rejections.
  transition.ready.catch(() => {});
  transition.updateCallbackDone.catch(() => {});
  transition.finished
    .catch(() => {})
    .finally(() => {
      if (activeTransition === transition) activeTransition = null;
    });
}

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", state.theme);
}

function isDarkNow() {
  return (
    state.theme === "dark" ||
    (state.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

// Theme is purely CSS-driven (data-theme attribute + prefers-color-scheme), so
// switching it doesn't need a full re-render — just update the attribute and
// the small bits of UI that reflect it. That avoids a content flash and keeps
// scroll reveals from re-triggering.
function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem("lp-theme", theme);
  applyTheme();
  syncThemeUI();
  closeDropdowns();
}

function syncThemeUI() {
  const dark = isDarkNow();
  const icon = { light: "☀", dark: "☾", auto: "◐" }[state.theme] || (dark ? "☾" : "☀");
  document.querySelectorAll("[data-theme-dropdown]").forEach((dropdown) => {
    const glyph = dropdown.querySelector(".theme-glyph");
    if (glyph) glyph.textContent = icon;
    dropdown.querySelectorAll(".menu-option").forEach((opt) => {
      const active = opt.dataset.themeOption === state.theme;
      opt.classList.toggle("active", active);
      opt.setAttribute("aria-selected", String(active));
    });
  });
}

function setNavOpen(open) {
  state.navOpen = open;
  document.documentElement.classList.toggle("nav-open", open);
  const toggle = document.getElementById("nav-toggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? strings.nav.close : strings.nav.open);
  }
}

function navigate(page, id) {
  const path = hrefFor(BASE, page, id);
  if (path !== window.location.pathname) {
    history.pushState(null, "", path);
  }
  state.route = { page, id };
  withTransition(() => {
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

window.addEventListener("popstate", () => {
  state.route = parsePath(window.location.pathname, BASE);
  withTransition(() => {
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
});

function updateHead() {
  const meta = routeMeta(state.route, strings, projects, stories);
  document.title = meta.title;

  const url = SITE_ORIGIN + buildPath(state.route.page, state.route.id);
  setMeta('meta[name="description"]', meta.description);
  setMeta('meta[property="og:title"]', meta.title);
  setMeta('meta[property="og:description"]', meta.description);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[name="twitter:title"]', meta.title);
  setMeta('meta[name="twitter:description"]', meta.description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", url);
}

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", content);
}

function render() {
  updateHead();

  const ctx = {
    projects,
    competitions,
    comingSoon,
    stories,
    contact,
    profilePicSrc: profilePic,
    munariPicSrc: munariPic,
    base: BASE,
  };

  document.getElementById("app").innerHTML = `
    ${renderChrome({
      strings,
      route: state.route,
      projects,
      stories,
      competitions,
      theme: state.theme,
      isDark: isDarkNow(),
      base: BASE,
    })}
    <main id="main">
      ${renderPage(state.route, strings, ctx)}
      ${renderFooter(strings)}
    </main>
  `;

  setNavOpen(false);
  bindEvents();
  observeReveal();
}

function closeDropdowns() {
  document.querySelectorAll("[data-theme-dropdown]").forEach((d) => {
    d.classList.remove("open");
    d.querySelector(".menu-trigger")?.setAttribute("aria-expanded", "false");
  });
}

function bindEvents() {
  document.querySelectorAll("[data-theme-dropdown]").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".menu-trigger");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      closeDropdowns();
      dropdown.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
    dropdown
      .querySelectorAll(".menu-option")
      .forEach((opt) =>
        opt.addEventListener("click", () => setTheme(opt.dataset.themeOption)),
      );
  });

  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setNavOpen(!state.navOpen);
    });
  }
  document
    .getElementById("nav-scrim")
    ?.addEventListener("click", () => setNavOpen(false));

  document.querySelectorAll("[data-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      setNavOpen(false);
      const route = parsePath(new URL(a.href).pathname, BASE);
      navigate(route.page, route.id);
    }),
  );

  bindStoryLangSwitch();
  setupHoverPreview();
  setupScramble();
}

/* ---------- Story: morph between the four language versions in place ------ */
function bindStoryLangSwitch() {
  const buttons = document.querySelectorAll("[data-story-lang]");
  if (!buttons.length) return;
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.storyLang;
      const story = stories.find((s) => s.id === id);
      if (!story || btn.classList.contains("active")) return;

      const body = document.getElementById("story-body");
      const title = document.getElementById("story-title");
      const kicker = document.getElementById("story-kicker");

      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });

      const swap = () => {
        body.innerHTML = story.content;
        title.innerHTML = splitWords(story.title);
        kicker.textContent = story.lang;
        body.classList.remove("morphing");
        title.classList.remove("morphing");
        // Keep the URL honest so the page stays shareable/bookmarkable.
        history.replaceState(null, "", hrefFor(BASE, "story", id));
        state.route = { page: "story", id };
        updateHead();
        observeReveal();
      };

      if (reduceMotion()) {
        swap();
        return;
      }
      body.classList.add("morphing");
      title.classList.add("morphing");
      setTimeout(swap, 260);
    }),
  );
}

/* ---------- Nav hover: shows a line of her actual copy ----------
   render() replaces #app wholesale, so the panel element is a *new* node after
   every navigation. The pointer listener therefore reads the current panel from
   a module-level ref rather than closing over one. */
let previewPanel = null;
const pointer = { x: 0, y: 0 };

function positionPreview() {
  if (!previewPanel) return;
  previewPanel.style.left = pointer.x + "px";
  previewPanel.style.top = pointer.y + "px";
}

function setupHoverPreview() {
  previewPanel = document.getElementById("hover-preview");
  if (!previewPanel) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const quoteEl = previewPanel.querySelector(".hover-quote");
  const metaEl = previewPanel.querySelector(".hover-meta");
  positionPreview();

  document.querySelectorAll("[data-preview]").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      quoteEl.textContent = link.dataset.previewQuote || "";
      metaEl.textContent = link.dataset.previewSub || "";
      previewPanel.classList.add("visible");
      document.body.classList.add("previewing");
    });
    link.addEventListener("mouseleave", () => {
      previewPanel.classList.remove("visible");
      document.body.classList.remove("previewing");
    });
  });
}

/* ---------- Letter scramble (story titles only — used sparingly) ---------- */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function setupScramble() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reduceMotion()) return;
  document.querySelectorAll("[data-scramble] .nav-label").forEach((el) => {
    const original = el.textContent;
    let frame = 0;
    let raf;
    const host = el.closest("[data-scramble]");
    host.addEventListener("mouseenter", () => {
      cancelAnimationFrame(raf);
      frame = 0;
      const tick = () => {
        const progress = frame / 12;
        el.textContent = original
          .split("")
          .map((ch, i) => {
            if (ch === " " || i < progress * original.length) return ch;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("");
        frame += 1;
        if (frame <= 12) raf = requestAnimationFrame(tick);
        else el.textContent = original;
      };
      tick();
    });
    host.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      el.textContent = original;
    });
  });
}

/* ---------- Custom cursor (desktop pointer only) ---------- */
let cursorRing = null;
let cursorPoint = null;

function setupCursor() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reduceMotion()) return;

  cursorRing = document.createElement("div");
  cursorRing.className = "cursor-ring";
  cursorRing.setAttribute("aria-hidden", "true");

  cursorPoint = document.createElement("div");
  cursorPoint.className = "cursor-point";
  cursorPoint.setAttribute("aria-hidden", "true");

  document.body.append(cursorRing, cursorPoint);
  document.body.classList.add("has-custom-cursor");

  let cx = 0;
  let cy = 0;
  const loop = () => {
    cx += (pointer.x - cx) * 0.18;
    cy += (pointer.y - cy) * 0.18;
    cursorRing.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* Document-level listeners, registered exactly once — bindEvents() runs on
   every render, so anything attached to `document` must live out here. */
function bindGlobalEvents() {
  // Shrink the dock once the page is scrolled; full size while at the top so
  // it's unmissable on arrival. CSS handles the hover/focus restore.
  const SHRINK_AT = 40;
  let shrunk = false;
  const syncShrink = () => {
    const next = window.scrollY > SHRINK_AT;
    if (next === shrunk) return;
    shrunk = next;
    document.documentElement.classList.toggle("nav-shrink", next);
  };
  window.addEventListener("scroll", syncShrink, { passive: true });
  syncShrink();

  document.addEventListener("click", () => closeDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdowns();
      setNavOpen(false);
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setNavOpen(!state.navOpen);
    }
  });

  document.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    positionPreview();
    if (cursorPoint) {
      cursorPoint.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
      // Guard the node type: an event whose target isn't an Element (document,
      // a text node) has no closest() and would throw here.
      const interactive =
        e.target instanceof Element &&
        e.target.closest("a, button, [role='tab'], .menu-option");
      cursorRing.classList.toggle("active", !!interactive);
    }
  });
}

let revealObserver;
function observeReveal() {
  if (revealObserver) revealObserver.disconnect();
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  targets.forEach((el) => revealObserver.observe(el));
}

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "auto") syncThemeUI();
});

applyTheme();
setupCursor();
bindGlobalEvents();
render();
