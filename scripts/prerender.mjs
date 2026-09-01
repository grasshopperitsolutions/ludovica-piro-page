// Post-build static prerender.
//
// GitHub Pages serves plain files with no server-side logic, and social /
// AI crawlers generally don't execute JS. So for every route to be
// indexable and to produce correct link-preview cards, we render each
// page's real markup (via the same pure templates the client uses) into
// its own physical dist/<route>/index.html, with page-specific
// <title>/description/OG tags baked in. The client bundle then hydrates
// over this markup on load for interactivity.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

import en from "../src/i18n/en.js";
import {
  contact,
  projects,
  competitions,
  cv,
  stories,
  STORY_GROUPS,
  POETRY_CAMERA,
} from "../src/data.js";
import {
  routeMeta,
  renderChrome,
  renderPage,
  renderFooter,
  buildPath,
  excerpt,
} from "../src/render.js";
import viteConfig from "../vite.config.js";
import { ogTargets } from "./og-images.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const DIST = path.join(ROOT, "dist");
const SITE = "https://ludovicapiro.com";
// Vite's build `base` — "/" at the site's own domain. Asset URLs baked into
// prerendered HTML must carry the same prefix as the script/link tags Vite
// itself emits, or they 404 once deployed.
const BASE = (viteConfig.base || "/").replace(/\/+$/, "");

// A build served from a subpath is a preview build: the real site lives at the
// domain root. Previews must not be indexed — a temporary address collects
// search history and competes with the real one — so those builds get
// `noindex` on every page and a robots.txt that closes the whole tree. The
// canonical tag already points at the real domain, but a canonical is a hint
// and a disallow is not. At `base: "/"` this is false and the site is fully
// indexable, which is the live configuration.
const IS_STAGING = BASE !== "";

// Which works advertise a share image of their own. Derived from the same
// function that generates them, so the two cannot disagree about a filename.
const OG_BY_WORK = new Map(ogTargets().map((t) => [t.id, t.name]));

function ogImageFor(route) {
  const name = route.page === "project" ? OG_BY_WORK.get(route.id) : null;
  return name ? `${SITE}/og/${name}` : `${SITE}/og-image.jpg`;
}

function buildRoutes() {
  const routes = [
    { page: "home" },
    { page: "about" },
    { page: "work" },
    { page: "competitions" },
    { page: "personal" },
    ...projects.map((p) => ({ page: "project", id: p.id })),
    ...competitions.map((c) => ({ page: "competition", id: c.id })),
    ...stories.map((s) => ({ page: "story", id: s.id })),
    ...POETRY_CAMERA.filter((p) => p.lines?.length).map((p) => ({
      page: "poem",
      id: p.id,
    })),
  ];
  return routes;
}

function applyHead(template, { title, description, url, image, imageAlt }) {
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${escapeAttr(title)}$2`,
  );
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${escapeAttr(title)}$2`,
  );
  html = html.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${escapeAttr(description)}$2`,
  );
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);

  // Both image tags move together — a page whose OG card and Twitter card
  // disagree previews differently depending on where it is pasted.
  html = html.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${image}$2`,
  );
  html = html.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${image}$2`,
  );
  html = html.replace(
    /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
    `$1${escapeAttr(imageAlt)}$2`,
  );

  if (IS_STAGING) {
    html = html.replace(
      /(<meta\s+name="robots"\s+content=")[^"]*(")/,
      `$1noindex, nofollow$2`,
    );
  }
  return html;
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

async function main() {
  const template = await readFile(path.join(DIST, "index.html"), "utf8");
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
  const routes = buildRoutes();

  for (const route of routes) {
    const meta = routeMeta(route, en, projects, stories, competitions);
    const urlPath = buildPath(route.page, route.id);
    const url = SITE + urlPath;

    const bodyHtml = `
      ${renderChrome({
        strings: en,
        route,
        isDark: false,
        base: BASE,
      })}
      <main id="main">
        ${renderPage(route, en, ctx)}
      </main>
      ${renderFooter(en, route)}
    `;

    let html = applyHead(template, {
      title: meta.title,
      description: meta.description,
      url,
      image: ogImageFor(route),
      imageAlt: meta.title,
    });
    html = html.replace(
      /<div id="app" class="app"><\/div>/,
      `<div id="app" class="app">${bodyHtml}</div>`,
    );

    const outDir = urlPath === "/" ? DIST : path.join(DIST, urlPath);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");
  }

  await writeSitemap(routes);
  await writeLlmsTxt();
  await writeRedirects();
  if (IS_STAGING) await writeStagingRobots();

  console.log(
    `Prerendered ${routes.length} routes` +
      (IS_STAGING ? " (staging build: noindex + robots disallow)." : "."),
  );
}

// Pages that used to be routes of their own and now live as a section of
// another page. GitHub Pages has no server-side rewrites, so each one gets a
// small standalone HTML file that forwards on. Deliberately `noindex` and
// canonicalised to the destination, so search engines consolidate rather than
// treating it as a duplicate page.
// Old URLs that should keep resolving. /personal-projects is a real page now,
// so the only survivor is the short-stories index, which the deck folded into it.
const REDIRECTS = [
  { from: "/stories", to: "/personal-projects" },
  { from: "/work", to: "/works" },
];

async function writeRedirects() {
  for (const { from, to } of REDIRECTS) {
    const target = `${BASE}${to}`;
    const canonical = SITE + to;
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting…</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${canonical}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>
      window.location.replace("${target}" + window.location.search);
    </script>
    <style>
      body {
        font-family: -apple-system, sans-serif;
        margin: 4rem;
        color: #666;
      }
    </style>
  </head>
  <body>
    <p>This page moved. <a href="${target}">Continue</a>.</p>
  </body>
</html>
`;
    const outDir = path.join(DIST, from);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");
  }
}

// Staging keeps its own robots.txt, replacing the permissive one from public/.
// Belt and braces with the per-page `noindex`: a crawler that never fetches a
// page still reads this.
async function writeStagingRobots() {
  const txt = [
    "# Staging build — this is not the live site.",
    "# The real site is https://ludovicapiro.com/ and is indexable there.",
    "User-agent: *",
    "Disallow: /",
    "",
  ].join("\n");
  await writeFile(path.join(DIST, "robots.txt"), txt, "utf8");
}

/* When the content behind a page last actually changed.

   Every entry used to carry the build date, so a rebuild that changed nothing
   still told crawlers all 24 pages were new — which teaches them to ignore the
   field. These come from git instead: the last commit touching the files a
   page is built from. Pages made of copy in data.js move when data.js moves,
   and no sooner.

   Falls back to the build date outside a git checkout (a downloaded tarball,
   some CI images) — the old behaviour, so no worse. */
function lastCommitDate(files) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

function contentDates() {
  const today = new Date().toISOString().slice(0, 10);
  const src = (f) => path.join(ROOT, f);
  // Copy lives in data.js and en.js; the page shape in render.js. A page
  // changed when any file that produces it changed.
  const content = lastCommitDate([src("src/data.js"), src("src/i18n/en.js")]) ?? today;
  const layout = lastCommitDate([src("src/render.js")]) ?? today;
  return { content, newest: content > layout ? content : layout };
}

async function writeSitemap(routes) {
  const { content, newest } = contentDates();
  const urls = routes
    .map((r) => {
      const loc = SITE + buildPath(r.page, r.id);
      const priority =
        r.page === "home"
          ? "1.0"
          : r.page === "project" || r.page === "story"
            ? "0.6"
            : "0.8";
      // A single work, competition or story is pure content, so it moves with
      // the copy. Index pages also reflect changes to the page shape.
      const lastmod =
        r.page === "project" || r.page === "competition" || r.page === "story"
          ? content
          : newest;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(path.join(DIST, "sitemap.xml"), xml, "utf8");
}

async function writeLlmsTxt() {
  const lines = [];
  lines.push("# Ludovica Piro");
  lines.push("");
  lines.push("> Senior Creative Copywriter and author. " + en.hero.tagline);
  lines.push("");
  // Paragraphs are stored as arrays of authored lines; flatten for plain text.
  for (const para of en.about.bio) lines.push(para.join(" "));
  for (const para of en.about.paragraphs) lines.push(para.join(" "));
  lines.push(`${en.about.closing.lead} ${en.about.closing.line}`);
  lines.push("");
  lines.push("## Work");
  for (const p of projects) {
    lines.push(
      `- [${p.title}](${SITE}${buildPath("project", p.id)}) — ${p.brand}${p.agency ? ` (${p.agency})` : ""}: ${p.summary}`,
    );
  }
  lines.push("");
  lines.push("## Competitions");
  for (const c of competitions) {
    lines.push(
      `- [${c.title}](${SITE}${buildPath("competition", c.id)}) — ${c.brand} (${c.award}): ${c.body[0]}`,
    );
  }
  lines.push("");
  lines.push("## Personal projects — short stories");
  for (const s of stories) {
    // A gated piece is listed but not quoted — this file is written for
    // crawlers, so an excerpt here would publish exactly what the gate holds
    // back. TEMPORARY, alongside the gate itself.
    const locked = STORY_GROUPS.find((g) => g.storyIds.includes(s.id))?.locked;
    const tail = locked ? "not public yet" : excerpt(s.content, 140);
    lines.push(
      `- [${s.title}](${SITE}${buildPath("story", s.id)}) (${s.lang}) — ${tail}`,
    );
  }
  lines.push("");
  lines.push("## Personal projects — Poetry Camera");
  for (const p of POETRY_CAMERA.filter((x) => x.lines?.length)) {
    lines.push(
      `- [${p.title}](${SITE}${buildPath("poem", p.id)})${p.place ? ` (${p.place})` : ""} — ${p.lines.join(" ")}`,
    );
  }
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${contact.email}`);
  lines.push(`- LinkedIn: ${contact.linkedin}`);
  lines.push(`- Spotify: ${contact.spotify}`);
  lines.push(`- Instagram: ${contact.instagram}`);
  lines.push("");
  lines.push("Languages spoken: Italian, English, Spanish, Portuguese.");
  await writeFile(path.join(DIST, "llms.txt"), lines.join("\n") + "\n", "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
