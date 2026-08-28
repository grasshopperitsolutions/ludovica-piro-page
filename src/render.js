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

import { PLATE_LINES, STORY_GROUPS, storyGroupFor, previewFor } from "./data.js";

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

// Poppy. One drawing for both themes — the red petals carry it either way, and
// the outer silhouette is currentColor so it stays visible on the dark theme
// instead of going black-on-black. Decorative and hidden from assistive tech;
// the button itself carries the label.
// Source: openclipart.org/detail/8257 by Gerald_G, public domain. Inkscape
// cruft, the XML prolog and the RDF metadata stripped for inlining; the
// gradient id namespaced so it cannot collide with anything else on the page.
export const POPPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 281.288 264.09" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="lp-poppy-shade" gradientUnits="userSpaceOnUse" cx="143.77" cy="135.5" r="122.45">
      <stop offset=".0048" stop-color="#000000" />
      <stop offset="1" stop-color="#2a2a2a" />
    </radialGradient>
  </defs>
  <path fill="currentColor" fill-rule="evenodd" d="m9.947 106.25c-3.672-9.248-3.96-18.14-0.72-27.356 3.24-9.252 12.852-18.792 19.8-27.36 6.66-8.64 12.132-16.704 20.88-23.796 8.892-7.164 23.4-14.976 31.716-18.72 8.064-3.744 11.16-2.16 16.92-3.6 5.687-1.656 10.547-5.724 17.637-5.4 7.02 0.324 16.2 5.76 24.48 7.56 8.32 1.584 15.77 0.252 24.88 2.52 8.89 2.304 17.71 3.528 28.8 11.16 11.16 7.596 25.16 20.88 37.44 33.876 12.13 12.924 27.22 30.636 34.95 42.84 7.53 11.986 9.44 21.166 10.44 29.196 1.01 7.99-0.43 13.93-4.32 18.36 2.78 4.1 4.86 9.65 6.12 16.92 1.23 7.24 3.6 17.06 1.44 26.28-2.27 9.07-5.58 17.28-14.4 28.08-9.03 10.8-24.15 28.22-38.55 36.04-14.51 7.52-34.96 8.35-47.16 9.72-12.21 1.22-17.79-2.02-25.2-1.8-7.53 0.25-10.84 3.92-19.12 3.23-8.42-0.82-20.45-0.97-30.24-7.92-9.754-7.19-17.098-21.34-27.718-33.84-10.8-12.6-25.776-29.66-36.036-40.35-10.26-10.55-18.288-15.37-25.2-22.68-7.056-7.49-15.444-12.75-16.56-21.6-1.151-8.96 2.088-19.19 9.721-31.36z" />
  <path fill="#ff0000" fill-rule="evenodd" d="m269.97 144.81c2.56-2.2 4.07-5.44 4.68-9.72 0.54-4.39 0.44-10.08-1.43-16.24-2.09-6.22-4.83-12.09-10.44-20.516-5.69-8.64-14.62-20.34-23.04-30.24-8.5-9.864-17.79-20.268-27.04-28.44-9.32-8.316-19.33-15.768-28.08-20.556-8.82-4.644-17.93-6.372-24.12-7.56-6.19-1.368-7.88 0.504-13-0.36-5.43-1.008-13.35-3.708-18.36-5.04-5.04-1.404-8.06-2.412-11.16-2.88-3.09-0.504-4.46-0.432-7.56 0.36-3.34 0.72-8.28 3.456-11.876 4.32-3.708 0.756-5.148-0.72-9.72 0.72-4.644 1.368-11.448 4.284-17.64 7.92-6.228 3.564-12.852 7.38-19.476 13.68-6.804 6.336-15.12 17.64-20.52 23.796-5.364 6.012-8.136 7.128-11.52 12.24-3.672 5.004-8.136 10.908-9.36 18-1.116 7.092-0.324 14.94 2.52 24.116-3.276 5.26-5.724 10.01-7.2 14.4-1.548 4.22-2.34 7.56-1.8 11.56 0.54 4.03 0.792 7.31 5.04 12.6 4.212 5.29 13.428 12.78 20.16 18.72 6.552 5.76 12.564 8.82 19.44 15.84 6.876 6.95 15.336 18.33 21.636 25.92 6.156 7.49 10.944 13.54 15.48 19.12 4.464 5.4 7.308 9.21 11.16 13.68 3.746 4.35 5.146 9.65 11.156 12.96 5.98 3.24 16.56 6.12 24.12 6.84 7.35 0.47 13.43-2.81 20.2-2.88 6.62-0.04 12.06 2.77 19.8 2.88 7.7-0.04 17.24-0.83 26.28-2.52 8.93-1.8 18.65-2.7 27.36-7.56 8.64-4.97 16.56-13.79 24.16-21.6 7.52-7.96 16.05-16.89 20.88-25.24 4.6-8.46 6.55-16.49 7.2-24.48 0.5-8.06-2.27-16.92-3.6-22.68-1.37-5.69-2.81-9.36-4.33-11.16zm-145.51-33.16c0.65-5.79 2.2-8.89 5.04-9.72 2.81-0.82 6.52 0.9 11.52 5.04 6.02-4.53 11.16-5.72 15.88-3.96 4.68 1.84 8.5 6.63 11.88 14.76 5.94 0.4 9.65 2.34 11.52 6.12 1.8 3.71 1.51 9.07-0.72 16.24 5.29 5.94 7.16 10.73 5.76 14.76-1.48 3.96-6.23 6.91-14.4 9-3.89 6.23-7.42 9.57-11.16 10.44-3.78 0.83-7.2-1.23-10.84-5.76-7.23 2.01-13.06 2.3-17.64 0.72-4.68-1.59-7.74-4.9-9.72-10.08-6.62-2.38-10.65-5.55-12.24-9.36-1.58-3.92-0.57-8.39 2.88-13.68-1.33-9.4-0.97-16.13 1.08-20.2 2.02-4.1 5.69-5.54 11.16-4.32z" />
  <path fill="#ffffff" fill-rule="evenodd" d="m137.06 137.61c1.73-1.98 3.28-2.88 5.04-3.24 1.66-0.36 3.86 0.4 5.08 1.44 1.15 0.94 1.69 2.63 1.76 4.68-2.16 0.94-4.1 1.22-6.12 0.72-2.05-0.5-3.92-1.66-5.76-3.6z" />
  <path opacity=".45" fill="url(#lp-poppy-shade)" fill-rule="evenodd" d="m148.94 19.458c-0.07-5.364-0.07-7.92 1.12-3.24 1.15 4.644 5.36 17.316 6.12 30.636 0.72 13.212 1.37 40.5-1.8 48.24-3.39 7.486-13.68 1.8-17.68-2.88-3.99-4.896-7.38-24.12-6.12-25.2 1.3-1.008 10.3 22.5 13.68 19.44 3.1-3.348 5.08-26.856 5.8-38.16 0.75-11.376-1.19-23.4-1.12-28.836zm-62.997 16.2c3.492 7.884 11.736 27.432 16.557 38.916 4.83 11.304 10.16 27.106 12.24 28.796 1.98 1.44 3.21-9.104-0.36-19.436-3.81-10.512-16.053-33.048-21.597-42.48-5.652-9.396-10.332-12.852-11.52-13.716-1.224-0.936 1.116 0.036 4.68 7.92zm10.079 68.072c-2.988-4.892-12.096-18.788-12.6-18.356-0.504 0.54 6.372 16.816 9.36 21.596 2.88 4.72 7.268 6.88 7.918 6.48 0.47-0.57-1.833-5.11-4.678-9.72zm-8.639 16.2c-6.084-4.96-17.316-15.84-28.44-17.64-11.232-1.76-36.18 6.2-38.196 7.2-1.908 0.8 16.38-3.34 26.28-1.44 9.864 2.06 23.94 9.36 32.076 13.32 7.992 3.86 13.932 9.87 15.48 9.72 1.296-0.39-1.296-6.33-7.2-11.16zm7.56 47.56c-3.816 2.02-6.624 5.94-9 9-2.484 2.99-9.144 10.94-5.4 9 3.78-2.2 25.197-18.22 27.717-21.24 2.34-3.06-9.645 1.12-13.317 3.24zm86.797-59.44c-4.28 4.54-0.04 3.71 2.88 1.8 2.81-2.08 6.69-7.45 14.04-13.316 7.27-5.976 27.43-19.188 29.52-21.6 1.84-2.376-9.83 1.548-17.64 7.2-7.96 5.652-24.41 21.096-28.8 25.916zm6.48-29.156c3.49-2.736 11.09-11.196 15.84-15.12 4.71-4.068 12.45-7.524 12.24-8.28-0.44-0.684-8.53 0.252-14.04 4.32-5.62 4.068-16.74 16.056-19.08 19.44-2.45 3.096 1.55 2.232 5.04-0.36zm18.36 63.036c-6.12 1.19-7.92 2.99-3.6 3.6 4.43 0.5 19.55-0.47 29.52 0 9.86 0.4 23.61 3.28 29.19 2.52 5.44-0.86 6.84-5.58 3.24-7.2-3.85-1.65-15.8-2.77-25.59-2.52-9.9 0.11-26.61 2.38-32.76 3.6zm-10.08 30.24c-6.77-2.95-8.35-0.07-3.24 4.32 5.15 4.35 25.13 13.1 33.84 21.24 8.6 7.99 16.13 26.71 17.32 26.31 0.82-0.79-3.1-20.73-11.2-29.55-8.17-8.82-29.95-19.22-36.72-22.32zm36 15.12c2.81 1.98 9.68 5.47 13 9.36 3.16 3.96 5.57 13.9 6.11 13.68 0.51-0.5-0.57-11.92-3.23-16.2-3.03-4.35-10.37-8.24-13.72-9.72-3.35-1.58-5.36-0.22-5.76 0.36-0.43 0.4 0.86 0.54 3.6 2.52zm-73.08 59.08c-0.76-4.76 1.73-10.52 1.08-17.28-0.87-6.88-3.96-24.73-5.4-23.44-1.44 1.22-0.4 23.4-3.24 31-2.99 7.45-13.86 11.48-14.44 14.04-0.57 2.37 6.09-0.4 10.8 0.72 4.54 1.08 14.65 6.51 16.6 5.76 1.8-0.94-4.72-6.16-5.4-10.8zm-27.4-66.28c0.15-2.88-2.09-2.41-3.24 0-1.22 2.37-2.45 9.5-3.96 14.04-1.73 4.43-5.79 11.56-5.4 12.24 0.4 0.43 5.76-4.61 7.92-9 2.09-4.54 4.4-14.37 4.68-17.28zm47.2 10.44c2.3 4.97 13.97 21.46 17.64 29.2 3.56 7.59 3.1 16.3 3.6 15.84 0.32-0.76 1.73-12.42-1.08-19.84-2.92-7.6-12.46-20.59-15.84-24.84-3.42-4.28-6.62-5.18-4.32-0.36z" />
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

// One button, one job: click it and the theme flips. The poppy is the same
// drawing in both themes, so nothing about it needs to change on a flip.
function themeToggle(isDark, strings) {
  return `
    <button type="button" class="menu-trigger flower-trigger" id="theme-toggle" data-theme-toggle
      aria-pressed="${isDark}" aria-label="${isDark ? strings.theme.toLight : strings.theme.toDark}">
      <span class="flower">${POPPY_SVG}</span>
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

// One preview: an image, or a muted looping video where a work has one. Used
// by the hover preview on the index and as the fallback media on a detail page.
export function previewMedia(p, base, { className = "" } = {}) {
  const media = previewFor(p);
  const src = mediaUrl(base, media.file);
  const alt = escapeHtml(p.title);
  return media.type === "video"
    ? `<video class="${className}" src="${src}" autoplay muted loop playsinline preload="metadata" aria-label="${alt}"></video>`
    : `<img class="${className}" src="${src}" alt="${alt}" loading="lazy" />`;
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

// A plain list, the way she'd set it: title, then the client small beside it.
// Resting on a row for two seconds opens its preview in the panel alongside;
// the panel then stays put until another row earns it, so nothing flickers as
// the cursor crosses the list. Clicking a row opens the work's own page.
export function renderWorkIndexPage(strings, projects, base) {
  const rows = projects
    .map((p) => {
      const media = previewFor(p);
      return `
      <li>
        <a href="${hrefFor(base, "project", p.id)}" data-link class="work-row ${p.needsInfo ? "is-incomplete" : ""}"
           data-preview-type="${media.type}" data-preview-src="${mediaUrl(base, media.file)}"
           data-preview-alt="${escapeHtml(p.title)}">
          <span class="work-row-title">${escapeHtml(p.title)}</span>
          <span class="work-row-brand">${escapeHtml(p.brand)}</span>
        </a>
      </li>`;
    })
    .join("");

  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.work.heading}</h1><div class="rule"></div></div>
      <div class="work-layout">
        <ul class="work-list">${rows}</ul>
        <aside class="work-preview" data-work-preview aria-hidden="true"></aside>
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
          : `<div class="work-media" data-reveal>
               <figure class="is-placeholder">
                 ${previewMedia(p, base)}
                 <figcaption>${escapeHtml(strings.work.placeholderMedia)}</figcaption>
               </figure>
             </div>`
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
        <h2 class="about-hey">${line(a.bioHeading)}</h2>
        ${a.bio.map((p) => `<p class="intro-para">${line(p)}</p>`).join("")}
        ${a.paragraphs.map((p, i) => `<p class="intro-para${i === 0 ? " intro-para--lead" : ""}">${line(p)}</p>`).join("")}
        <p class="about-closing">${line(a.closing)}</p>
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
