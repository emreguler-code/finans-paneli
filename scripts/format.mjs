#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { lstat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const mode = process.argv[2] ?? "--check";
if (
  process.argv.length > 3 ||
  !["--check", "--write", "--debug-check"].includes(mode)
) {
  throw new Error("Use --check, --write or --debug-check.");
}

// Git discovers new source files without entering ignored/private runtime folders.
const listing = spawnSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
);
if (listing.error) throw listing.error;
if (listing.status !== 0)
  throw new Error(listing.stderr || "Git file discovery failed.");
const config = await prettier.resolveConfig(path.join(root, "package.json"));
const files = [];
for (const name of [
  ...new Set(listing.stdout.split("\0").filter(Boolean)),
].sort()) {
  const filename = path.join(root, name);
  const stat = await lstat(filename).catch((error) => {
    if (error.code === "ENOENT") return null; // A tracked file may be deleted locally.
    throw error;
  });
  if (!stat?.isFile()) continue;
  const info = await prettier.getFileInfo(filename, {
    ignorePath: [
      path.join(root, ".gitignore"),
      path.join(root, ".prettierignore"),
    ],
    plugins: config?.plugins,
  });
  if (!info.ignored && info.inferredParser) files.push(filename);
}
if (files.length === 0) throw new Error("No supported project files found.");
console.log(`Prettier: ${files.length} project files (${mode}).`);
const require = createRequire(import.meta.url);
const cli = path.join(
  path.dirname(require.resolve("prettier/package.json")),
  "bin/prettier.cjs",
);
// Bound argument length for Windows and large future repositories; never invoke a shell.
for (let i = 0; i < files.length; i += 64) {
  const result = spawnSync(
    process.execPath,
    [cli, mode, ...files.slice(i, i + 64)],
    {
      cwd: root,
      stdio: "inherit",
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}
