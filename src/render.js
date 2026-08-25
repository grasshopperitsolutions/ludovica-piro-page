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

// Never empty: works still awaiting copy fall back to their own title so the
// tile and the hover preview stay legible instead of rendering a blank plate.
export function plateFor(project) {
  return PLATE_LINES[project.id] || project.summary || project.title;
}

// True only when there's a real line to set large — the title alone would just
// repeat the <h1> directly above the detail-page plate.
function hasPlateLine(project) {
  return Boolean(PLATE_LINES[project.id] || project.summary);
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
  if (segs[0] === "about" && segs.length === 1) return { page: "about" };
  if (segs[0] === "competitions" && segs.length === 1) return { page: "competitions" };
  if (segs[0] === "stories") {
    return segs[1] ? { page: "story", id: segs[1] } : { page: "stories" };
  }
  return { page: "notfound" };
}

export function buildPath(page, id) {
  switch (page) {
    case "home":
      return "/";
    case "about":
      return "/about";
    case "work":
      return "/work";
    case "project":
      return `/work/${id}`;
    case "competitions":
      return "/competitions";
    case "stories":
      return "/stories";
    case "story":
      return `/stories/${id}`;
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
    case "about":
      return {
        title: `${strings.nav.about} — ${site}`,
        description: strings.about.bio[0].join(" "),
      };
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
    case "competitions":
      return {
        title: `${strings.nav.competitions} — ${site}`,
        description: strings.competitions.subheading,
      };
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
    default:
      return { title: `Page not found — ${site}`, description: "" };
  }
}

/* ---------------------------------------------------------------------------
   Navigation — a dock pinned to the top, identical on desktop and mobile.
   The pill always shows the brand mark, the current section and the theme
   picker; tapping it drops a panel with the full index. On wider screens the
   section links also sit inline in the pill so they're visible without opening
   anything.
   --------------------------------------------------------------------------- */

// Inline SVG so it inherits currentColor and needs no extra request.
const HOME_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 10.4 12 3.2l9 7.2"/><path d="M5.6 9.4V20.4h12.8V9.4"/></svg>`;

// Contact isn't a section: it lives at the foot of the home page, so it has no
// nav entry and no route of its own.
const SECTIONS = [
  { page: "about", key: "about" },
  { page: "work", key: "work" },
  { page: "competitions", key: "competitions" },
  { page: "stories", key: "stories" },
];

// Which top-level section a given route belongs to.
function sectionOf(page) {
  if (page === "project") return "work";
  if (page === "story") return "stories";
  return page;
}

function isSectionActive(route, key) {
  return sectionOf(route.page) === key;
}

function navWorkList(projects, route, base) {
  return projects
    .map((p) => {
      const active = route.page === "project" && route.id === p.id;
      return `<a href="${hrefFor(base, "project", p.id)}" data-link class="nav-sub-link ${active ? "active" : ""}"
        data-preview data-preview-title="${escapeHtml(p.title)}"
        data-preview-quote="${escapeHtml(plateFor(p))}"
        data-preview-sub="${escapeHtml(p.brand)}"
      ><span class="nav-label">${escapeHtml(p.title)}</span></a>`;
    })
    .join("");
}

function navStoryList(stories, route, base) {
  return stories
    .map((s) => {
      const active = route.page === "story" && route.id === s.id;
      return `<a href="${hrefFor(base, "story", s.id)}" data-link data-scramble class="nav-sub-link ${active ? "active" : ""}"
        data-preview data-preview-title="${escapeHtml(s.title)}"
        data-preview-quote="${escapeHtml(excerpt(s.content, 80))}"
        data-preview-sub="${escapeHtml(s.lang)}"
      ><span class="nav-num">${escapeHtml(s.lang)}</span><span class="nav-label">${escapeHtml(s.title)}</span></a>`;
    })
    .join("");
}

function navPersonalList(competitions, base) {
  return competitions
    .map(
      (c) =>
        `<a href="${hrefFor(base, "competitions")}" data-link class="nav-sub-link"
        data-preview data-preview-title="${escapeHtml(c.title)}"
        data-preview-quote="${escapeHtml(c.title)} — ${escapeHtml(c.brand)}"
        data-preview-sub="${escapeHtml(c.award)}"
      ><span class="nav-label">${escapeHtml(c.title)}</span></a>`,
    )
    .join("");
}

function themePicker(theme, isDark, strings) {
  const icons = { light: "☀", dark: "☾", auto: "◐" };
  const order = ["light", "dark", "auto"];
  return `
    <div class="menu-dropdown" data-theme-dropdown>
      <button type="button" class="menu-trigger" id="theme-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="${strings.theme[theme] || strings.theme.auto}">
        <span class="theme-glyph">${icons[theme] || (isDark ? "☾" : "☀")}</span>
      </button>
      <ul class="menu-list" role="listbox" id="theme-menu">
        ${order
          .map(
            (key) => `
          <li role="option" class="menu-option ${key === theme ? "active" : ""}" data-theme-option="${key}" aria-selected="${key === theme}">
            <span class="menu-option-code">${icons[key]}</span>
            <span class="menu-option-name">${strings.theme[key]}</span>
          </li>`,
          )
          .join("")}
      </ul>
    </div>
  `;
}

export function renderChrome({
  strings,
  route,
  projects,
  stories,
  competitions,
  theme,
  isDark,
  base,
}) {
  const currentKey = sectionOf(route.page);
  const currentLabel =
    strings.navShort[currentKey] || strings.nav[currentKey] || strings.nav.home;

  const inlineLinks = SECTIONS.map(
    (s) =>
      `<a href="${hrefFor(base, s.page)}" data-link class="topnav-link ${isSectionActive(route, s.key) ? "active" : ""}">${strings.nav[s.key]}</a>`,
  ).join("");

  const homeLink = `
    <a href="${hrefFor(base, "home")}" data-link
       class="topnav-home ${isSectionActive(route, "home") ? "active" : ""}"
       aria-label="${strings.nav.home}" title="${strings.nav.home}">
      ${HOME_ICON}
    </a>`;

  return `
    <div class="grain" aria-hidden="true"></div>
    <!-- Temporary: palette comparison for the brief's red/white question.
         Remove with src/palette-prototype.css once a palette is chosen. -->
    <div class="palette-switch" id="palette-switch" role="group" aria-label="Palette">
      <button type="button" class="palette-swatch palette-swatch--mono" data-accent-option="mono" aria-label="Black and white" title="Black and white"></button>
      <button type="button" class="palette-swatch palette-swatch--red" data-accent-option="red" aria-label="Red and white" title="Red and white"></button>
    </div>
    <header class="topnav">
      <div class="topnav-pill">
        <button type="button" class="topnav-brand" id="nav-toggle"
          aria-label="${strings.nav.open}" aria-expanded="false" aria-controls="nav-panel">
          <span class="brand-mark">L</span>
        </button>
        ${homeLink}
        <nav class="topnav-links">${inlineLinks}</nav>
        <span class="topnav-current">${escapeHtml(currentLabel)}</span>
        ${themePicker(theme, isDark, strings)}
      </div>

      <div class="topnav-panel" id="nav-panel">
        <div class="topnav-panel-inner">
          <div class="nav-group">
            <a href="${hrefFor(base, "home")}" data-link class="nav-top-link ${isSectionActive(route, "home") ? "active" : ""}">${strings.nav.home}</a>
            <div class="nav-sub-list">
              <a href="${hrefFor(base, "about")}" data-link class="nav-sub-link ${isSectionActive(route, "about") ? "active" : ""}"><span class="nav-label">${strings.nav.about}</span></a>
            </div>
          </div>
          <div class="nav-group">
            <a href="${hrefFor(base, "work")}" data-link class="nav-top-link ${isSectionActive(route, "work") ? "active" : ""}">${strings.nav.work}</a>
            <div class="nav-sub-list">${navWorkList(projects, route, base)}</div>
          </div>
          <div class="nav-group">
            <a href="${hrefFor(base, "competitions")}" data-link class="nav-top-link ${isSectionActive(route, "competitions") ? "active" : ""}">${strings.nav.competitions}</a>
            <div class="nav-sub-list">${navPersonalList(competitions, base)}</div>
          </div>
          <div class="nav-group">
            <a href="${hrefFor(base, "stories")}" data-link class="nav-top-link ${isSectionActive(route, "stories") ? "active" : ""}">${strings.nav.stories}</a>
            <div class="nav-sub-list">${navStoryList(stories, route, base)}</div>
          </div>
        </div>
      </div>
    </header>
    <div class="nav-scrim" id="nav-scrim"></div>
    <div class="hover-preview" id="hover-preview" aria-hidden="true">
      <p class="hover-quote"></p>
      <span class="hover-meta"></span>
    </div>
  `;
}

/* ---------------------------------------------------------------------------
   Pages
   --------------------------------------------------------------------------- */

// Work media lives in public/ so the same URL resolves in the browser and in
// the Node prerenderer — see scripts/optimize-assets.mjs.
export function mediaUrl(base, file) {
  const b = (base || "/").replace(/\/+$/, "");
  return `${b}/work/${file}`;
}

// Marks entries that are still waiting on content from Ludovica. Visible on
// purpose while the site is private.
function needsInfoBadge(strings, note) {
  if (!note) return "";
  return `<p class="needs-info" role="note"><span class="needs-info-tag">⚠ ${escapeHtml(strings.needsInfoLabel)}</span> ${escapeHtml(note)}</p>`;
}

function projectCard(p, base, index) {
  // A photo when there is one, otherwise the typographic plate — which already
  // reads as deliberate, so nothing looks like a missing asset.
  const visual = p.images?.length
    ? `<div class="project-plate project-plate--image">
         <img src="${mediaUrl(base, p.images[0])}" alt="${escapeHtml(p.title)}" loading="lazy" />
       </div>`
    : `<div class="project-plate">
         <span class="plate-index">${String(index + 1).padStart(2, "0")}</span>
         <p class="plate-line">${escapeHtml(plateFor(p))}</p>
         <span class="plate-rule"></span>
       </div>`;
  return `
    <a href="${hrefFor(base, "project", p.id)}" data-link class="project-card ${p.needsInfo ? "is-incomplete" : ""}" data-reveal style="--i:${index % 6}">
      ${visual}
      <h3>${escapeHtml(p.title)}</h3>
      <div class="brand-line"><span>${escapeHtml(p.brand)} · ${escapeHtml(p.agency)}</span><span class="go">↗</span></div>
    </a>`;
}

// The landing page leads with images and her own words rather than a wall of
// text — the photos and the two quotes are above the fold, and the whole intro
// is deliberately compact.
export function renderHomePage(
  strings,
  projects,
  stories,
  profilePicSrc,
  munariPicSrc,
  base,
  contact,
) {
  return `
    <section class="intro" id="home">
      <div class="intro-text">
        <h1 class="intro-title">${splitWords(strings.hero.greeting)}</h1>
        <p class="intro-role">
          ${escapeHtml(strings.hero.role)}<br />
          ${escapeHtml(strings.hero.tagline)}
        </p>
        ${strings.about.paragraphs
          .map(
            (lines, i) =>
              `<p class="intro-para${i === 0 ? " intro-para--lead" : ""}">${lines
                .map((l) => escapeHtml(l))
                .join("<br />")}</p>`,
          )
          .join("")}
        <div class="meta-row">
          <div><span>${strings.about.languagesLabel}</span>${strings.about.languagesValue}</div>
          <div><span>${strings.about.expertiseLabel}</span>${strings.about.expertiseValue}</div>
        </div>
      </div>

      <figure class="intro-figures">
        <div class="intro-figure">
          <img src="${profilePicSrc}" alt="${escapeHtml(strings.about.profileAlt)}" fetchpriority="high" />
        </div>
        <div class="intro-figure">
          <img src="${munariPicSrc}" alt="${escapeHtml(strings.about.munariAlt)}" loading="lazy" />
        </div>
        <figcaption class="intro-caption">
          ${strings.about.caption.join("<br />")}
        </figcaption>
      </figure>
    </section>

    <section>
      <div class="section-heading" data-reveal><span class="kicker-num">01</span><h2>${strings.work.heading}</h2><div class="rule"></div></div>
      <div class="project-grid">
        ${projects
          .slice(0, 3)
          .map((p, i) => projectCard(p, base, i))
          .join("")}
      </div>
      <a class="text-link" href="${hrefFor(base, "work")}" data-link data-reveal>${strings.work.seeAll} <span class="go">↗</span></a>
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

    ${renderContactBlock(strings, contact, "03")}
  `;
}

export function renderWorkIndexPage(strings, projects, base) {
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.work.heading}</h1><div class="rule"></div></div>
      <div class="project-grid">
        ${projects.map((p, i) => projectCard(p, base, i)).join("")}
      </div>
    </section>
  `;
}

export function renderCompetitionsPage(strings, competitions) {
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.competitions.heading}</h1><div class="rule"></div></div>
      <p class="lede" data-reveal>${strings.competitions.subheading}</p>

      <ul class="list-simple" data-reveal>
        ${competitions
          .map(
            (c) =>
              `<li>
                <span>${escapeHtml(c.title)}${c.format ? ` <em class="cv-meta">${escapeHtml(c.format)}</em>` : ""} — ${escapeHtml(c.brand)}</span>
                <span class="award">${escapeHtml(c.award)}</span>
              </li>`,
          )
          .join("")}
      </ul>
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
      ${needsInfoBadge(strings, p.needsInfo)}
      ${
        hasPlateLine(p)
          ? `<div class="hero-plate">
        <span class="plate-index">${String(index + 1).padStart(2, "0")}</span>
        <p class="plate-line">${escapeHtml(plateFor(p))}</p>
      </div>`
          : ""
      }
      ${p.summary ? `<p class="lede">${escapeHtml(p.summary)}</p>` : ""}
      ${p.body.map((b) => `<p class="body-copy" data-reveal>${b}</p>`).join("")}
      ${
        p.images?.length
          ? `<div class="work-media" data-reveal>${p.images
              .map(
                (img) =>
                  `<figure><img src="${mediaUrl(base, img)}" alt="${escapeHtml(p.title)}" loading="lazy" /></figure>`,
              )
              .join("")}</div>`
          : ""
      }
      ${
        p.downloads?.length
          ? `<p class="work-downloads">${p.downloads
              .map(
                (d) =>
                  `<a href="${mediaUrl(base, d.file)}" target="_blank" rel="noopener noreferrer">${escapeHtml(d.label)} ↗</a>`,
              )
              .join(" · ")}</p>`
          : ""
      }
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:2rem">${strings.work.agency} ${escapeHtml(p.agency)}</p>
      ${p.recognition ? `<div class="recognition" data-reveal>${escapeHtml(p.recognition)}</div>` : ""}
    </section>
  `;
}

export function renderAboutPage(strings, cv, profilePicSrc, munariPicSrc) {
  const a = strings.about;
  const line = (arr) => arr.map((l) => escapeHtml(l)).join("<br />");

  return `
    <section>
      <div class="section-heading" data-reveal><h1>${a.heading}</h1><div class="rule"></div></div>

      <div class="about-lead" data-reveal>
        <h2 class="about-hey">${escapeHtml(a.bioHeading)}</h2>
        ${a.bio.map((p) => `<p class="intro-para">${line(p)}</p>`).join("")}
        ${a.paragraphs.map((p, i) => `<p class="intro-para${i === 0 ? " intro-para--lead" : ""}">${line(p)}</p>`).join("")}
      </div>

      <figure class="intro-figures" data-reveal>
        <div class="intro-figure"><img src="${profilePicSrc}" alt="${escapeHtml(a.profileAlt)}" loading="lazy" /></div>
        <div class="intro-figure"><img src="${munariPicSrc}" alt="${escapeHtml(a.munariAlt)}" loading="lazy" /></div>
        <figcaption class="intro-caption">${a.caption.join("<br />")}</figcaption>
      </figure>

      <div class="cv-block" data-reveal>
        <h3>${a.educationHeading}</h3>
        <ul class="list-simple">
          ${cv.education
            .map(
              (e) => `<li>
                <span>${escapeHtml(e.school)}${e.detail ? ` — ${escapeHtml(e.detail)}` : ""}</span>
                ${e.dates ? `<span class="award">${escapeHtml(e.dates)}</span>` : ""}
              </li>`,
            )
            .join("")}
        </ul>
      </div>

      <div class="cv-block" data-reveal>
        <h3>${a.experienceHeading}</h3>
        <ul class="cv-list">
          ${cv.experience
            .map(
              (e) => `<li class="cv-entry">
                <div class="cv-entry-head">
                  <span class="cv-agency">${escapeHtml(e.agency)}</span>
                  ${e.dates ? `<span class="award">${escapeHtml(e.dates)}</span>` : ""}
                </div>
                <span class="cv-role">${escapeHtml(e.role)}</span>
                ${e.clients ? `<span class="cv-meta"><em>${escapeHtml(a.clientsLabel)}:</em> ${escapeHtml(e.clients)}</span>` : ""}
                ${e.pitches ? `<span class="cv-meta"><em>${escapeHtml(a.pitchesLabel)}:</em> ${escapeHtml(e.pitches)}</span>` : ""}
              </li>`,
            )
            .join("")}
        </ul>
      </div>

      <div class="cv-block" data-reveal>
        <h3>${a.recognitionsHeading}</h3>
        <h4 class="cv-subhead">${a.recognitionsPersonal}</h4>
        <ul class="list-simple">
          ${cv.recognitions.personal.map((r) => `<li><span>${escapeHtml(r)}</span></li>`).join("")}
        </ul>
        <h4 class="cv-subhead">${a.recognitionsAgencies}</h4>
        <ul class="list-simple">
          ${cv.recognitions.agencies.map((r) => `<li><span>${escapeHtml(r)}</span></li>`).join("")}
        </ul>
      </div>
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
  // than making the reader navigate back out to the index. The *interface* is
  // English-only; this is content.
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

// Rendered at the foot of the home page rather than on a route of its own.
export function renderContactBlock(strings, contact, kickerNum = "") {
  const behanceHandle = contact.behance.replace(/^.*behance\.net\//, "");
  const instagramHandle = "@" + contact.instagram.replace(/^.*instagram\.com\//, "");
  // LinkedIn vanity slugs carry a trailing id ("ludovica-piro-55327116a");
  // drop it so the row reads like the other handles.
  const linkedinHandle = contact.linkedin
    .replace(/^.*linkedin\.com\/in\//, "")
    .replace(/\/+$/, "")
    .replace(/-[0-9a-z]{6,}$/, "");
  const spotifyHandle = contact.spotify
    .replace(/^.*spotify\.com\/user\//, "")
    .replace(/[?/].*$/, "");

  // Until a real CV URL exists the button is shown but inert, carrying a
  // tooltip instead of a dead link.
  const cvBlock = contact.cv
    ? `<a class="cv-btn" href="${contact.cv}" target="_blank" rel="noopener noreferrer" data-reveal>${strings.contact.cv} <span class="go">↗</span></a>`
    : `<span class="cv-btn cv-btn--pending" data-tooltip="${escapeHtml(strings.contact.cvPending)}" aria-disabled="true" data-reveal>${strings.contact.cv} <span class="go">↗</span></span>`;

  return `
    <section id="contact">
      <div class="section-heading" data-reveal>
        ${kickerNum ? `<span class="kicker-num">${kickerNum}</span>` : ""}
        <h2>${strings.contact.heading}</h2>
        <div class="rule"></div>
      </div>
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
          <span>LinkedIn</span>
          <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkedinHandle)} ↗</a>
        </div>
        <div class="contact-row">
          <span>Behance</span>
          <a href="${contact.behance}" target="_blank" rel="noopener noreferrer">${escapeHtml(behanceHandle)} ↗</a>
        </div>
        <div class="contact-row">
          <span>Instagram</span>
          <a href="${contact.instagram}" target="_blank" rel="noopener noreferrer">${escapeHtml(instagramHandle)} ↗</a>
        </div>
        <div class="contact-row">
          <span>Spotify</span>
          <a href="${contact.spotify}" target="_blank" rel="noopener noreferrer">${escapeHtml(spotifyHandle)} ↗</a>
        </div>
      </div>
      ${cvBlock}
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
        ctx.contact,
      );
    case "about":
      return renderAboutPage(strings, ctx.cv, ctx.profilePicSrc, ctx.munariPicSrc);
    case "work":
      return renderWorkIndexPage(strings, ctx.projects, ctx.base);
    case "competitions":
      return renderCompetitionsPage(strings, ctx.competitions);
    case "project":
      return renderProjectPage(strings, ctx.projects, route.id, ctx.base);
    case "stories":
      return renderStoriesIndexPage(strings, ctx.stories, ctx.base);
    case "story":
      return renderStoryPage(strings, ctx.stories, route.id, ctx.base);
    default:
      return renderNotFoundPage(strings, ctx.base);
  }
}

export function renderFooter(strings) {
  return `<footer>© ${new Date().getFullYear()} Ludovica Inés Piro. ${strings.footer.rights}</footer>`;
}
