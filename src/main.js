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
  routeMeta,
  renderChrome,
  renderPage,
  renderFooter,
} from "./render.js";

const locales = { en, it, es, pt };
const localeList = Object.values(locales);
const SITE_ORIGIN = "https://ludovicapiro.com";

const state = {
  lang: localStorage.getItem("lp-lang") || guessLang(),
  theme: localStorage.getItem("lp-theme") || "auto",
  route: parsePath(window.location.pathname),
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

function toggleTheme() {
  state.theme = isDarkNow() ? "light" : "dark";
  localStorage.setItem("lp-theme", state.theme);
  applyTheme();
  render();
}

function setLang(code) {
  state.lang = code;
  localStorage.setItem("lp-lang", code);
  document.documentElement.lang = code;
  render();
}

function navigate(page, id) {
  const path = buildPath(page, id);
  if (path !== window.location.pathname) {
    history.pushState(null, "", path);
  }
  state.route = { page, id };
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("popstate", () => {
  state.route = parsePath(window.location.pathname);
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
  };

  app.innerHTML = `
    ${renderChrome(strings, localeList, state.lang, state.route, projects, stories, isDarkNow())}
    <main id="main">
      ${renderPage(state.route, strings, ctx)}
      ${renderFooter(strings)}
    </main>
  `;

  bindEvents();
  observeReveal();
}

function closeDrawer() {
  document.getElementById("nav-drawer")?.classList.remove("open");
  document.getElementById("nav-scrim")?.classList.remove("open");
}

function closeLangDropdowns(except) {
  document.querySelectorAll("[data-lang-dropdown]").forEach((d) => {
    if (d !== except) {
      d.classList.remove("open");
      d.querySelector(".lang-trigger")?.setAttribute("aria-expanded", "false");
    }
  });
}

function bindEvents() {
  document.querySelectorAll("#theme-toggle, #theme-toggle-mobile").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.currentTarget.classList.add("spin");
      toggleTheme();
    }),
  );

  document.querySelectorAll("[data-lang-dropdown]").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".lang-trigger");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      closeLangDropdowns();
      dropdown.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
    dropdown.querySelectorAll(".lang-option").forEach((opt) =>
      opt.addEventListener("click", () => {
        setLang(opt.dataset.lang);
      }),
    );
  });
  document.addEventListener("click", () => closeLangDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLangDropdowns();
  });

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
      const route = parsePath(new URL(a.href).pathname);
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

applyTheme();
render();
