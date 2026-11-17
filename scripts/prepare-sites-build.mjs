#!/usr/bin/env node
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log(
  "Prepared Sites build: dist/server/index.js and dist/.openai/hosting.json",
);

// Shared by the standalone PHP updater; only local generated font filenames.
const assets = path.join(dist, "client", "assets");
const fontCss = [400, 500, 600]
  .map((weight) => {
    const file = readdirSync(assets).find(
      (name) => name.startsWith(`Inter-${weight}-`) && name.endsWith(".ttf"),
    );
    if (!file) throw new Error(`Missing Inter ${weight}`);
    return `@font-face{font-family:Inter;font-style:normal;font-weight:${weight};font-display:swap;src:url('./${file}') format('truetype')}`;
  })
  .join("\n");
writeFileSync(path.join(assets, "fonts.css"), fontCss);

copyFileSync(
  path.join(root, "src", "styles", "tokens.css"),
  path.join(assets, "design-tokens.css"),
);
