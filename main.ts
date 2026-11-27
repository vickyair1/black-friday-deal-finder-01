/* The Real Deal Finder — entrypoint: hands the entry in for the make.fun checker.
   Copies app/ and screenshots/ into ./output and writes dossier.json with
   buildDossier from vendor/makefun-frontend.ts, exactly as the kit starter does.
   Deterministic: no timestamps, no random values, so two runs write a
   byte-identical dossier.json. Run with: node main.ts
   (or MAKEFUN_OUTPUT_DIR=out node main.ts outside the grader). */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const ROOT = dirname(fileURLToPath(import.meta.url));
/* The grader runs `node /bot/main.ts` with the repo mounted READ-ONLY at /bot
   and an empty writable directory at $MAKEFUN_OUTPUT_DIR (/output). Writing the
   dossier under the repo (./output) fails there with EACCES, so honour the
   grader's output directory when it is set. */
const OUT = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : resolve(ROOT, "output");

/* Guard: never hand in screenshots older than the pages they show. */
function assertFreshShots() {
  const shots = JSON.parse(readFileSync(join(ROOT, "shots.json"), "utf8")).shots;
  for (const s of shots) {
    const shotPath = join(ROOT, s.file);
    if (!existsSync(shotPath)) throw new Error("missing screenshot: " + s.file);
    const shotTime = statSync(shotPath).mtimeMs;
    for (const page of ["app/index.html", "app/app.js", "app/data.js", "app/style.css"]) {
      if (statSync(join(ROOT, page)).mtimeMs > shotTime) {
        throw new Error("stale screenshot " + s.file + " — retake it after editing " + page);
      }
    }
  }
}

function copyTree(srcDir, destDir) {
  for (const name of readdirSync(srcDir).sort()) {
    const src = join(srcDir, name);
    const dest = join(destDir, relative(srcDir, src));
    const st = statSync(src);
    if (st.isDirectory()) copyTree(src, dest);
    else if (st.isFile()) {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(src, dest);
    }
  }
}

function main() {
  assertFreshShots();
  mkdirSync(OUT, { recursive: true });
  copyTree(join(ROOT, "app"), join(OUT, "app"));
  mkdirSync(join(OUT, "screenshots"), { recursive: true });
  if (existsSync(join(ROOT, "screenshots"))) {
    copyTree(join(ROOT, "screenshots"), join(OUT, "screenshots"));
  }
  // The scorer's own caps: only text_max_bytes shapes the bytes; the others
  // refuse an entry the scorer would refuse.
  const dossier = buildDossier(OUT, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  const outFile = join(OUT, "dossier.json");
  if (typeof dossier === "string") writeFileSync(outFile, dossier, "utf8");
  else writeFileSync(outFile, dossier);
  console.log("wrote " + outFile);
}

main();
