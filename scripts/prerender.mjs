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
import { fileURLToPath } from "node:url";
import path from "node:path";

import en from "../src/i18n/en.js";
import { contact, projects, competitions, cv, stories } from "../src/data.js";
import {
  routeMeta,
  renderChrome,
  renderPage,
  renderFooter,
  buildPath,
  excerpt,
} from "../src/render.js";
import viteConfig from "../vite.config.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const DIST = path.join(ROOT, "dist");
const SITE = "https://ludovicapiro.com";
// Vite's build `base` (e.g. "/ludovica-piro-page/" when hosted as a subpath) —
// asset URLs baked into prerendered HTML must carry the same prefix as the
// script/link tags Vite itself emits, or they 404 once deployed.
const BASE = (viteConfig.base || "/").replace(/\/+$/, "");
async function assetPath(manifest, srcPath) {
  const entry = manifest[srcPath];
  if (!entry) throw new Error(`Asset not found in build manifest: ${srcPath}`);
  return `${BASE}/${entry.file}`;
}

function buildRoutes() {
  const routes = [
    { page: "home" },
    { page: "about" },
    { page: "work" },
    { page: "competitions" },
    { page: "stories" },
    ...projects.map((p) => ({ page: "project", id: p.id })),
    ...stories.map((s) => ({ page: "story", id: s.id })),
  ];
  return routes;
}

function applyHead(template, { title, description, url }) {
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
  return html;
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

async function main() {
  const manifestRaw = await readFile(path.join(DIST, ".vite", "manifest.json"), "utf8");
  const manifest = JSON.parse(manifestRaw);
  const profilePicSrc = await assetPath(manifest, "src/assets/profile-pic.jpeg");
  const munariPicSrc = await assetPath(manifest, "src/assets/munari.jpg");

  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  const ctx = {
    projects,
    competitions,
    cv,
    stories,
    contact,
    profilePicSrc,
    munariPicSrc,
    base: BASE,
  };
  const routes = buildRoutes();

  for (const route of routes) {
    const meta = routeMeta(route, en, projects, stories);
    const urlPath = buildPath(route.page, route.id);
    const url = SITE + urlPath;

    const bodyHtml = `
      ${renderChrome({
        strings: en,
        route,
        projects,
        stories,
        competitions,
        theme: "auto",
        isDark: false,
        base: BASE,
      })}
      <main id="main">
        ${renderPage(route, en, ctx)}
        ${renderFooter(en)}
      </main>
    `;

    let html = applyHead(template, {
      title: meta.title,
      description: meta.description,
      url,
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

  console.log(`Prerendered ${routes.length} routes.`);
}

// Pages that used to be routes of their own and now live as a section of
// another page. GitHub Pages has no server-side rewrites, so each one gets a
// small standalone HTML file that forwards on. Deliberately `noindex` and
// canonicalised to the destination, so search engines consolidate rather than
// treating it as a duplicate page.
const REDIRECTS = [
  { from: "/contact", to: "/#contact" },
  { from: "/personal-projects", to: "/competitions" },
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

async function writeSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((r) => {
      const loc = SITE + buildPath(r.page, r.id);
      const priority =
        r.page === "home"
          ? "1.0"
          : r.page === "project" || r.page === "story"
            ? "0.6"
            : "0.8";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
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
  lines.push("");
  lines.push("## Work");
  for (const p of projects) {
    lines.push(
      `- [${p.title}](${SITE}/work/${p.id}) — ${p.brand} (${p.agency}): ${p.summary}`,
    );
  }
  lines.push("");
  lines.push("## Competitions");
  for (const c of competitions) {
    lines.push(`- ${c.title} — ${c.brand} (${c.award})`);
  }
  lines.push("");
  lines.push("## Short stories");
  for (const s of stories) {
    lines.push(
      `- [${s.title}](${SITE}/stories/${s.id}) (${s.lang}) — ${excerpt(s.content, 140)}`,
    );
  }
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${contact.email}`);
  lines.push(`- LinkedIn: ${contact.linkedin}`);
  lines.push(`- Spotify: ${contact.spotify}`);
  lines.push(`- Behance: ${contact.behance}`);
  lines.push(`- Instagram: ${contact.instagram}`);
  lines.push("");
  lines.push("Languages spoken: Italian, English, Spanish, Portuguese.");
  await writeFile(path.join(DIST, "llms.txt"), lines.join("\n") + "\n", "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
