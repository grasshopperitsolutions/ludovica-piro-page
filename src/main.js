import "./style.css";
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
  navCollapsed: localStorage.getItem("lp-nav-collapsed") === "1",
  route: parsePath(window.location.pathname, BASE),
};

function guessLang() {
  const nav = (navigator.language || "en").slice(0, 2);
  return locales[nav] ? nav : "en";
}

function t() {
  return locales[state.lang];
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
  document
    .querySelectorAll(".side-nav")
    .forEach((el) => el.classList.toggle("collapsed", collapsed));
  document.querySelectorAll("#nav-collapse-toggle").forEach((btn) => {
    const label = t().nav[collapsed ? "expand" : "collapse"];
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  });
}

function setLang(code) {
  state.lang = code;
  localStorage.setItem("lp-lang", code);
  document.documentElement.lang = code;
  render();
}

function navigate(page, id) {
  const path = hrefFor(BASE, page, id);
  if (path !== window.location.pathname) {
    history.pushState(null, "", path);
  }
  state.route = { page, id };
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("popstate", () => {
  state.route = parsePath(window.location.pathname, BASE);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
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
    })}
    <main id="main">
      ${renderPage(state.route, strings, ctx)}
      ${renderFooter(strings)}
    </main>
  `;

  document.documentElement.classList.toggle("nav-collapsed", state.navCollapsed);
  bindEvents();
  observeReveal();
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
  document.addEventListener("click", () => closeDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdowns();
  });

  document
    .querySelectorAll("#nav-collapse-toggle")
    .forEach((btn) =>
      btn.addEventListener("click", () => setNavCollapsed(!state.navCollapsed)),
    );

  const menuToggle = document.getElementById("menu-toggle");
  const scrim = document.getElementById("nav-scrim");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.getElementById("nav-drawer").classList.add("open");
      scrim.classList.add("open");
    });
    scrim.addEventListener("click", closeDrawer);
  }

  document.querySelectorAll("[data-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      closeDrawer();
      const route = parsePath(new URL(a.href).pathname, BASE);
      navigate(route.page, route.id);
    }),
  );

  setupHoverPreview();
}

let hoverPreviewReady = false;
function setupHoverPreview() {
  const panel = document.getElementById("hover-preview");
  if (!panel) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const plateSpan = panel.querySelector(".hover-preview-plate span");
  const titleEl = panel.querySelector(".hover-preview-text strong");
  const subEl = panel.querySelector(".hover-preview-text em");

  document.querySelectorAll("[data-preview]").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      panel.style.setProperty("--tone", link.dataset.previewTone);
      plateSpan.textContent = link.dataset.previewMark || "";
      titleEl.textContent = link.dataset.previewTitle || "";
      subEl.textContent = link.dataset.previewSub || "";
      panel.classList.add("visible");
    });
    link.addEventListener("mouseleave", () => {
      panel.classList.remove("visible");
    });
  });

  if (!hoverPreviewReady) {
    hoverPreviewReady = true;
    document.addEventListener("mousemove", (e) => {
      panel.style.left = e.clientX + "px";
      panel.style.top = e.clientY + "px";
    });
  }
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
render();
