import "./style.css";
// Temporary: nav-mode prototypes. Imported after style.css so its rules win
// the cascade over the base rail layout. Remove once a mode is chosen.
import "./nav-prototypes.css";
import en from "./i18n/en.js";
import it from "./i18n/it.js";
import es from "./i18n/es.js";
import pt from "./i18n/pt.js";
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

const locales = { en, it, es, pt };
const localeList = Object.values(locales);
const SITE_ORIGIN = "https://ludovicapiro.com";
// Vite always resolves this to the configured `base`, trailing slash
// included (e.g. "/" at the eventual domain root, or
// "/ludovica-piro-page/" while staged as an org-domain subpath) — every
// in-page link has to carry this prefix or it 404s once deployed.
const BASE = import.meta.env.BASE_URL;

const state = {
  lang: localStorage.getItem("lp-lang") || guessLang(),
  theme: localStorage.getItem("lp-theme") || "auto",
  // Closed by default — the site opens on the work, not the menu. The inline
  // boot script in index.html applies the same default before first paint.
  navCollapsed: (localStorage.getItem("lp-nav-collapsed") ?? "1") === "1",
  navMode: localStorage.getItem("lp-nav-mode") || "overture",
  navOpen: false,
  route: parsePath(window.location.pathname, BASE),
};

function guessLang() {
  const nav = (navigator.language || "en").slice(0, 2);
  return locales[nav] ? nav : "en";
}

function t() {
  return locales[state.lang];
}

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
  // Rapid navigation aborts the in-flight transition, which rejects its
  // promises — swallow that rather than surfacing an unhandled rejection.
  if (activeTransition) {
    activeTransition.skipTransition();
  }
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

// Theme is purely CSS-driven (data-theme attribute + prefers-color-scheme),
// so switching it doesn't need a full re-render — just update the attribute
// and the small bits of UI (trigger glyph, active option) that reflect it.
// That also avoids an app-wide content flash / re-triggering scroll reveals.
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
    dropdown.querySelectorAll(".lang-option").forEach((opt) => {
      const active = opt.dataset.themeOption === state.theme;
      opt.classList.toggle("active", active);
      opt.setAttribute("aria-selected", String(active));
    });
  });
}

// The sidebar collapse is likewise a pure CSS/layout change — toggling it
// through the DOM directly (rather than render()) keeps the width/margin
// transitions smooth, since a full innerHTML replace would just snap.
function setNavCollapsed(collapsed) {
  state.navCollapsed = collapsed;
  localStorage.setItem("lp-nav-collapsed", collapsed ? "1" : "0");
  document.documentElement.classList.toggle("nav-collapsed", collapsed);
  document.querySelectorAll("#nav-collapse-toggle").forEach((btn) => {
    const label = t().nav[collapsed ? "expand" : "collapse"];
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  });
}

/* ---------- Nav prototype modes (temporary comparison harness) ---------- */
function applyNavMode() {
  document.documentElement.setAttribute("data-nav-mode", state.navMode);
}

function setNavMode(mode) {
  state.navMode = mode;
  state.navOpen = false;
  localStorage.setItem("lp-nav-mode", mode);
  applyNavMode();
  setNavOpen(false);
  render();
}

function setNavOpen(open) {
  state.navOpen = open;
  document.documentElement.classList.toggle("nav-open", open);
  document
    .querySelectorAll("#nav-open-toggle")
    .forEach((b) => b.setAttribute("aria-expanded", String(open)));
}

function setLang(code) {
  state.lang = code;
  localStorage.setItem("lp-lang", code);
  document.documentElement.lang = code;
  withTransition(render);
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

function updateHead(strings) {
  const meta = routeMeta(state.route, strings, projects, stories);
  document.title = meta.title;
  document.documentElement.lang = state.lang;

  const path = buildPath(state.route.page, state.route.id);
  const url = SITE_ORIGIN + path;

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
  const strings = t();
  updateHead(strings);

  const app = document.getElementById("app");
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

  app.innerHTML = `
    ${renderChrome({
      strings,
      locales: localeList,
      activeLang: state.lang,
      route: state.route,
      projects,
      stories,
      theme: state.theme,
      isDark: isDarkNow(),
      base: BASE,
      navCollapsed: state.navCollapsed,
      navMode: state.navMode,
    })}
    <main id="main">
      ${renderPage(state.route, strings, ctx)}
      ${renderFooter(strings)}
    </main>
  `;

  document.documentElement.classList.toggle("nav-collapsed", state.navCollapsed);
  bindEvents();
  observeReveal();
  startTaglineCycle();
}

function closeDrawer() {
  document.getElementById("nav-drawer")?.classList.remove("open");
  document.getElementById("nav-scrim")?.classList.remove("open");
}

function closeDropdowns() {
  document
    .querySelectorAll("[data-lang-dropdown], [data-theme-dropdown]")
    .forEach((d) => {
      d.classList.remove("open");
      d.querySelector(".lang-trigger")?.setAttribute("aria-expanded", "false");
    });
}

function bindEvents() {
  document
    .querySelectorAll("[data-lang-dropdown], [data-theme-dropdown]")
    .forEach((dropdown) => {
      const trigger = dropdown.querySelector(".lang-trigger");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains("open");
        closeDropdowns();
        dropdown.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
      dropdown.querySelectorAll(".lang-option").forEach((opt) =>
        opt.addEventListener("click", () => {
          if (opt.dataset.lang) setLang(opt.dataset.lang);
          else if (opt.dataset.themeOption) setTheme(opt.dataset.themeOption);
        }),
      );
    });

  document
    .querySelectorAll("#nav-collapse-toggle")
    .forEach((btn) =>
      btn.addEventListener("click", () => setNavCollapsed(!state.navCollapsed)),
    );

  document.querySelectorAll('#proto-switch input[name="nav-mode"]').forEach((radio) =>
    radio.addEventListener("change", (e) => {
      if (e.target.checked) setNavMode(e.target.value);
    }),
  );

  document
    .querySelectorAll("#nav-open-toggle")
    .forEach((btn) => btn.addEventListener("click", () => setNavOpen(!state.navOpen)));
  document
    .querySelectorAll("#nav-close-toggle")
    .forEach((btn) => btn.addEventListener("click", () => setNavOpen(false)));

  const protoToggle = document.getElementById("proto-toggle");
  if (protoToggle) {
    protoToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const box = document.getElementById("proto-switch");
      const open = box.classList.toggle("open");
      protoToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const menuToggle = document.getElementById("menu-toggle");
  const scrim = document.getElementById("nav-scrim");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.getElementById("nav-drawer").classList.add("open");
      scrim.classList.add("open");
    });
  }
  if (scrim) {
    scrim.addEventListener("click", () => {
      closeDrawer();
      setNavOpen(false);
    });
  }

  document.querySelectorAll("[data-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      closeDrawer();
      setNavOpen(false);
      const route = parsePath(new URL(a.href).pathname, BASE);
      navigate(route.page, route.id);
    }),
  );

  bindStoryLangSwitch();
  setupHoverPreview();
  setupScramble();
}

/* ---------- Hero tagline: cycles through all four languages ---------- */
let taglineTimer;
function startTaglineCycle() {
  clearInterval(taglineTimer);
  const el = document.getElementById("tagline-cycle");
  if (!el || reduceMotion()) return;

  // Start from the active language, then rotate — she speaks four, so the
  // hero line says so before you read a word about it.
  const order = [state.lang, ...Object.keys(locales).filter((c) => c !== state.lang)];
  let i = 0;
  taglineTimer = setInterval(() => {
    i = (i + 1) % order.length;
    el.classList.add("swapping");
    setTimeout(() => {
      el.textContent = locales[order[i]].hero.tagline;
      el.classList.remove("swapping");
    }, 320);
  }, 3600);
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
        updateHead(t());
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
   render() replaces #app wholesale, so the panel element is a *new* node
   after every navigation. The pointer listener therefore has to read the
   current panel from a module-level ref rather than closing over one, or it
   ends up positioning an orphaned node from a previous render. */
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

  // Seed the fresh panel with the last known pointer position so it appears
  // where the cursor already is, not at the top-left corner.
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
    el.closest("[data-scramble]").addEventListener("mouseenter", () => {
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
    el.closest("[data-scramble]").addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      el.textContent = original;
    });
  });
}

/* ---------- Custom cursor (desktop pointer only) ----------
   With the native cursor hidden, a single lagging ring feels disconnected —
   so there's a precise dot that tracks the pointer exactly plus a ring that
   trails behind it. The native cursor is only hidden once this is actually
   running, so touch devices and reduced-motion users keep theirs. */
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

/* Document-level listeners are registered exactly once. They used to live in
   bindEvents(), which runs on every render — so each navigation stacked up
   another copy of them. */
function bindGlobalEvents() {
  document.addEventListener("click", () => closeDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdowns();
      setNavOpen(false);
    }
    // Dock mode also answers to ⌘K / Ctrl-K.
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
        e.target.closest("a, button, [role='tab'], .lang-option");
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
applyNavMode();
setupCursor();
bindGlobalEvents();
render();
