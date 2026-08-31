// Per-work share images.
//
// When a link to a work is pasted into WhatsApp, LinkedIn or Slack, this is the
// picture that appears. Without one every page previews with the same site
// card, so a link to Säkerhet and a link to Liga-te look identical.
//
// Each work that owns artwork gets a card cut from its own first image. That is
// deliberately not a text card: the campaign boards are the strongest thing on
// the site, and a real image beats a generated title every time. Works with no
// artwork of their own — the ones that are only a film — keep the site card,
// which is honest rather than inventing a picture for them.
//
// Regenerate with:  npm run og-images
// Output is committed, because it is derived from artwork that rarely changes
// and this keeps the build free of an image pass.
import sharp from "sharp";
import { mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { projects, previewFor } from "../src/data.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const WORK = path.join(ROOT, "public", "work");
const OUT = path.join(ROOT, "public", "og");

// The size every platform crops toward. Anything else gets letterboxed or
// centre-cropped by whoever is rendering the preview.
const W = 1200;
const H = 630;

// Which works get their own card: those whose preview is a real still. A work
// previewed by its film returns `type: "embed"` and is skipped.
export function ogTargets() {
  return projects
    .map((p) => ({ project: p, preview: previewFor(p) }))
    .filter(({ preview }) => preview?.type === "image" && preview.file)
    .map(({ project, preview }) => ({
      id: project.id,
      title: project.title,
      source: preview.file,
      name: `works-${project.id}.jpg`,
    }));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const targets = ogTargets();
  const expected = new Set(targets.map((t) => t.name));

  for (const t of targets) {
    const src = path.join(WORK, t.source);
    if (!existsSync(src)) {
      console.warn(`skip ${t.id} — missing ${t.source}`);
      continue;
    }

    // `cover` crops rather than pads: a board letterboxed onto white would read
    // as a mistake in a chat window, where the card is already small. Attention
    // is biased to the top because these boards lead with their headline.
    const out = path.join(OUT, t.name);
    const info = await sharp(src)
      .resize(W, H, { fit: "cover", position: "top" })
      .jpeg({ quality: 82, chromaSubsampling: "4:4:4" })
      .toFile(out);
    console.log(`${t.name.padEnd(38)} ${Math.round(info.size / 1024)}KB`);
  }

  // Drop cards for works that no longer qualify, so a renamed or de-imaged work
  // cannot leave a stale picture behind that nothing references.
  for (const file of await readdir(OUT)) {
    if (file.endsWith(".jpg") && !expected.has(file)) {
      await unlink(path.join(OUT, file));
      console.log(`removed stale ${file}`);
    }
  }

  console.log(`\n${targets.length} work cards in public/og/.`);
}

/* ---------------------------------------------------------------------------
   How public/og-image.jpg — the site-wide card — was made, and how to remake it

   That one is not generated here, because it is typeset in Coconat and Coconat
   cannot be rendered from Node. sharp rasterises SVG through librsvg, which
   ignores an embedded @font-face: a card built that way comes out in a system
   serif, pixel-identical to having named no font at all, and never errors. So
   it is drawn in a browser, where the real webfont is already loaded, and
   posted back to a throwaway local server.

   To remake it (after a copy change, or with a different photo):

   1. Write a small HTTP server that accepts `POST /save?name=…` and writes the
      body to public/, with `Access-Control-Allow-Origin: *`. Run it on 5199.
   2. `npm run dev`, then open any page of the site — Coconat is already loaded
      on all of them.
   3. In the console, build a 1200x630 canvas: white ground; the photo
      cover-cropped into a 452px column on the right, focused at about 0.66 of
      its width so her face is centred rather than the frame; the poppy, name,
      role, a short rule and the tagline down the left at 76px padding, each
      auto-fitted to the column width with measureText.
   4. `canvas.toBlob()` and POST it to the server.
   5. Convert the PNG to JPEG at quality 88 with 4:4:4 chroma — text on a flat
      ground shows chroma artefacts at the default subsampling.
   6. Stop the server and delete both it and the PNG.

   Sizes and positions are all in that recipe rather than in code because this
   runs perhaps once a year; a permanent build step for it would be more
   machinery than the job deserves.
   --------------------------------------------------------------------------- */

// Only run when invoked directly — prerender imports ogTargets() to decide
// which pages advertise their own card, and must not trigger an image pass.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
