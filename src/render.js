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

// Grayscale "tone" values (HSL lightness %) used to tint the plate
// thumbnails in place of real photography — kept monochrome on purpose.
export const WORK_TONES = [92, 86, 96, 82, 90, 84, 94, 88];
export const STORY_TONES = { ITA: 88, PT: 82, ES: 94, ENG: 90 };
export const LANG_NAMES = {
  en: "English",
  it: "Italiano",
  es: "Español",
  pt: "Português",
};

export function initials(title) {
  return title
    .split(/\s+/)
    .filter((w) => /[a-zA-ZÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function toneForWork(projects, id) {
  const idx = projects.findIndex((p) => p.id === id);
  return WORK_TONES[idx % WORK_TONES.length];
}

export function toneForStory(story) {
  return STORY_TONES[story.lang] || 90;
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

function navWorkList(strings, projects, activePage, activeId, base) {
  return projects
    .map((p) => {
      const active = activePage === "project" && activeId === p.id;
      return `<a href="${hrefFor(base, "project", p.id)}" data-link class="nav-sub-link ${active ? "active" : ""}"
        data-preview="work" data-preview-title="${p.title}" data-preview-sub="${p.brand}"
        data-preview-tone="${toneForWork(projects, p.id)}" data-preview-mark="${initials(p.title)}">${p.title}</a>`;
    })
    .join("");
}

function navStoryList(strings, stories, activePage, activeId, base) {
  return stories
    .map((s) => {
      const active = activePage === "story" && activeId === s.id;
      return `<a href="${hrefFor(base, "story", s.id)}" data-link class="nav-sub-link ${active ? "active" : ""}"
        data-preview="story" data-preview-title="${s.title}" data-preview-sub="${s.lang}"
        data-preview-tone="${toneForStory(s)}" data-preview-mark="${s.lang.slice(0, 2)}">${s.title}</a>`;
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
      <div class="nav-sub-list">${navWorkList(strings, projects, p, id, base)}</div>
    </div>

    <div class="nav-group">
      <a href="${hrefFor(base, "stories")}" data-link class="nav-top-link ${isActive("stories") || isActive("story") ? "active" : ""}">${strings.nav.stories}</a>
      <div class="nav-sub-list">${navStoryList(strings, stories, p, id, base)}</div>
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
}) {
  const navHtml = renderNav(strings, projects, stories, route, base);
  const collapseLabel = navCollapsed ? strings.nav.expand : strings.nav.collapse;
  return `
    <div class="topbar">
      <a href="${hrefFor(base, "home")}" data-link class="brand"><span class="brand-mark">L</span> Ludovica Piro</a>
      <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu">☰</button>
    </div>
    <aside class="side-nav ${navCollapsed ? "collapsed" : ""}">
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
      <div class="topbar-controls">
        ${langDropdown("", locales, activeLang)}
        ${themeDropdown("", theme, isDark, strings)}
      </div>
    </aside>
    <div class="nav-scrim" id="nav-scrim"></div>
    <div class="nav-drawer" id="nav-drawer">
      <nav>${navHtml}</nav>
      <div class="topbar-controls">
        ${langDropdown("mobile", locales, activeLang)}
        ${themeDropdown("mobile", theme, isDark, strings)}
      </div>
    </div>
    <div class="hover-preview" id="hover-preview" aria-hidden="true">
      <div class="hover-preview-plate"><span></span></div>
      <div class="hover-preview-text">
        <strong></strong>
        <em></em>
      </div>
    </div>
  `;
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
      <h1 class="hero-line"><span style="animation-delay:.05s">${strings.hero.greeting}</span></h1>
      <p class="tagline hero-line"><span style="animation-delay:.2s">${strings.hero.role} ${strings.hero.tagline}</span></p>
      <div class="scroll-cue">${strings.nav.work}</div>
    </section>

    <section>
      <div class="about-grid">
        <div class="about-photos" data-reveal>
          <figure><img src="${profilePicSrc}" alt="Ludovica Piro" loading="lazy" /></figure>
          <figure><img src="${munariPicSrc}" alt="${strings.about.munariCaption}" loading="lazy" /></figure>
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
          .map(
            (p, i) => `
          <a href="${hrefFor(base, "project", p.id)}" data-link class="project-card" data-reveal style="--i:${i}">
            <div class="project-thumb" style="--tone:${toneForWork(projects, p.id)}">
              <span class="plate-mark">${initials(p.title)}</span>
            </div>
            <h3>${p.title}</h3>
            <div class="brand-line"><span>${p.brand} · ${p.agency}</span><span class="go">↗</span></div>
          </a>`,
          )
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
              <span class="lang">${s.lang}</span>
              <h4>${s.title}</h4>
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
        ${projects
          .map(
            (p, i) => `
          <a href="${hrefFor(base, "project", p.id)}" data-link class="project-card" data-reveal style="--i:${i % 6}">
            <div class="project-thumb" style="--tone:${toneForWork(projects, p.id)}">
              <span class="plate-mark">${initials(p.title)}</span>
            </div>
            <h3>${p.title}</h3>
            <div class="brand-line"><span>${p.brand} · ${p.agency}</span><span class="go">↗</span></div>
          </a>`,
          )
          .join("")}
      </div>

      <div style="margin-top:4.5rem" data-reveal>
        <h3>${strings.work.competitionsHeading}</h3>
        <ul class="list-simple">
          ${competitions
            .map(
              (c) =>
                `<li><span>${c.title} — ${c.brand}</span><span class="award">${c.award}</span></li>`,
            )
            .join("")}
        </ul>
      </div>

      <div style="margin-top:3rem" data-reveal>
        <h3>${strings.work.comingSoonHeading}</h3>
        <div class="chips">${comingSoon.map((c) => `<span>${c}</span>`).join("")}</div>
      </div>
    </section>
  `;
}

export function renderProjectPage(strings, projects, id, base) {
  const p = projects.find((x) => x.id === id);
  if (!p) return renderNotFoundPage(strings, base);
  return `
    <section class="project-detail">
      <a class="back-link" href="${hrefFor(base, "work")}" data-link><span class="arrow">←</span> ${strings.work.back}</a>
      <span class="kicker">${p.brand} · ${p.agency}</span>
      <h1>${p.title}</h1>
      ${p.tag ? `<p style="color:var(--text-muted)">${p.tag}</p>` : ""}
      <p class="lede">${p.summary}</p>
      <div class="hero-plate" style="--tone:${toneForWork(projects, p.id)}"><span>${initials(p.title)}</span></div>
      ${p.body.map((b) => `<p style="color:var(--text-muted);font-size:1.05rem">${b}</p>`).join("")}
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:2rem">${strings.work.agency} ${p.agency}</p>
      ${p.recognition ? `<div class="recognition">${p.recognition}</div>` : ""}
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
            <span class="lang">${s.lang}</span>
            <h4>${s.title}</h4>
            <p class="story-excerpt">${excerpt(s.content, 110)}</p>
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
  return `
    <section class="project-detail">
      <a class="back-link" href="${hrefFor(base, "stories")}" data-link><span class="arrow">←</span> ${strings.stories.heading}</a>
      <span class="kicker">${s.lang}</span>
      <h1>${s.title}</h1>
      <div class="story-body">${s.content}</div>
    </section>
  `;
}

export function renderContactPage(strings, contact) {
  return `
    <section>
      <div class="section-heading" data-reveal><h1>${strings.contact.heading}</h1><div class="rule"></div></div>
      <div class="contact-list" data-reveal>
        <div class="contact-row"><span>${strings.contact.emailLabel}</span><a href="mailto:${contact.email}">${contact.email}</a></div>
        <div class="contact-row"><span>${strings.contact.phoneLabel}</span><span>${contact.phone}</span></div>
        <div class="contact-row"><span>Behance</span><a href="${contact.behance}" target="_blank" rel="noopener">ludovicapiro</a></div>
        <div class="contact-row"><span>Instagram</span><a href="${contact.instagram}" target="_blank" rel="noopener">@lodevicapire</a></div>
      </div>
      <a class="cv-btn" href="${contact.cv}" target="_blank" rel="noopener" data-reveal>${strings.contact.cv} <span class="go">↗</span></a>
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
