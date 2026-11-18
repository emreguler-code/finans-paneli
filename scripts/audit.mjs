import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
// The only exception is a build-time glob advisory with no upstream patch.
// New advisories, changed dependency versions, critical severity, or expiry fail closed.
export function auditFailures(
  report,
  lock,
  today = new Date().toISOString().slice(0, 10),
) {
  if (report.error || !report.vulnerabilities || !report.metadata)
    return ["Invalid audit response"];
  const tree = report.vulnerabilities,
    allowedNames = new Set([
      "picomatch",
      "fdir",
      "tinyglobby",
      "stylelint",
      "vite",
      "@vitejs/plugin-react",
    ]);
  const allowed = (name, seen = new Set()) => {
    if (seen.has(name) || !allowedNames.has(name)) return false;
    const item = tree[name];
    if (!item || item.severity === "critical" || !item.via?.length)
      return false;
    if (
      today > "2026-12-18" ||
      lock.packages?.["node_modules/picomatch"]?.version !== "4.0.7"
    )
      return false;
    return item.via.every((v) =>
      typeof v === "string"
        ? allowed(v, new Set([...seen, name]))
        : v.name === "picomatch" &&
          v.url === "https://github.com/advisories/GHSA-fc5q-39xc-vjpf" &&
          v.range === "<=4.0.7" &&
          v.severity === "high",
    );
  };
  return Object.keys(tree).filter((name) => !allowed(name));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = spawnSync(
    process.execPath,
    [process.env.npm_execpath, "audit", "--json"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  if (result.error || ![0, 1].includes(result.status))
    throw new Error("Audit could not run: " + (result.stderr || result.error));
  const report = JSON.parse(result.stdout),
    lock = JSON.parse(
      readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
    );
  const failures = auditFailures(report, lock);
  if (failures.length) {
    console.error("Security audit blocked:", failures.join(", "));
    process.exitCode = 1;
  } else if (Object.keys(report.vulnerabilities).length)
    console.log(
      "Known build-only advisory GHSA-fc5q-39xc-vjpf: temporary exception until 2026-12-18. See docs/GUVENLIK-ISTISNASI-1.26.0.md.",
    );
  else console.log("Security audit: no known vulnerabilities.");
}
