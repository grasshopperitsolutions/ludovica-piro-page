import "./style.css";
import strings from "./i18n/en.js";
import {
  contact,
  projects,
  competitions,
  cv,
  stories,
  STORY_GROUPS,
  POETRY_CAMERA,
} from "./data.js";
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

function navigate(page, id) {
  const path = hrefFor(BASE, page, id);
  if (path !== window.location.pathname) {
    history.pushState(null, "", path);
  }
  state.route = { page, id };
  clearTimeout(previewTimer);
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
  const meta = routeMeta(state.route, strings, projects, stories, competitions);
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
    storyGroups: STORY_GROUPS,
    poetry: POETRY_CAMERA,
    contact,
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

  bindEvents();
  observeReveal();
}

function bindEvents() {
  document
    .querySelectorAll("[data-theme-toggle]")
    .forEach((btn) => btn.addEventListener("click", toggleTheme));

  document.querySelectorAll("[data-link]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      const route = parsePath(new URL(a.href).pathname, BASE);
      navigate(route.page, route.id);
    }),
  );

  bindStoryLangSwitch();
  setupWorkPreview();
  setupAudioPlayers();
}

/* ---------- Audio: a transport that matches the page ----------
   The markup ships a working `<audio controls>` so the spot plays with no JS at
   all. Here we take the browser's chrome away and reveal our own — which means
   the swap only ever happens when there is something to swap to. */
function setupAudioPlayers() {
  document.querySelectorAll("[data-audio-player]").forEach((root) => {
    const audio = root.querySelector("audio");
    const ui = root.querySelector("[data-audio-ui]");
    const toggle = root.querySelector("[data-audio-toggle]");
    const track = root.querySelector("[data-audio-track]");
    const fill = root.querySelector("[data-audio-fill]");
    const time = root.querySelector("[data-audio-time]");
    if (!audio || !ui || ui.dataset.ready) return;

    ui.dataset.ready = "1";
    audio.removeAttribute("controls");
    ui.hidden = false;

    const clock = (secs) => {
      if (!Number.isFinite(secs)) return "0:00";
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${String(s).padStart(2, "0")}`;
    };

    toggle.addEventListener("click", () => {
      if (audio.paused) audio.play();
      else audio.pause();
    });

    const syncButton = () => {
      root.classList.toggle("is-playing", !audio.paused);
      toggle.setAttribute(
        "aria-label",
        audio.paused ? strings.audio.play : strings.audio.pause,
      );
    };
    audio.addEventListener("play", syncButton);
    audio.addEventListener("pause", syncButton);

    // Counts down what is left rather than up from zero — for a 30-second spot
    // "how much longer" is the useful number.
    audio.addEventListener("timeupdate", () => {
      const total = audio.duration;
      if (!Number.isFinite(total) || total === 0) return;
      fill.style.transform = `scaleX(${audio.currentTime / total})`;
      time.textContent = clock(total - audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      time.textContent = clock(audio.duration);
    });
    audio.addEventListener("ended", () => {
      fill.style.transform = "scaleX(0)";
      time.textContent = clock(audio.duration);
    });

    // Click anywhere on the line to scrub there.
    track.addEventListener("click", (e) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      if (Number.isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
    });
  });
}

/* ---------- Works: hover-intent preview ----------
   A row has to be rested on for half a second before it takes over the panel —
   long enough that sweeping the cursor down the list changes nothing. Once a
   preview is up it stays up: leaving a row only cancels a pending swap, so the
   panel never blinks out between rows. */
const PREVIEW_DELAY = 500;
let previewTimer = null;

function setupWorkPreview() {
  const panel = document.querySelector("[data-work-preview]");
  const rows = document.querySelectorAll(".work-row[data-preview-src]");
  if (!panel || !rows.length) return;
  // Pointer-driven, so it is meaningless on touch — those visitors just tap
  // through to the work itself.
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const show = (row) => {
    const { previewSrc, previewType, previewAlt } = row.dataset;
    // Which row owns the panel always updates. Only the media itself is left
    // alone when the source is unchanged — rewriting it would restart a film
    // that is already playing.
    rows.forEach((r) => r.classList.toggle("is-previewing", r === row));
    panel.classList.add("is-visible");
    if (panel.dataset.current === previewSrc) return;
    panel.dataset.current = previewSrc;

    // Replacing the contents restarts the CSS entrance animation, so each new
    // preview fades and settles in rather than snapping into place.
    if (previewType === "embed") {
      // A work with no stills of its own: its film, muted and looping, with the
      // player's own chrome suppressed by the query string.
      panel.innerHTML = `<iframe src="${previewSrc}" title="${previewAlt}" loading="lazy" frameborder="0" allow="autoplay; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    } else if (previewType === "video") {
      panel.innerHTML = `<video src="${previewSrc}" autoplay muted loop playsinline preload="metadata" aria-label="${previewAlt}"></video>`;
    } else {
      panel.innerHTML = `<img src="${previewSrc}" alt="${previewAlt}" />`;
    }
  };

  rows.forEach((row) => {
    const arm = () => {
      clearTimeout(previewTimer);
      previewTimer = setTimeout(() => show(row), PREVIEW_DELAY);
    };
    const disarm = () => clearTimeout(previewTimer);
    row.addEventListener("mouseenter", arm);
    row.addEventListener("focus", arm);
    row.addEventListener("mouseleave", disarm);
    row.addEventListener("blur", disarm);
  });
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
