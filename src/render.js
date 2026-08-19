// Pure, isomorphic HTML-string templates.
// No `document`/`window` access here — this module is imported both by the
// browser client (src/main.js) and by the Node prerender script
// (scripts/prerender.mjs), so it must run in either environment unchanged.
//
// `buildPath()` returns app-relative paths ("/work/sakerhet") and is what
// canonical/OG URLs, the sitemap, and the prerender output folders use —
// those intentionally point at the eventual root-domain deployment
// regardless of where the site is staged right now. `hrefFor()` is the
// base-aware version used for every actual in-page `<a href>`, since the
// site may currently be served from a subpath (e.g. when staged at
// grasshoppersolutions.online/ludovica-piro-page/ ahead of its own domain).

import { PLATE_LINES, storyGroupFor } from "./data.js";

export const LANG_NAMES = {
  en: "English",
  it: "Italiano",
  es: "Español",
  pt: "Português",
};

export function plateFor(project) {
  return PLATE_LINES[project.id] || project.summary;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Wraps each word in a masked span so headlines can rise word-by-word.
// The spans are inert without JS/animation — the text still reads normally,
// and `prefers-reduced-motion` flattens the effect in CSS.
export function splitWords(text, { animate = true } = {}) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word, i) =>
        `<span class="w"><span class="w-in"${
          animate ? ` style="--wi:${i}"` : ""
        }>${escapeHtml(word)}</span></span>`,
    )
    .join(" ");
}

export function excerpt(html, len = 90) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > len ? text.slice(0, len).trim() + "…" : text;
}

export function parsePath(pathname, base = "/") {
  const b = (base || "/").replace(/\/+$/, "");
  const rel = b && pathname.startsWith(b) ? pathname.slice(b.length) || "/" : pathname;
  const segs = rel.split("/").filter(Boolean);
  if (segs.length === 0) return { page: "home" };
  if (segs[0] === "work") {
    return segs[1] ? { page: "project", id: segs[1] } : { page: "work" };
  }
  if (segs[0] === "stories") {
    return segs[1] ? { page: "story", id: segs[1] } : { page: "stories" };
  }
  if (segs[0] === "contact" && segs.length === 1) return { page: "contact" };
  return { page: "notfound" };
}

export function buildPath(page, id) {
  switch (page) {
    case "home":
      return "/";
    case "work":
      return "/work";
    case "project":
      return `/work/${id}`;
    case "stories":
      return "/stories";
    case "story":
      return `/stories/${id}`;
    case "contact":
      return "/contact";
    default:
      return "/";
  }
}

export function hrefFor(base, page, id) {
  // Accepts `base` with or without a trailing slash (Vite's import.meta.env.BASE_URL
  // always has one; the prerender script strips it for its own asset-path use) —
  // normalize here so both callers get a correctly joined path either way.
  const b = (base || "/").replace(/\/+$/, "") || "/";
  const rel = buildPath(page, id);
  if (b === "/") return rel;
  return rel === "/" ? b + "/" : b + rel;
}

export function routeMeta(route, strings, projects, stories) {
  const site = strings.meta.title.split(" — ")[0];
  switch (route.page) {
    case "home":
      return { title: strings.meta.title, description: strings.meta.description };
    case "work":
      return {
        title: `${strings.nav.work} — ${site}`,
        description: strings.meta.description,
      };
    case "project": {
      const p = projects.find((x) => x.id === route.id);
      return p
        ? { title: `${p.title} — ${p.brand} — ${site}`, description: p.summary }
        : { title: site, description: strings.meta.description };
    }
    case "stories":
      return {
        title: `${strings.nav.stories} — ${site}`,
        description: strings.stories.subheading,
      };
    case "story": {
      const s = stories.find((x) => x.id === route.id);
      return s
        ? { title: `${s.title} — ${site}`, description: excerpt(s.content, 150) }
        : { title: site, description: strings.meta.description };
    }
    case "contact":
      return {
        title: `${strings.nav.contact} — ${site}`,
        description: strings.meta.description,
      };
    default:
      return { title: `Page not found — ${site}`, description: "" };
  }
}

function pad2(n) {
  return String(n + 1).padStart(2, "0");
}

function navWorkList(projects, activePage, activeId, base) {
  return projects
    .map((p) => {
      const active = activePage === "project" && activeId === p.id;
      return `<a href="${hrefFor(base, "project", p.id)}" data-link class="nav-sub-link ${active ? "active" : ""}"
        data-preview data-preview-title="${escapeHtml(p.title)}"
        data-preview-quote="${escapeHtml(plateFor(p))}"
        data-preview-sub="${escapeHtml(p.brand)}"
      ><span class="nav-label">${escapeHtml(p.title)}</span></a>`;
    })
    .join("");
}

function navStoryList(stories, activePage, activeId, base) {
  return stories
    .map((s) => {
      const active = activePage === "story" && activeId === s.id;
      return `<a href="${hrefFor(base, "story", s.id)}" data-link data-scramble class="nav-sub-link ${active ? "active" : ""}"
        data-preview data-preview-title="${escapeHtml(s.title)}"
        data-preview-quote="${escapeHtml(excerpt(s.content, 80))}"
        data-preview-sub="${escapeHtml(s.lang)}"
      ><span class="nav-num">${escapeHtml(s.lang)}</span><span class="nav-label">${escapeHtml(s.title)}</span></a>`;
    })
    .join("");
}

export function renderNav(strings, projects, stories, route, base) {
  const p = route.page;
  const id = route.id;
  const isActive = (key) => p === key;
  return `
    <a href="${hrefFor(base, "home")}" data-link class="nav-top-link ${isActive("home") ? "active" : ""}">${strings.nav.home}</a>

    <div class="nav-group">
      <a href="${hrefFor(base, "work")}" data-link class="nav-top-link ${isActive("work") || isActive("project") ? "active" : ""}">${strings.nav.work}</a>
      <div class="nav-sub-list">${navWorkList(projects, p, id, base)}</div>
    </div>

    <div class="nav-group">
      <a href="${hrefFor(base, "stories")}" data-link class="nav-top-link ${isActive("stories") || isActive("story") ? "active" : ""}">${strings.nav.stories}</a>
      <div class="nav-sub-list">${navStoryList(stories, p, id, base)}</div>
    </div>

    <a href="${hrefFor(base, "contact")}" data-link class="nav-top-link ${isActive("contact") ? "active" : ""}">${strings.nav.contact}</a>
  `;
}

function langDropdown(idSuffix, locales, activeLang) {
  const suffix = idSuffix ? `-${idSuffix}` : "";
  return `
    <div class="lang-dropdown" data-lang-dropdown>
      <button type="button" class="lang-trigger" id="lang-trigger${suffix}" aria-haspopup="listbox" aria-expanded="false">
        <span class="lang-current">${activeLang.toUpperCase()}</span>
        <span class="lang-caret">⌄</span>
      </button>
      <ul class="lang-menu" role="listbox" id="lang-menu${suffix}">
        ${locales
          .map(
            (l) => `
          <li role="option" class="lang-option ${l.code === activeLang ? "active" : ""}" data-lang="${l.code}" aria-selected="${l.code === activeLang}">
            <span class="lang-option-code">${l.label}</span>
            <span class="lang-option-name">${LANG_NAMES[l.code] || l.code}</span>
          </li>`,
          )
          .join("")}
      </ul>
    </div>
  `;
}

const THEME_ICONS = { light: "☀", dark: "☾", auto: "◐" };
const THEME_ORDER = ["light", "dark", "auto"];

function themeDropdown(idSuffix, theme, isDark, strings) {
  const suffix = idSuffix ? `-${idSuffix}` : "";
  const triggerIcon = THEME_ICONS[theme] || (isDark ? "☾" : "☀");
  return `
    <div class="lang-dropdown" data-theme-dropdown>
      <button type="button" class="lang-trigger" id="theme-trigger${suffix}" aria-haspopup="listbox" aria-expanded="false" aria-label="${strings.theme[theme] || strings.theme.auto}">
        <span class="theme-glyph">${triggerIcon}</span>
        <span class="lang-caret">⌄</span>
      </button>
      <ul class="lang-menu" role="listbox" id="theme-menu${suffix}">
        ${THEME_ORDER.map(
          (key) => `
          <li role="option" class="lang-option ${key === theme ? "active" : ""}" data-theme-option="${key}" aria-selected="${key === theme}">
            <span class="lang-option-code">${THEME_ICONS[key]}</span>
            <span class="lang-option-name">${strings.theme[key]}</span>
          </li>`,
        ).join("")}
      </ul>
    </div>
  `;
}

/* ---------------------------------------------------------------------------
   Nav modes — three prototypes plus the existing rail, switchable at runtime
   so they can be compared side by side. Each renders its own desktop chrome;
   below 900px they all share the same top bar + drawer, since these are
   desktop navigation concepts. Once one is chosen the others (and the
   `.proto-switch` control) come out.
   --------------------------------------------------------------------------- */
export const NAV_MODES = [
  { id: "overture", label: "1 · Overture" },
  { id: "spine", label: "4 · Spine" },
  { id: "dock", label: "5 · Dock" },
  { id: "rail", label: "Rail (current)" },
];

function protoSwitch(navMode) {
  return `
    <div class="proto-switch" id="proto-switch">
      <button type="button" class="proto-toggle" id="proto-toggle" aria-label="Nav prototype switcher" aria-expanded="false">⚙</button>
      <div class="proto-list">
        <span class="proto-title">Nav prototype</span>
        ${NAV_MODES.map(
          (m) => `
          <label class="proto-opt">
            <input type="radio" name="nav-mode" value="${m.id}" ${m.id === navMode ? "checked" : ""} />
            <span>${m.label}</span>
          </label>`,
        ).join("")}
      </div>
    </div>
  `;
}

function modeControls(locales, activeLang, theme, isDark, strings, extraClass = "") {
  return `
    <div class="topbar-controls ${extraClass}">
      ${langDropdown("", locales, activeLang)}
      ${themeDropdown("", theme, isDark, strings)}
    </div>
  `;
}

function railChrome(ctx) {
  const { strings, navHtml, navCollapsed } = ctx;
  const collapseLabel = navCollapsed ? strings.nav.expand : strings.nav.collapse;
  return `
    <aside class="side-nav">
      <button
        type="button"
        class="brand brand-toggle"
        id="nav-collapse-toggle"
        aria-label="${collapseLabel}"
        title="${collapseLabel}"
        aria-expanded="${!navCollapsed}"
      >
        <span class="brand-mark">L</span>
        <span class="brand-text">Ludovica Piro</span>
      </button>
      <nav class="nav-scroll">${navHtml}</nav>
      ${modeControls(ctx.locales, ctx.activeLang, ctx.theme, ctx.isDark, strings)}
    </aside>
  `;
}

/* 1 — Overture: no rail; the menu takes the whole screen. */
function overtureChrome(ctx) {
  const { strings, navHtml, locales, activeLang, theme, isDark } = ctx;
  return `
    <div class="mode-cluster">
      <button type="button" class="brand-mark mode-trigger" id="nav-open-toggle"
        aria-label="${strings.nav.expand}" title="${strings.nav.expand}" aria-expanded="false">L</button>
      ${modeControls(locales, activeLang, theme, isDark, strings, "controls-down")}
    </div>
    <div class="overture" id="overture-panel">
      <button type="button" class="icon-btn overture-close" id="nav-close-toggle" aria-label="${strings.stories.close}">✕</button>
      <nav class="overture-nav">${navHtml}</nav>
    </div>
  `;
}

/* 4 — Spine: the rotated name along the edge is the button. */
function spineChrome(ctx) {
  const { strings, navHtml, locales, activeLang, theme, isDark } = ctx;
  return `
    <div class="spine">
      <button type="button" class="spine-btn" id="nav-open-toggle"
        aria-label="${strings.nav.expand}" aria-expanded="false">
        <span class="spine-text">Ludovica Piro</span>
      </button>
      ${modeControls(locales, activeLang, theme, isDark, strings, "controls-stack")}
    </div>
    <div class="spine-panel" id="spine-panel">
      <button type="button" class="icon-btn spine-close" id="nav-close-toggle" aria-label="${strings.stories.close}">✕</button>
      <nav class="nav-scroll">${navHtml}</nav>
    </div>
  `;
}

/* 5 — Dock: floating pill, expands upward. */
function dockChrome(ctx) {
  const { strings, navHtml, locales, activeLang, theme, isDark, route } = ctx;
  const current =
    {
      home: strings.nav.home,
      work: strings.nav.work,
      project: strings.nav.work,
      stories: strings.nav.stories,
      story: strings.nav.stories,
      contact: strings.nav.contact,
    }[route.page] || strings.nav.home;
  return `
    <div class="dock">
      <div class="dock-panel" id="dock-panel">
        <nav class="dock-nav">${navHtml}</nav>
      </div>
      <div class="dock-pill">
        <button type="button" class="dock-brand" id="nav-open-toggle" aria-label="${strings.nav.expand}" aria-expanded="false">
          <span class="brand-mark">L</span>
          <span class="dock-current">${current}</span>
        </button>
        ${modeControls(locales, activeLang, theme, isDark, strings, "controls-dock")}
      </div>
    </div>
  `;
}

const MODE_CHROME = {
  rail: railChrome,
  overture: overtureChrome,
  spine: spineChrome,
  dock: dockChrome,
};

export function renderChrome({
  strings,
  locales,
  activeLang,
  route,
  projects,
  stories,
  theme,
  isDark,
  base,
  navCollapsed,
  navMode = "overture",
}) {
  const navHtml = renderNav(strings, projects, stories, route, base);
  const ctx = {
    strings,
    navHtml,
    locales,
    activeLang,
    route,
    theme,
    isDark,
    base,
    navCollapsed,
  };
  const chrome = (MODE_CHROME[navMode] || overtureChrome)(ctx);

  // Only the rail falls back to a top bar + drawer on small screens. The other
  // three carry their own concept down to mobile — a full-screen menu, an edge
  // spine and a thumb-reach dock are all natively mobile ideas, and they have
  // to stay distinguishable to be worth comparing on a phone.
  const railMobile =
    navMode === "rail"
      ? `
    <div class="topbar">
      <a href="${hrefFor(base, "home")}" data-link class="brand"><span class="brand-mark">L</span> Ludovica Piro</a>
      <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu">☰</button>
    </div>
    <div class="nav-drawer" id="nav-drawer">
      <nav>${navHtml}</nav>
      <div class="topbar-controls">
        ${langDropdown("mobile", locales, activeLang)}
        ${themeDropdown("mobile", theme, isDark, strings)}
      </div>
    </div>`
      : "";

  return `
    <div class="grain" aria-hidden="true"></div>
    ${protoSwitch(navMode)}
    ${railMobile}
    ${chrome}
    <div class="nav-scrim" id="nav-scrim"></div>
    <div class="hover-preview" id="hover-preview" aria-hidden="true">
      <p class="hover-quote"></p>
      <span class="hover-meta"></span>
    </div>
  `;
}

function projectCard(p, base, index) {
  const line = plateFor(p);
  return `
    <a href="${hrefFor(base, "project", p.id)}" data-link class="project-card" data-reveal style="--i:${index % 6}">
      <div class="project-plate">
        <span class="plate-index">${pad2(index)}</span>
        <p class="plate-line">${escapeHtml(line)}</p>
        <span class="plate-rule"></span>
      </div>
      <h3>${escapeHtml(p.title)}</h3>
      <div class="brand-line"><span>${escapeHtml(p.brand)} · ${escapeHtml(p.agency)}</span><span class="go">↗</span></div>
    </a>`;
}

export function renderHomePage(
  strings,
  projects,
  stories,
  profilePicSrc,
  munariPicSrc,
  base,
) {
  return `
    <section class="hero" id="home">
      <span class="brand-mark">L</span>
      <h1 class="hero-title">${splitWords(strings.hero.greeting)}</h1>
      <p class="tagline">
        <span class="tagline-static">${escapeHtml(strings.hero.role)}</span>
        <span class="tagline-cycle" id="tagline-cycle" data-cycle>${escapeHtml(strings.hero.tagline)}</span>
      </p>
      <div class="scroll-cue">${strings.nav.work}</div>
    </section>

    <section>
      <div class="about-grid">
        <div class="about-photos" data-reveal>
          <figure><img src="${profilePicSrc}" alt="Ludovica Piro" loading="lazy" /></figure>
          <figure><img src="${munariPicSrc}" alt="${escapeHtml(strings.about.munariCaption)}" loading="lazy" /></figure>
        </div>
        <div class="about-text" data-reveal style="--i:1">
          <p>${strings.about.p1}</p>
          <p>${strings.about.p2}</p>
          <p>${strings.about.p3}</p>
          <p class="about-quote">${strings.about.munariQuote}<br /><span style="font-size:.8rem;opacity:.7">— ${strings.about.munariCaption}</span></p>
          <div class="meta-row">
            <div><span>${strings.about.languagesLabel}</span>${strings.about.languagesValue}</div>
            <div><span>${strings.about.expertiseLabel}</span>${strings.about.expertiseValue}</div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="section-heading" data-reveal><span class="kicker-num">01</span><h2>${strings.work.heading}</h2><div class="rule"></div></div>
      <div class="project-grid">
        ${projects
          .slice(0, 3)
          .map((p, i) => projectCard(p, base, i))
          .join("")}
      </div>
      <a class="text-link" href="${hrefFor(base, "work")}" data-link data-reveal>${strings.work.heading} <span class="go">↗</span></a>
    </section>

    <section class="stories-section">
      <div class="stories-inner">
        <div class="section-heading" data-reveal><span class="kicker-num">02</span><h2>${strings.stories.heading}</h2><div class="rule"></div></div>
        <div class="story-grid">
          ${stories
            .map(
              (s, i) => `
            <a href="${hrefFor(base, "story", s.id)}" data-link class="story-card" data-reveal style="--i:${i}">
              <span class="lang">${escapeHtml(s.lang)}</span>
              <h4>${escapeHtml(s.title)}</h4>
            </a>`,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section>
      <div class="section-heading" data-reveal><span class="kicker-num">03</span><h2>${strings.contact.heading}</h2><div class="rule"></div></div>
      <a class="cv-btn" href="${hrefFor(base, "contact")}" data-link data-reveal>${strings.contact.heading} <span class="go">↗</span></a>
    </section>
  `;
}

export function renderWorkIndexPage(strings, projects, competitions, comingSoon, base) {
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.work.heading}</h1><div class="rule"></div></div>
      <div class="project-grid">
        ${projects.map((p, i) => projectCard(p, base, i)).join("")}
      </div>

      <div style="margin-top:4.5rem" data-reveal>
        <h3>${strings.work.competitionsHeading}</h3>
        <ul class="list-simple">
          ${competitions
            .map(
              (c) =>
                `<li><span>${escapeHtml(c.title)} — ${escapeHtml(c.brand)}</span><span class="award">${escapeHtml(c.award)}</span></li>`,
            )
            .join("")}
        </ul>
      </div>

      <div style="margin-top:3rem" data-reveal>
        <h3>${strings.work.comingSoonHeading}</h3>
        <div class="chips">${comingSoon.map((c) => `<span>${escapeHtml(c)}</span>`).join("")}</div>
      </div>
    </section>
  `;
}

export function renderProjectPage(strings, projects, id, base) {
  const p = projects.find((x) => x.id === id);
  if (!p) return renderNotFoundPage(strings, base);
  const index = projects.findIndex((x) => x.id === id);
  return `
    <section class="project-detail">
      <a class="back-link" href="${hrefFor(base, "work")}" data-link><span class="arrow">←</span> ${strings.work.back}</a>
      <span class="kicker">${escapeHtml(p.brand)} · ${escapeHtml(p.agency)}</span>
      <h1 class="split-title">${splitWords(p.title)}</h1>
      ${p.tag ? `<p style="color:var(--text-muted)">${escapeHtml(p.tag)}</p>` : ""}
      <div class="hero-plate">
        <span class="plate-index">${pad2(index)}</span>
        <p class="plate-line">${escapeHtml(plateFor(p))}</p>
      </div>
      <p class="lede">${escapeHtml(p.summary)}</p>
      ${p.body.map((b) => `<p class="body-copy" data-reveal>${b}</p>`).join("")}
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:2rem">${strings.work.agency} ${escapeHtml(p.agency)}</p>
      ${p.recognition ? `<div class="recognition" data-reveal>${escapeHtml(p.recognition)}</div>` : ""}
    </section>
  `;
}

export function renderStoriesIndexPage(strings, stories, base) {
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.stories.heading}</h1><div class="rule"></div></div>
      <p style="color:var(--text-muted);margin-bottom:2.5rem" data-reveal>${strings.stories.subheading}</p>
      <div class="story-grid">
        ${stories
          .map(
            (s, i) => `
          <a href="${hrefFor(base, "story", s.id)}" data-link class="story-card" data-reveal style="--i:${i}">
            <span class="lang">${escapeHtml(s.lang)}</span>
            <h4>${escapeHtml(s.title)}</h4>
            <p class="story-excerpt">${escapeHtml(excerpt(s.content, 110))}</p>
          </a>`,
          )
          .join("")}
      </div>
    </section>
  `;
}

export function renderStoryPage(strings, stories, id, base) {
  const s = stories.find((x) => x.id === id);
  if (!s) return renderNotFoundPage(strings, base);

  // Same piece, four languages — offer an in-place morph between them rather
  // than making the reader navigate back out to the index.
  const group = storyGroupFor(id);
  const siblings = group
    ? group.storyIds.map((sid) => stories.find((x) => x.id === sid)).filter(Boolean)
    : [];

  const switcher =
    siblings.length > 1
      ? `<div class="story-langs" role="tablist">
          ${siblings
            .map(
              (
                sib,
              ) => `<button type="button" role="tab" class="story-lang ${sib.id === id ? "active" : ""}"
                data-story-lang="${sib.id}" aria-selected="${sib.id === id}"
                >${escapeHtml(sib.lang)}</button>`,
            )
            .join("")}
        </div>`
      : "";

  return `
    <section class="project-detail story-page">
      <a class="back-link" href="${hrefFor(base, "stories")}" data-link><span class="arrow">←</span> ${strings.stories.heading}</a>
      <span class="kicker" id="story-kicker">${escapeHtml(s.lang)}</span>
      <h1 class="split-title" id="story-title">${splitWords(s.title)}</h1>
      ${switcher}
      <div class="story-body" id="story-body">${s.content}</div>
    </section>
  `;
}

export function renderContactPage(strings, contact) {
  const behanceHandle = contact.behance.replace(/^.*behance\.net\//, "");
  const instagramHandle = "@" + contact.instagram.replace(/^.*instagram\.com\//, "");
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.contact.heading}</h1><div class="rule"></div></div>
      <div class="contact-list" data-reveal>
        <div class="contact-row">
          <span>${strings.contact.emailLabel}</span>
          <a href="mailto:${contact.email}">${contact.email}</a>
        </div>
        <div class="contact-row">
          <span>${strings.contact.phoneLabel}</span>
          <a href="https://wa.me/${contact.whatsapp}" target="_blank" rel="noopener noreferrer">
            ${contact.phone} <span class="contact-hint">WhatsApp ↗</span>
          </a>
        </div>
        <div class="contact-row">
          <span>Behance</span>
          <a href="${contact.behance}" target="_blank" rel="noopener noreferrer">${escapeHtml(behanceHandle)} ↗</a>
        </div>
        <div class="contact-row">
          <span>Instagram</span>
          <a href="${contact.instagram}" target="_blank" rel="noopener noreferrer">${escapeHtml(instagramHandle)} ↗</a>
        </div>
      </div>
      ${
        contact.cv
          ? `<a class="cv-btn" href="${contact.cv}" target="_blank" rel="noopener noreferrer" data-reveal>${strings.contact.cv} <span class="go">↗</span></a>`
          : ""
      }
    </section>
  `;
}

export function renderNotFoundPage(strings, base) {
  return `
    <section>
      <h1>404</h1>
      <p>Page not found.</p>
      <a class="back-link" href="${hrefFor(base, "home")}" data-link><span class="arrow">←</span> ${strings.nav.home}</a>
    </section>
  `;
}

export function renderPage(route, strings, ctx) {
  switch (route.page) {
    case "home":
      return renderHomePage(
        strings,
        ctx.projects,
        ctx.stories,
        ctx.profilePicSrc,
        ctx.munariPicSrc,
        ctx.base,
      );
    case "work":
      return renderWorkIndexPage(
        strings,
        ctx.projects,
        ctx.competitions,
        ctx.comingSoon,
        ctx.base,
      );
    case "project":
      return renderProjectPage(strings, ctx.projects, route.id, ctx.base);
    case "stories":
      return renderStoriesIndexPage(strings, ctx.stories, ctx.base);
    case "story":
      return renderStoryPage(strings, ctx.stories, route.id, ctx.base);
    case "contact":
      return renderContactPage(strings, ctx.contact);
    default:
      return renderNotFoundPage(strings, ctx.base);
  }
}

export function renderFooter(strings) {
  return `<footer>© ${new Date().getFullYear()} Ludovica Inés Piro. ${strings.footer.rights}</footer>`;
}
