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

import { PLATE_LINES, STORY_GROUPS, storyGroupFor } from "./data.js";

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
   Navigation — a single flat bar in the top-left corner, the same at every
   width. The "L" is the home link, then the four sections, then the theme
   picker. There is no dropdown and no nested index: individual works and
   stories are reached from their own section page, not from the nav.
   --------------------------------------------------------------------------- */

// Paeonia 'Ludovica', in two states. The filled bloom is the light theme; the
// line drawing is the dark one. Both are decorative and hidden from assistive
// tech — the button itself carries the label.
const FLOWER_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
  <path d="M 15 35 C 5 15 45 0 65 15 C 85 0 95 30 85 50 C 95 70 75 95 55 85 C 35 100 5 80 15 60 C 0 45 5 25 15 35 Z" fill="#E85D75" />
  <path d="M 25 40 C 15 25 45 10 60 25 C 75 10 90 35 80 50 C 90 70 65 90 50 75 C 30 90 15 70 25 55 C 10 45 15 30 25 40 Z" fill="#FF8C94" />
  <path d="M 35 45 C 25 35 50 20 60 35 C 70 20 80 40 70 55 C 80 65 60 80 50 65 C 35 75 25 60 35 50 Z" fill="#FFAAA5" />
  <path d="M 40 50 C 35 40 50 30 55 40 C 65 35 70 50 60 55 C 65 65 50 70 45 60 Z" fill="#FFD3B6" />
  <circle cx="50" cy="50" r="10" fill="#FFC300" />
  <circle cx="50" cy="50" r="10" fill="none" stroke="#E59400" stroke-width="2" stroke-dasharray="2 4" />
  <circle cx="50" cy="50" r="4" fill="#FF5277" opacity="0.8" />
</svg>`;

const FLOWER_DARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 50 20 C 35 5, 10 15, 15 35 C 18 45, 25 50, 30 55" />
    <path d="M 50 20 C 70 5, 90 20, 85 40 C 82 50, 75 55, 70 60" />
    <path d="M 15 35 C 5 50, 15 80, 35 85 C 45 88, 50 82, 55 75" />
    <path d="M 85 40 C 95 60, 80 85, 60 85 C 55 85, 52 80, 50 75" />
    <path d="M 30 55 C 20 70, 40 95, 60 70" />
    <path d="M 70 60 C 85 75, 55 95, 45 70" />
    <path d="M 35 40 C 25 25, 55 15, 65 35" />
    <path d="M 40 60 C 35 45, 50 35, 60 50" />
    <path d="M 60 65 C 70 50, 55 40, 45 55" />
    <circle cx="50" cy="50" r="2" fill="currentColor" />
    <path d="M 50 50 L 46 45 M 50 50 L 55 46 M 50 50 L 56 53 M 50 50 L 51 57 M 50 50 L 45 55 M 50 50 L 43 51" />
    <circle cx="45" cy="44" r="1.5" />
    <circle cx="56" cy="45" r="1.5" />
    <circle cx="57" cy="54" r="1.5" />
    <circle cx="51" cy="59" r="1.5" />
    <circle cx="44" cy="56" r="1.5" />
    <circle cx="41" cy="50" r="1.5" />
  </g>
</svg>`;

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

// One button, one job: click it and the theme flips. Both blooms are in the
// markup and CSS shows whichever matches the current theme, so a flip is a
// pure attribute change with nothing to re-render.
function themeToggle(isDark, strings) {
  return `
    <button type="button" class="menu-trigger flower-trigger" id="theme-toggle" data-theme-toggle
      aria-pressed="${isDark}" aria-label="${isDark ? strings.theme.toLight : strings.theme.toDark}"
      data-tooltip="${escapeHtml(strings.theme.flowerName)}">
      <span class="flower flower--light">${FLOWER_LIGHT}</span>
      <span class="flower flower--dark">${FLOWER_DARK}</span>
    </button>
  `;
}

export function renderChrome({ strings, route, isDark, base }) {
  // Rendered as one comma-separated line, the way she writes it — the commas
  // are punctuation between the links, not separate links, so they sit outside
  // the anchors and are hidden from assistive tech.
  const links = SECTIONS.map(
    (s, i) =>
      `${i ? '<span class="topnav-sep" aria-hidden="true">, </span>' : ""}<a href="${hrefFor(base, s.page)}" data-link class="topnav-link ${isSectionActive(route, s.key) ? "active" : ""}"><span class="nav-full">${strings.nav[s.key]}</span><span class="nav-short">${strings.navShort[s.key] || strings.nav[s.key]}</span></a>`,
  ).join("");

  return `
    <div class="grain" aria-hidden="true"></div>
    <!-- Temporary: palette comparison for the brief's red/white question.
         Remove with src/palette-prototype.css once a palette is chosen. -->
    <div class="palette-switch" id="palette-switch" role="group" aria-label="Palette">
      <button type="button" class="palette-swatch palette-swatch--mono" data-accent-option="mono" aria-label="Black and white" title="Black and white"></button>
      <button type="button" class="palette-swatch palette-swatch--red" data-accent-option="red" aria-label="Red and white" title="Red and white"></button>
    </div>
    <header class="topnav">
      <div class="topnav-bar">
        <div class="topnav-stack">
          <a href="${hrefFor(base, "home")}" data-link class="topnav-name ${isSectionActive(route, "home") ? "active" : ""}">Ludovica Inés Piro</a>
          <nav class="topnav-links">${links}</nav>
        </div>
      </div>
      ${themeToggle(isDark, strings)}
    </header>
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

// The landing page is deliberately bare: her name and the menu top-left, one
// centred column with the greeting and the two pictures, and the contacts in
// the bottom-left corner. Everything else — the bio, the work index, the
// stories — lives on its own page.
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
    <section class="home-simple" id="home">
      <div class="home-center">
        <h1 class="intro-title">${splitWords(strings.hero.greeting)}</h1>
        <p class="intro-role">
          ${escapeHtml(strings.hero.role)}<br />
          ${escapeHtml(strings.hero.tagline)}
        </p>

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
      </div>

      ${renderHomeContacts(strings, contact)}
    </section>
  `;
}

// One quiet line of links in the bottom-left corner — no headings, no rows.
function renderHomeContacts(strings, contact) {
  const cv = contact.cv
    ? `<a href="${contact.cv}" target="_blank" rel="noopener noreferrer">${strings.contact.cvShort}</a>`
    : `<span class="cv-btn--pending" data-tooltip="${escapeHtml(strings.contact.cvPending)}" aria-disabled="true">${strings.contact.cvShort}</span>`;

  const links = [
    cv,
    `<a href="mailto:${contact.email}">${strings.contact.emailLabel}</a>`,
    `<a href="https://wa.me/${contact.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`,
    `<a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
    `<a href="${contact.behance}" target="_blank" rel="noopener noreferrer">Behance</a>`,
    `<a href="${contact.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>`,
    `<a href="${contact.spotify}" target="_blank" rel="noopener noreferrer">Spotify</a>`,
  ];

  return `<nav class="home-contacts" aria-label="${strings.contact.heading}">${links.join("")}</nav>`;
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

export function renderAboutPage(strings, cv, gallery, base) {
  const a = strings.about;
  const line = (arr) => arr.map((l) => escapeHtml(l)).join("<br />");

  return `
    <section class="about-page">
      <div class="section-heading" data-reveal><h1>${a.heading}</h1><div class="rule"></div></div>

      <div class="about-lead" data-reveal>
        <h2 class="about-hey">${escapeHtml(a.bioHeading)}</h2>
        ${a.bio.map((p) => `<p class="intro-para">${line(p)}</p>`).join("")}
        ${a.paragraphs.map((p, i) => `<p class="intro-para${i === 0 ? " intro-para--lead" : ""}">${line(p)}</p>`).join("")}
      </div>

      ${renderAboutGallery(strings, gallery, base)}

      ${renderCvColumns(strings, cv)}
    </section>
  `;
}

// The award boards, full width, one under another — scrolling past the text
// lands you in the pictures. Anything without confirmed copy says so out loud.
function renderAboutGallery(strings, gallery, base) {
  if (!gallery?.length) return "";
  return `
    <div class="about-gallery">
      ${gallery
        .map(
          (g, i) => `
        <figure class="about-shot" data-reveal style="--i:${i % 4}">
          <img src="${mediaUrl(base, g.file)}" alt="${escapeHtml(g.title)}" loading="lazy" />
          <figcaption>
            <span class="about-shot-title">${escapeHtml(g.title)}</span>
            <span class="about-shot-note${g.caption === "missing text" ? " is-missing" : ""}">${escapeHtml(g.caption)}</span>
          </figcaption>
        </figure>`,
        )
        .join("")}
    </div>
  `;
}

// Education / Experience / Recognitions side by side, in the brief's own order
// and layout. Collapses to one column on a phone.
function renderCvColumns(strings, cv) {
  const a = strings.about;

  const education = cv.education
    .map(
      (e) => `<li class="cv-item">
        <span class="cv-item-name">${escapeHtml(e.school)}</span>
        ${e.detail ? `<span class="cv-item-detail">${escapeHtml(e.detail)}</span>` : ""}
        ${e.dates ? `<span class="cv-item-dates">${escapeHtml(e.dates)}</span>` : ""}
      </li>`,
    )
    .join("");

  const experience = cv.experience
    .map(
      (e) => `<li class="cv-item">
        <span class="cv-item-name">${escapeHtml(e.agency)}</span>
        <span class="cv-item-detail">${escapeHtml(e.role)}</span>
        ${e.dates ? `<span class="cv-item-dates">${escapeHtml(e.dates)}</span>` : ""}
        ${e.clients ? `<span class="cv-item-meta">${escapeHtml(a.clientsLabel)}: ${escapeHtml(e.clients)}</span>` : ""}
        ${e.pitches ? `<span class="cv-item-meta">${escapeHtml(a.pitchesLabel)}: ${escapeHtml(e.pitches)}</span>` : ""}
      </li>`,
    )
    .join("");

  const recognitionList = (items) =>
    items.map((r) => `<li class="cv-item"><span>${escapeHtml(r)}</span></li>`).join("");

  return `
    <div class="cv-columns" data-reveal>
      <div class="cv-column">
        <h3 class="cv-column-head">${a.educationHeading}</h3>
        <ul class="cv-items">${education}</ul>
      </div>
      <div class="cv-column">
        <h3 class="cv-column-head">${a.experienceHeading}</h3>
        <ul class="cv-items">${experience}</ul>
      </div>
      <div class="cv-column">
        <h3 class="cv-column-head">${a.recognitionsHeading}</h3>
        <h4 class="cv-subhead">${a.recognitionsPersonal}</h4>
        <ul class="cv-items">${recognitionList(cv.recognitions.personal)}</ul>
        <h4 class="cv-subhead">${a.recognitionsAgencies}</h4>
        <ul class="cv-items">${recognitionList(cv.recognitions.agencies)}</ul>
      </div>
    </div>
  `;
}

// One card per *piece*, not per translation — each story exists in four
// languages, and listing all four separately would quadruple the index as more
// stories arrive. The card links into the language it was written in and the
// story page morphs between the rest.
export function renderStoriesIndexPage(strings, stories, base) {
  const cards = STORY_GROUPS.map((group, i) => {
    const versions = group.storyIds
      .map((id) => stories.find((x) => x.id === id))
      .filter(Boolean);
    if (!versions.length) return "";
    const lead = versions[0];
    return `
      <a href="${hrefFor(base, "story", lead.id)}" data-link class="story-card" data-reveal style="--i:${i}">
        <span class="story-langs-line">${versions.map((v) => `<span class="lang">${escapeHtml(v.lang)}</span>`).join("")}</span>
        <h4>${escapeHtml(group.title || lead.title)}</h4>
        <p class="story-excerpt">${escapeHtml(excerpt(lead.content, 110))}</p>
      </a>`;
  }).join("");

  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.stories.heading}</h1><div class="rule"></div></div>
      <p style="color:var(--text-muted);margin-bottom:2.5rem" data-reveal>${strings.stories.subheading}</p>
      <div class="story-grid">${cards}</div>
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
      return renderAboutPage(strings, ctx.cv, ctx.gallery, ctx.base);
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

// The home page is intentionally bare — no footer there; the copyright line
// lives at the foot of every other page.
export function renderFooter(strings, route) {
  if (route?.page === "home") return "";
  return `<footer>© ${new Date().getFullYear()} Ludovica Inés Piro. ${strings.footer.rights}</footer>`;
}
