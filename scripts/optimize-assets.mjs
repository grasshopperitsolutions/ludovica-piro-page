// One-off (re-runnable) image optimiser for work assets.
//
// Source boards arrive as full-resolution JPG/PNG exports — the first batch was
// 31 MB across 8 images, which would dominate page weight. This resizes them to
// a sane display width and writes WebP plus a JPEG fallback into `public/work/`.
//
// `public/` (rather than `src/assets/`) is deliberate: files there are copied
// verbatim and referenced by plain URL, so the same path works in the browser
// and in the Node prerenderer. Assets under `src/` would need a Vite manifest
// lookup, which the prerenderer can't do for binaries it never imports.
//
// Usage:  node scripts/optimize-assets.mjs <source-dir> [--force]
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const OUT = path.join(ROOT, "public", "work");
const MAX_WIDTH = 1600;
const FORCE = process.argv.includes("--force");

// Board filename -> the slug used in src/data.js. Anything not listed is still
// converted, under a slugified version of its filename, and reported so it
// can be wired up (or chased with Ludovica) rather than silently dropped.
const NAME_MAP = {
  "BOARD-Emergency_A_01": "emergency-board",
  EMERGENCY_Eurobest_Board_A_01: "emergency-eurobest",
  "CAMPARINO-ATM_A_03": "camparino-atm",
  "CAMPARINO-BoardMuseum_A_01": "camparino-museum",
  "CAMPARINO-TheSouvenir_A_03": "camparino-souvenir",
  "CONAD-BoardBuoniXTutti": "conad-buoni-x-tutti",
  "CONAD-BoardDoggyBag": "conad-doggy-bag",
  "CONAD-BoardTasteTheName": "conad-taste-the-name",
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function main() {
  const src = process.argv[2];
  if (!src || !existsSync(src)) {
    console.error("Usage: node scripts/optimize-assets.mjs <source-dir> [--force]");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  const files = await readdir(src);
  const images = files.filter((f) => /\.(jpe?g|png)$/i.test(f));
  const skipped = files.filter((f) => !/\.(jpe?g|png)$/i.test(f));

  let totalIn = 0;
  let totalOut = 0;
  const unmapped = [];

  for (const file of images) {
    const base = file.replace(/\.[^.]+$/, "");
    const slug = NAME_MAP[base] || slugify(base);
    if (!NAME_MAP[base]) unmapped.push(`${file} -> ${slug}`);

    const inPath = path.join(src, file);
    totalIn += (await stat(inPath)).size;

    const webpPath = path.join(OUT, `${slug}.webp`);
    if (!FORCE && existsSync(webpPath)) {
      console.log(`skip (exists)  ${slug}`);
      totalOut += (await stat(webpPath)).size;
      continue;
    }

    // WebP only — it's supported everywhere that matters now, and a JPEG
    // fallback measured within a few percent of the same size, so shipping
    // both would just double repo weight for files nobody fetches.
    await sharp(inPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(webpPath);

    const outSize = (await stat(webpPath)).size;
    totalOut += outSize;
    console.log(`${slug.padEnd(24)} ${Math.round(outSize / 1024)}KB`);
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
  console.log(`\nsource ${mb(totalIn)} -> output ${mb(totalOut)}`);
  if (skipped.length)
    console.log(`not images (handled separately): ${skipped.join(", ")}`);
  if (unmapped.length) {
    console.log("\nNot in NAME_MAP — confirm which work these belong to:");
    unmapped.forEach((u) => console.log("  " + u));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
