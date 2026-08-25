import "./style.css";
// Temporary: red/white palette prototype. Imported after style.css so its
// accent overrides win. Remove together with the switcher in render.js.
import "./palette-prototype.css";
import strings from "./i18n/en.js";
import { contact, projects, competitions, cv, stories, ABOUT_GALLERY } from "./data.js";
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
  // Temporary, for the red/white comparison — see palette-prototype.css.
  accent: localStorage.getItem("lp-accent") || "mono",
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
// the toggle's own labelling. That avoids a content flash and keeps scroll
// reveals from re-triggering.
function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem("lp-theme", theme);
  applyTheme();
  syncThemeUI();
}

// One click flips to the opposite of what is *on screen* — so the first click
// from "auto" lands on the theme the visitor isn't already looking at.
function toggleTheme() {
  setTheme(isDarkNow() ? "light" : "dark");
}

function syncThemeUI() {
  const dark = isDarkNow();
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const label = dark ? strings.theme.toLight : strings.theme.toDark;
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", label);
  });
}

// Temporary: palette prototype. Pure CSS custom-property swap, so no re-render.
function applyAccent() {
  document.documentElement.setAttribute("data-accent", state.accent);
  document
    .querySelectorAll("[data-accent-option]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.accentOption === state.accent)),
    );
}

function setAccent(accent) {
  state.accent = accent;
  localStorage.setItem("lp-accent", accent);
  applyAccent();
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
    cv,
    stories,
    contact,
    gallery: ABOUT_GALLERY,
    profilePicSrc: profilePic,
    munariPicSrc: munariPic,
    base: BASE,
  };

  document.getElementById("app").innerHTML = `
    ${renderChrome({
      strings,
      route: state.route,
      isDark: isDarkNow(),
      base: BASE,
    })}
    <main id="main">
      ${renderPage(state.route, strings, ctx)}
      ${renderFooter(strings, state.route)}
    </main>
  `;

  applyAccent();
  bindEvents();
  observeReveal();
}

function bindEvents() {
  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((btn) => btn.addEventListener("click", toggleTheme));

  document
    .querySelectorAll("[data-accent-option]")
    .forEach((b) => b.addEventListener("click", () => setAccent(b.dataset.accentOption)));

  document.querySelectorAll("[data-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      const route = parsePath(new URL(a.href).pathname, BASE);
      navigate(route.page, route.id);
    }),
  );

  bindStoryLangSwitch();
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

/* ---------- Custom cursor (desktop pointer only) ---------- */
// Last known pointer position, written by the document mousemove handler and
// read by the ring's easing loop.
const pointer = { x: 0, y: 0 };
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

  document.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (cursorPoint) {
      cursorPoint.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
      // Guard the node type: an event whose target isn't an Element (document,
      // a text node) has no closest() and would throw here.
      const interactive =
        e.target instanceof Element && e.target.closest("a, button, [role='tab']");
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

// render() rebuilds #app, which discards the browser's own jump to a URL
// fragment — so arrivals at e.g. /#contact (including the /contact redirect)
// need to be scrolled into view once the markup exists.
if (window.location.hash.length > 1) {
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    requestAnimationFrame(() =>
      target.scrollIntoView({
        behavior: reduceMotion() ? "auto" : "smooth",
        block: "start",
      }),
    );
  }
}
